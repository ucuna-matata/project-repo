import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Download, Sparkles, Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cvFormSchema, type CVFormData } from '../schemas/cvSchema';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import CVTemplateClean from '../components/cv/CVTemplateClean';
import CVTemplateTwoColumn from '../components/cv/CVTemplateTwoColumn';
import * as api from '../services/api';
import type { CV } from '../types/api';

export default function CVMasterNew() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeCV] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  useQuery<CV[]>({
    queryKey: ['cvs'],
    queryFn: api.listCVs,
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      title: 'My CV',
      template_key: 'clean',
      personal: { name: '', email: '', phone: '', location: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
    },
  });

  // Watch form for real-time preview
  const formData = useWatch({ control });

  const saveMutation = useMutation({
    mutationFn: (data: CVFormData) => {
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
        },
      };
      return activeCV ? api.updateCV(activeCV, payload) : api.createCV(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      alert('CV saved successfully!');
    },
  });

  const generateMutation = useMutation({
    mutationFn: (targetRole: string) => api.generateCV({ targetRole }),
    onSuccess: (data: any) => {
      if (data.sections) {
        setValue('summary', data.sections.summary || '');
        setValue('experience', data.sections.experience || []);
        setValue('education', data.sections.education || []);
        setValue('skills', data.sections.skills || []);
      }
      setGenerateModal(false);
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const exportMutation = useMutation({
    mutationFn: (id: string) => api.requestCvExport(id, 'pdf'),
    onSuccess: (data: any) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
  });

  const onSubmit = (data: CVFormData) => {
    saveMutation.mutate(data);
  };

  const handleGenerate = () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    generateMutation.mutate(targetRole);
  };

  // Convert form data to CV type for preview
  const previewCV: CV = {
    id: activeCV || 'preview',
    user_id: 'user',
    title: formData.title || 'My CV',
    template_key: formData.template_key || 'clean',
    sections: {
      personal: formData.personal,
      summary: formData.summary,
      experience: (formData.experience || []) as any,
      education: (formData.education || []) as any,
      skills: formData.skills,
      projects: (formData.projects || []) as any,
    },
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('cv.title')}</h1>
          <p className="mt-2 text-gray-600">Create and manage your professional CV</p>
        </div>
        <Button onClick={() => setGenerateModal(true)} variant="secondary">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* CV Title and Template */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CV Title</label>
              <input
                {...register('title')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="My Professional CV"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                {...register('template_key')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="clean">Clean Single-Column</option>
                <option value="two-column">Two-Column</option>
              </select>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <input
                    {...register('personal.name')}
                    placeholder="Full Name *"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.personal?.name && <p className="text-sm text-red-600 mt-1">{errors.personal.name.message}</p>}
                </div>
                <input
                  {...register('personal.email')}
                  type="email"
                  placeholder="Email *"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.personal?.email && <p className="text-sm text-red-600 mt-1">{errors.personal.email.message}</p>}
                <input
                  {...register('personal.phone')}
                  placeholder="Phone"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  {...register('personal.location')}
                  placeholder="Location"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  {...register('personal.linkedin')}
                  placeholder="LinkedIn URL"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  {...register('personal.website')}
                  placeholder="Website URL"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                {...register('summary')}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief summary of your professional background..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save CV'}
              </Button>
              {activeCV && (
                <Button type="button" variant="secondary" onClick={() => exportMutation.mutate(activeCV)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </form>

          <p className="text-sm text-gray-500 italic">
            Note: This is a simplified editor. Use FieldArrayEditor components for experience/education/skills sections for full functionality.
          </p>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow overflow-auto" style={{ maxHeight: '90vh' }}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <span className="text-sm text-gray-500">{formData.template_key === 'clean' ? 'Clean Template' : 'Two-Column Template'}</span>
          </div>
          <div className="p-4 bg-gray-50">
            {formData.template_key === 'two-column' ? (
              <CVTemplateTwoColumn cv={previewCV} />
            ) : (
              <CVTemplateClean cv={previewCV} />
            )}
          </div>
        </div>
      </div>

      {/* AI Generate Modal */}
      <Modal isOpen={generateModal} onClose={() => !isGenerating && setGenerateModal(false)} title="Generate CV with AI">
        <div className="space-y-4">
          <p className="text-gray-600">Tell us about your target role and we'll generate a CV draft for you.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Senior Frontend Developer"
              disabled={isGenerating}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setGenerateModal(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating || !targetRole.trim()}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
