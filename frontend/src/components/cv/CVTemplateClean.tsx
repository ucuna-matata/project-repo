// CV Template A: Clean Single-Column
import type { CV } from '../../services';
import type { CVFormData } from '../../schemas/cvSchema';

interface CVTemplateCleanProps {
  cv: CV;
}

// Type definitions for sections
type Experience = CVFormData['experience'][number];
type Education = CVFormData['education'][number];
type Project = NonNullable<CVFormData['projects']>[number];

export default function CVTemplateClean({ cv }: CVTemplateCleanProps) {
  const { sections } = cv;
  const personal = sections?.personal || {};
  const summary = sections?.summary || '';
  const experience = sections?.experience || [];
  const education = sections?.education || [];
  const skills = sections?.skills || [];
  const projects = sections?.projects || [];

  return (
    <div className="cv-template cv-template-clean bg-white p-8 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:p-0">
      {/* Header */}
      <header className="mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personal.email && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personal.location}
            </span>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} className="flex items-center gap-1 hover:text-blue-600">
              LinkedIn
            </a>
          )}
          {personal.website && (
            <a href={personal.website} className="flex items-center gap-1 hover:text-blue-600">
              {personal.website}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Experience
          </h2>
          {experience.map((exp: Experience, idx: number) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </span>
              </div>
              <div className="text-base font-medium text-gray-700 mb-2">
                {exp.company}
                {exp.location && <span className="text-gray-600"> • {exp.location}</span>}
              </div>
              {exp.description && (
                <p className="text-gray-600 mb-2">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu: Education, idx: number) => (
            <div key={idx} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <span className="text-sm text-gray-600">
                  {edu.start_date} - {edu.end_date || 'Present'}
                </span>
              </div>
              <div className="text-base font-medium text-gray-700">
                {edu.institution}
                {edu.location && <span className="text-gray-600"> • {edu.location}</span>}
              </div>
              {edu.description && (
                <p className="text-gray-600 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Projects
          </h2>
          {projects.map((project: Project, idx: number) => (
            <div key={idx} className="mb-3 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {project.name}
                {project.url && (
                  <a href={project.url} className="ml-2 text-sm text-blue-600 hover:underline">
                    Link
                  </a>
                )}
              </h3>
              {project.description && (
                <p className="text-gray-700">{project.description}</p>
              )}
              {project.technologies && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
