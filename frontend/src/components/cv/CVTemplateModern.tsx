// CV Template: Modern with accent colors and clean design
import type { CV } from '../../services';
import type { CVFormData } from '../../schemas/cvSchema';

interface CVTemplateModernProps {
  cv: CV;
}

// Type definitions for sections
type Experience = CVFormData['experience'][number];
type Education = CVFormData['education'][number];
type Project = NonNullable<CVFormData['projects']>[number];

export default function CVTemplateModern({ cv }: CVTemplateModernProps) {
  const { sections } = cv;
  const personal = sections?.personal || {};
  const summary = sections?.summary || '';
  const experience = sections?.experience || [];
  const education = sections?.education || [];
  const skills = sections?.skills || [];
  const projects = sections?.projects || [];

  return (
    <div className="cv-template cv-template-modern bg-white max-w-[210mm] mx-auto shadow-lg print:shadow-none">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">
          {personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personal.email && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {personal.location}
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          {personal.linkedin && (
            <a href={personal.linkedin} className="hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
              </svg>
              LinkedIn
            </a>
          )}
          {personal.website && (
            <a href={personal.website} className="hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Professional Summary */}
        {summary && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            </div>
            {experience.map((exp: Experience, idx: number) => (
              <div key={idx} className="mb-5 relative pl-6 border-l-2 border-gray-200 last:mb-0">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <div className="text-blue-700 font-semibold">
                      {exp.company}
                      {exp.location && <span className="text-gray-600 font-normal"> • {exp.location}</span>}
                    </div>
                    <span className="text-sm text-gray-600">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2 text-sm">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            {education.map((edu: Education, idx: number) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <div className="text-blue-700 font-semibold">
                      {edu.institution}
                      {edu.location && <span className="text-gray-600 font-normal"> • {edu.location}</span>}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {edu.start_date} - {edu.end_date || 'Present'}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-gray-700 text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 rounded-full text-sm font-medium border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project: Project, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 mb-2 text-sm">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

