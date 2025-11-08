// CV Template B: Two-Column Layout
import type { CV } from '../../services';
import type { CVFormData } from '../../schemas/cvSchema';

interface CVTemplateTwoColumnProps {
  cv: CV;
}

// Type definitions for sections
type Experience = CVFormData['experience'][number];
type Education = CVFormData['education'][number];
type Project = NonNullable<CVFormData['projects']>[number];
type Language = NonNullable<CVFormData['languages']>[number];
type Certification = NonNullable<CVFormData['certifications']>[number];

export default function CVTemplateTwoColumn({ cv }: CVTemplateTwoColumnProps) {
  const { sections } = cv;
  const personal = sections?.personal || {};
  const summary = sections?.summary || '';
  const experience = sections?.experience || [];
  const education = sections?.education || [];
  const skills = sections?.skills || [];
  const projects = sections?.projects || [];
  const languages = sections?.languages || [];
  const certifications = sections?.certifications || [];

  return (
    <div className="cv-template cv-template-two-column bg-white max-w-[210mm] mx-auto shadow-lg print:shadow-none flex">
      {/* Left Sidebar - 30% */}
      <aside className="w-[30%] bg-gray-50 p-6 print:bg-gray-50">
        {/* Photo (optional) */}
        {(personal as Record<string, unknown>).photo ? (
          <div className="mb-6">
            <img
              src={String((personal as Record<string, unknown>).photo)}
              alt={personal.name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
            />
          </div>
        ) : null}

        {/* Contact */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-500 pb-1">
            Contact
          </h2>
          <div className="space-y-2 text-xs text-gray-700">
            {personal.email && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <a href={personal.linkedin} className="hover:text-blue-600 break-all text-xs">
                  LinkedIn
                </a>
              </div>
            )}
            {personal.website && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href={personal.website} className="hover:text-blue-600 break-all text-xs">
                  {personal.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-500 pb-1">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill: string, idx: number) => (
                <div key={idx} className="text-xs text-gray-700">
                  <div className="mb-1">{skill}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-500 pb-1">
              Languages
            </h2>
            <ul className="space-y-1 text-xs text-gray-700">
              {languages.map((lang: Language, idx: number) => (
                <li key={idx}>
                  <span className="font-medium">{lang.name}</span>
                  {lang.level && <span className="text-gray-600"> - {lang.level}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-500 pb-1">
              Certifications
            </h2>
            <ul className="space-y-2 text-xs text-gray-700">
              {certifications.map((cert: Certification, idx: number) => (
                <li key={idx}>
                  <div className="font-medium">{cert.name}</div>
                  {cert.issuer && <div className="text-gray-600">{cert.issuer}</div>}
                  {cert.date && <div className="text-gray-600">{cert.date}</div>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Right Main Content - 70% */}
      <main className="w-[70%] p-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            {personal.name || 'Your Name'}
          </h1>
          {(personal as Record<string, unknown>).title ? (
            <h2 className="text-xl text-blue-600 font-medium mb-2">{String((personal as Record<string, unknown>).title)}</h2>
          ) : null}
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-2 border-b-2 border-blue-500 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-blue-500 pb-1">
              Experience
            </h2>
            {experience.map((exp: Experience, idx: number) => (
              <div key={idx} className="mb-4 last:mb-0 relative pl-4 border-l-2 border-blue-300">
                <div className="absolute -left-[5px] top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {exp.company}
                  {exp.location && <span className="text-gray-600"> • {exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-600 mb-2">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700">
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
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-blue-500 pb-1">
              Education
            </h2>
            {education.map((edu: Education, idx: number) => (
              <div key={idx} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                    {edu.start_date} - {edu.end_date || 'Present'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {edu.institution}
                  {edu.location && <span className="text-gray-600"> • {edu.location}</span>}
                </div>
                {edu.description && (
                  <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-blue-500 pb-1">
              Projects
            </h2>
            {projects.map((project: Project, idx: number) => (
              <div key={idx} className="mb-3 last:mb-0">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {project.name}
                  {project.url && (
                    <a href={project.url} className="ml-2 text-xs text-blue-600 hover:underline">
                      Link
                    </a>
                  )}
                </h3>
                {project.description && (
                  <p className="text-xs text-gray-700">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
