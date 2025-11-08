import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CVBuilder from '../components/cv/CVBuilder';
import { profileService } from '../services';
import type { CVFormData } from '../schemas/cvSchema';

export default function CVMaster() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('id');

  const [initialData, setInitialData] = useState<Partial<CVFormData> | undefined>();
  const [currentCVId, setCurrentCVId] = useState<string | null>(cvId);
  const [loading, setLoading] = useState(!!cvId);
  const [error, setError] = useState<string | null>(null);

  const loadCV = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const cv = await profileService.getCV(id);

      // Convert CV data to CVFormData format
      setInitialData({
        title: cv.title,
        template_key: cv.template_key,
        personal: cv.sections.personal,
        summary: cv.sections.summary,
        experience: cv.sections.experience,
        education: cv.sections.education,
        skills: cv.sections.skills,
        projects: cv.sections.projects,
        languages: cv.sections.languages,
        certifications: cv.sections.certifications,
      });

      setError(null);
    } catch (err) {
      console.error('Failed to load CV:', err);
      setError(t('cv.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (cvId && cvId !== currentCVId) {
      loadCV(cvId);
      setCurrentCVId(cvId);
    }
  }, [cvId, currentCVId, loadCV]);

  const handleSave = useCallback(async (data: CVFormData) => {
    try {
      const payload = {
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
      };

      if (currentCVId) {
        // Update existing CV
        await profileService.updateCV(currentCVId, payload);
      } else {
        // Create new CV
        const savedCV = await profileService.createCV(payload);
        setCurrentCVId(savedCV.id);
        // Update URL with the new CV ID
        navigate(`/cv-master?id=${savedCV.id}`, { replace: true });
      }

      alert(t('cv.cvSaved'));
    } catch (error) {
      console.error('Failed to save CV:', error);
      alert(t('cv.saveFailed'));
      throw error;
    }
  }, [currentCVId, navigate, t]);

  const handleGenerate = useCallback(async (data: Partial<CVFormData>) => {
    try {
      // Call AI generation endpoint
      const generatedCV = await profileService.generateCV(data);

      // Load the generated CV
      setCurrentCVId(generatedCV.id);
      navigate(`/cv-master?id=${generatedCV.id}`, { replace: true });

      alert(t('cv.cvGenerated'));
    } catch (error) {
      console.error('Failed to generate CV:', error);
      alert(t('cv.generateFailed'));
      throw error;
    }
  }, [navigate, t]);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('cv.title')}</h1>
        <p className="mt-2 text-gray-600">
          {currentCVId ? t('cv.edit') : t('cv.createNew')}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <CVBuilder
        initialData={initialData}
        cvId={currentCVId || undefined}
        onSave={handleSave}
        onGenerate={handleGenerate}
      />
    </div>
  );
}