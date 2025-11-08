import { useState, useEffect, useMemo } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, Sparkles } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cvFormSchema, type CVFormData } from '../../schemas/cvSchema';
import CVPreview from './CVPreview';
import CVExportButtons from './CVExportButtons';
import { useProfile } from '../../hooks/useApi';

interface CVBuilderProps {
  initialData?: Partial<CVFormData>;
  cvId?: string;
  onSave?: (data: CVFormData) => Promise<void>;
  onGenerate?: (data: Partial<CVFormData>) => Promise<void>;
}

const defaultFormValues: CVFormData = {
  title: 'My CV',
  template_key: 'clean',
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export default function CVBuilder({ initialData, cvId, onSave, onGenerate }: CVBuilderProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user profile to auto-populate name and email
  const { data: profile } = useProfile();

  const formDefaultValues = useMemo(() => {
    // If initialData is provided, use it (editing existing CV)
    if (initialData) {
      return { ...defaultFormValues, ...initialData };
    }

    // Otherwise, pre-fill from profile (new CV)
    if (profile) {
      return {
        ...defaultFormValues,
        personal: {
          ...defaultFormValues.personal,
          name: profile.full_name || '',
          email: profile.email || '',
        },
      };
    }

    return defaultFormValues;
  }, [initialData, profile]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: formDefaultValues,
  });

  // Update form when initialData or profile changes
  useEffect(() => {
    if (initialData) {
      reset({ ...defaultFormValues, ...initialData });
    } else if (profile) {
      // Pre-fill from profile for new CVs
      reset({
        ...defaultFormValues,
        personal: {
          ...defaultFormValues.personal,
          name: profile.full_name || '',
          email: profile.email || '',
        },
      });
    }
  }, [initialData, profile, reset]);

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: 'projects' });

  // Watch all form data for real-time preview
  const formData = watch();

  // Memoize preview data to prevent unnecessary re-renders
  const previewData = useMemo(() => formData, [formData]);

  const onSubmit = async (data: CVFormData) => {
    setIsSaving(true);
    try {
      await onSave?.(data);
    } catch (error) {
      console.error('Failed to save CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate?.(formData);
    } catch (error) {
      console.error('Failed to generate CV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">CV Builder</h2>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Software Engineer CV"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                {...register('template_key')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="clean">Clean</option>
                <option value="two-column">Two Column</option>
                <option value="modern">Modern</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('personal.name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.personal?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personal.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('personal.email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.personal?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.personal.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('personal.phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('personal.location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  {...register('personal.linkedin')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website/Portfolio
                </label>
                <input
                  type="url"
                  {...register('personal.website')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
            <textarea
              {...register('summary')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief overview of your professional background, key skills, and career objectives..."
            />
          </div>

          {/* Experience */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <button
                type="button"
                onClick={() =>
                  appendExperience({
                    company: '',
                    position: '',
                    start_date: '',
                    end_date: '',
                    location: '',
                    description: '',
                    achievements: [],
                  })
                }
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Experience
              </button>
            </div>

            {experienceFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Experience {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.position`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.company`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Tech Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.start_date`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Jan 2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.end_date`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Present or Dec 2023"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.location`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="New York, NY"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`experience.${index}.description`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your role and responsibilities..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                type="button"
                onClick={() =>
                  appendEducation({
                    institution: '',
                    degree: '',
                    start_date: '',
                    end_date: '',
                    location: '',
                    description: '',
                  })
                }
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Education
              </button>
            </div>

            {educationFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Education {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree *
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.degree`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution *
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.institution`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="University Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.start_date`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="2015"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.end_date`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="2019 or Expected 2024"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.location`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Boston, MA"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`education.${index}.description`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="GPA, honors, relevant coursework..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <textarea
              {...register('skills', {
                setValueAs: (value) => {
                  if (typeof value === 'string') {
                    return value.split(',').map((s) => s.trim()).filter(Boolean);
                  }
                  return value;
                },
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Python, SQL)"
              defaultValue={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
            />
            <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
          </div>

          {/* Projects */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <button
                type="button"
                onClick={() =>
                  appendProject({
                    name: '',
                    description: '',
                    url: '',
                    technologies: [],
                  })
                }
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </button>
            </div>

            {projectFields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Project {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      {...register(`projects.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`projects.${index}.description`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the project and your contributions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      {...register(`projects.${index}.url`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies
                    </label>
                    <input
                      type="text"
                      {...register(`projects.${index}.technologies`, {
                        setValueAs: (value) => {
                          if (typeof value === 'string') {
                            return value.split(',').map((s) => s.trim()).filter(Boolean);
                          }
                          return value;
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="React, Node.js, MongoDB"
                      defaultValue={Array.isArray(formData.projects?.[index]?.technologies) ? formData.projects[index].technologies.join(', ') : ''}
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate with commas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white pb-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save CV
                </>
              )}
            </button>

            {onGenerate && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generate
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className={`bg-white rounded-lg shadow ${showPreview ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
          {cvId && (
            <div className="flex gap-2">
              <CVExportButtons cvId={cvId} cvTitle={previewData.title} />
            </div>
          )}
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          <CVPreview data={previewData} />
        </div>
      </div>
    </div>
  );
}

