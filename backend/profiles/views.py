from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse

from .models import Profile, CV
from .serializers import ProfileSerializer, CVSerializer, CVCreateSerializer, CVUpdateSerializer
from .services.cv_export_service import CVExportService
from authz.models import AuditEvent, DeletionRequest
from authz.serializers import UserSerializer
from interview.models import InterviewSession
from trainer.models import TrainerResult


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    """Get or update user profile."""
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            # Track changes in history
            old_data = ProfileSerializer(profile).data
            serializer.save()

            # Log changes
            changes = []
            for field in request.data:
                if field in old_data and old_data[field] != request.data[field]:
                    changes.append({
                        'field': field,
                        'old_value': old_data[field],
                        'new_value': request.data[field],
                        'ts': timezone.now().isoformat()
                    })

            if changes:
                history = profile.history_log or []
                history.extend(changes)
                profile.history_log = history[-100:]  # Keep last 100 changes
                profile.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cv_list(request):
    """List all CVs or create a new one."""
    if request.method == 'GET':
        cvs = CV.objects.filter(user=request.user)
        serializer = CVSerializer(cvs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CVCreateSerializer(data=request.data)
        if serializer.is_valid():
            cv = serializer.save(user=request.user)

            # Create audit event
            AuditEvent.objects.create(
                user=request.user,
                type='cv_create',
                payload={'cv_id': str(cv.id), 'title': cv.title}
            )

            return Response(CVSerializer(cv).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def cv_detail(request, cv_id):
    """Get, update, or delete a specific CV."""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)

    if request.method == 'GET':
        serializer = CVSerializer(cv)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CVUpdateSerializer(cv, data=request.data, partial=True)
        if serializer.is_valid():
            # Track version and changes
            old_data = CVSerializer(cv).data
            cv.version += 1

            changelog_entry = {
                'version': cv.version,
                'ts': timezone.now().isoformat(),
                'changes': {}
            }

            for field in request.data:
                if field in old_data and old_data[field] != request.data[field]:
                    changelog_entry['changes'][field] = {
                        'old': old_data[field],
                        'new': request.data[field]
                    }

            serializer.save()

            if changelog_entry['changes']:
                changelog = cv.changelog or []
                changelog.append(changelog_entry)
                cv.changelog = changelog[-50:]  # Keep last 50 versions
                cv.save()

            # Create audit event
            AuditEvent.objects.create(
                user=request.user,
                type='cv_update',
                payload={'cv_id': str(cv.id), 'version': cv.version}
            )

            return Response(CVSerializer(cv).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cv.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def cv_export(request, cv_id):
    """Export CV to PDF or DOCX format. Pure Django view without DRF."""
    import logging
    import json
    logger = logging.getLogger(__name__)

    # Check authentication manually (since we're not using DRF decorators)
    if not request.user.is_authenticated:
        return HttpResponse(
            json.dumps({'error': 'Authentication required'}),
            content_type='application/json',
            status=401
        )

    # Only allow GET requests
    if request.method != 'GET':
        return HttpResponse(
            json.dumps({'error': 'Method not allowed'}),
            content_type='application/json',
            status=405
        )

    logger.info(f"CV Export request - cv_id: {cv_id}, user: {request.user}")

    # Check if CV exists and belongs to user
    try:
        cv = CV.objects.get(id=cv_id, user=request.user)
        logger.info(f"CV found: {cv.title}")
    except CV.DoesNotExist:
        logger.error(f"CV not found or access denied: {cv_id}")
        return HttpResponse(
            json.dumps({'error': 'CV not found'}),
            content_type='application/json',
            status=404
        )

    # Get format from query parameter (default to pdf)
    export_format = request.GET.get('format', 'pdf').lower()

    if export_format not in ['pdf', 'docx']:
        return HttpResponse(
            json.dumps({'error': 'Invalid format. Use "pdf" or "docx".'}),
            content_type='application/json',
            status=400
        )

    try:
        # Export CV using the service
        if export_format == 'pdf':
            file_buffer, filename = CVExportService.export_to_pdf(cv)
            content_type = 'application/pdf'
        else:  # docx
            file_buffer, filename = CVExportService.export_to_docx(cv)
            content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

        # Create audit event
        AuditEvent.objects.create(
            user=request.user,
            type='cv_export',
            payload={'cv_id': str(cv.id), 'format': export_format}
        )

        logger.info(f"Export successful: {filename}")

        # Return file as response
        file_data = file_buffer.getvalue()
        response = HttpResponse(file_data, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['Content-Length'] = len(file_data)
        return response

    except Exception as e:
        logger.exception(f"Export failed: {str(e)}")
        return HttpResponse(
            json.dumps({'error': f'Export failed: {str(e)}'}),
            content_type='application/json',
            status=500
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_data(request):
    """Export all user data as JSON."""
    user_serializer = UserSerializer(request.user)
    profile_serializer = ProfileSerializer(request.user.profile) if hasattr(request.user, 'profile') else None

    cvs = CV.objects.filter(user=request.user)
    cv_serializer = CVSerializer(cvs, many=True)

    interviews = InterviewSession.objects.filter(user=request.user)
    from interview.serializers import InterviewSessionSerializer
    interview_serializer = InterviewSessionSerializer(interviews, many=True)

    trainer_results = TrainerResult.objects.filter(user=request.user)
    from trainer.serializers import TrainerResultSerializer
    trainer_serializer = TrainerResultSerializer(trainer_results, many=True)

    export_data_dict = {
        'version': '1.0',
        'exported_at': timezone.now().isoformat(),
        'user': user_serializer.data,
        'profile': profile_serializer.data if profile_serializer else None,
        'cvs': cv_serializer.data,
        'interviews': interview_serializer.data,
        'trainer_results': trainer_serializer.data,
    }

    # Create audit event
    AuditEvent.objects.create(
        user=request.user,
        type='export',
        payload={'format': 'json'}
    )

    return Response(export_data_dict)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def erase_data(request):
    """Request complete data deletion (GDPR)."""
    # Check if already has pending request
    if hasattr(request.user, 'deletion_request'):
        return Response(
            {'error': 'Deletion request already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create deletion request
    deletion_request = DeletionRequest.objects.create(user=request.user)

    # Create audit event
    AuditEvent.objects.create(
        user=request.user,
        type='erase',
        payload={'request_id': str(deletion_request.id)}
    )

    # Immediately process deletion (for MVP)
    try:
        deletion_request.status = 'processing'
        deletion_request.save()

        # Delete user data (cascade will handle related objects)
        user_id = request.user.id
        request.user.delete()

        deletion_request.status = 'completed'
        deletion_request.processed_at = timezone.now()
        deletion_request.save()

        return Response({'status': 'completed', 'message': 'All data has been deleted'})
    except Exception as e:
        deletion_request.status = 'failed'
        deletion_request.error_message = str(e)
        deletion_request.save()
        return Response(
            {'status': 'failed', 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'ok', 'timestamp': timezone.now().isoformat()})

