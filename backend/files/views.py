from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """Upload a file (CV, documents, etc.)"""
    file_obj = request.FILES.get('file')
    if not file_obj:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Save file and return URL
    return Response({'message': 'File upload - implementation pending'})


@api_view(['GET', 'DELETE'])
def file_detail(request, pk):
    """Get or delete a specific file"""
    return Response({'message': f'File {pk} - implementation pending'})

