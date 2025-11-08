// CV Template: Professional with classic business style
import type { CV } from '../../services';
import type { CVFormData } from '../../schemas/cvSchema';

interface CVTemplateProfessionalProps {
  cv: CV;
}

// Type definitions for sections
type Experience = CVFormData['experience'][number];
type Education = CVFormData['education'][number];
type Project = NonNullable<CVFormData['projects']>[number];

export default function CVTemplateProfessional({ cv }: CVTemplateProfessionalProps) {
  const { sections } = cv;
  const personal = sections?.personal || {};
  const summary = sections?.summary || '';
  const experience = sections?.experience || [];
  const education = sections?.education || [];
  const skills = sections?.skills || [];
  const projects = sections?.projects || [];

  return (
    <div className="cv-template cv-template-professional bg-white p-10 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:p-0">
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-4 border-gray-800">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-3">
          {personal.name || 'Your Name'}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          {personal.email && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personal.location}
            </span>
          )}
        </div>
        {(personal.linkedin || personal.website) && (
          <div className="flex justify-center gap-6 mt-2 text-sm">
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                className="text-gray-700 hover:text-gray-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            )}
            {personal.website && (
              <a
                href={personal.website}
                className="text-gray-700 hover:text-gray-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio Website
              </a>
            )}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 uppercase tracking-wider pb-1 border-b-2 border-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 uppercase tracking-wider pb-1 border-b-2 border-gray-800">
            Professional Experience
          </h2>
          {experience.map((exp: Experience, idx: number) => (
            <div key={idx} className="mb-5 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <div className="text-base font-semibold text-gray-700">
                    {exp.company}
                    {exp.location && <span className="font-normal text-gray-600"> • {exp.location}</span>}
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                  {exp.start_date} – {exp.end_date || 'Present'}
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-700 mb-2 leading-relaxed">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i} className="leading-relaxed">{achievement}</li>
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
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 uppercase tracking-wider pb-1 border-b-2 border-gray-800">
            Education
          </h2>
          {education.map((edu: Education, idx: number) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <div className="text-base font-semibold text-gray-700">
                    {edu.institution}
                    {edu.location && <span className="font-normal text-gray-600"> • {edu.location}</span>}
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                  {edu.start_date} – {edu.end_date || 'Present'}
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-700 leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 uppercase tracking-wider pb-1 border-b-2 border-gray-800">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {skills.map((skill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 uppercase tracking-wider pb-1 border-b-2 border-gray-800">
            Notable Projects
          </h2>
          {projects.map((project: Project, idx: number) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-700 hover:text-gray-900 underline whitespace-nowrap ml-4"
                  >
                    View Project
                  </a>
                )}
              </div>
              {project.description && (
                <p className="text-gray-700 mb-2 leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Technologies: </span>
                  {project.technologies.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

