import { useMemo, memo } from 'react';
import { type CVFormData } from '../../schemas/cvSchema';
import CVTemplateClean from './CVTemplateClean';
import CVTemplateTwoColumn from './CVTemplateTwoColumn';
import CVTemplateModern from './CVTemplateModern';
import CVTemplateProfessional from './CVTemplateProfessional';
import type { CV } from '../../services';

interface CVPreviewProps {
  data: CVFormData;
}

function CVPreview({ data }: CVPreviewProps) {
  // Convert CVFormData to CV format for templates - memoized to prevent re-creation
  const cvData = useMemo(
    () => ({
      id: 'preview',
      title: data.title,
      template_key: data.template_key,
      sections: {
        personal: data.personal,
        summary: data.summary,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        projects: data.projects,
        languages: data.languages,
        certifications: data.certifications,
      },
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      changelog: [],
    } as CV),
    [
      data.title,
      data.template_key,
      data.personal,
      data.summary,
      data.experience,
      data.education,
      data.skills,
      data.projects,
      data.languages,
      data.certifications,
    ]
  );

  const renderTemplate = useMemo(() => {
    switch (data.template_key) {
      case 'two-column':
        return <CVTemplateTwoColumn cv={cvData} />;
      case 'modern':
        return <CVTemplateModern cv={cvData} />;
      case 'professional':
        return <CVTemplateProfessional cv={cvData} />;
      case 'clean':
      default:
        return <CVTemplateClean cv={cvData} />;
    }
  }, [data.template_key, cvData]);

  if (!data.personal?.name) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] bg-gray-50">
        <div className="text-center p-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Preview Available
          </h3>
          <p className="text-gray-600">
            Fill in your name and other details to see a live preview of your CV
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 md:p-8 transition-opacity duration-200">
      <div className="transform scale-90 origin-top">{renderTemplate}</div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(CVPreview);
