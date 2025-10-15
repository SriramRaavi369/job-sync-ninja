import React from 'react';
import type { ParsedResumeData } from "@/pages/ResumeBuilder";

interface ResumePreviewProps {
  resumeData: ParsedResumeData;
  templateId: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId }) => {
  // --- TEMPLATE 1: Blue Monogram (Resume-Now Inspired) ---
  const renderBlueMonogramTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Blue Accent */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-blue-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-blue-500 font-bold">•</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-blue-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-blue-600 border-l-4 border-blue-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  // --- TEMPLATE 2: Classic (Resume-Now Inspired) ---
  const renderClassicTemplate = (data: ParsedResumeData) => (
    <div className="font-serif text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-400 pb-6">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                <span className="text-sm font-semibold text-gray-700">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-gray-800">{exp.company}</h4>
                <span className="text-sm italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 font-bold text-gray-800">•</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                <span className="text-sm font-semibold text-gray-700">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="font-medium text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">SKILLS</h2>
          <div className="text-sm font-medium text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-gray-500 pb-2 text-gray-800">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  
  // --- TEMPLATE 3: Intelligent (Resume-Now Inspired) ---
  const renderIntelligentTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Style */}
      <div className="mb-8">
        <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500 mb-4"></div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-green-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-green-500 font-bold">▶</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-green-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-green-600 border-b border-green-200 pb-2">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 4: Novel (Resume-Now Inspired) ---
  const renderNovelTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Bold Colors */}
      <div className="mb-8">
        <div className="h-3 bg-gradient-to-r from-purple-600 to-pink-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-purple-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-purple-500 font-bold">●</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-purple-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-purple-600 border-l-4 border-purple-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 5: Spotlight (Resume-Now Inspired) ---
  const renderSpotlightTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Colorful Accent */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-orange-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-orange-500 font-bold">★</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-orange-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-orange-600 border-l-4 border-orange-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 6: Patterns (Resume-Now Inspired) ---
  const renderPatternsTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Pattern */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-indigo-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-indigo-500 font-bold">◆</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-indigo-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-indigo-600 border-l-4 border-indigo-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 7: Polished (Resume-Now Inspired) ---
  const renderPolishedTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Bold Header */}
      <div className="mb-8">
        <div className="h-3 bg-gradient-to-r from-teal-500 to-blue-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-teal-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-teal-500 font-bold">►</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-teal-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-teal-600 border-l-4 border-teal-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 8: Quote Bubble (Resume-Now Inspired) ---
  const renderQuoteBubbleTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Fun Design */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-cyan-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-cyan-500 font-bold">"</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-cyan-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-cyan-600 border-l-4 border-cyan-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 9: Trendy (Resume-Now Inspired) ---
  const renderTrendyTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Pop of Color */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-pink-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-pink-500 font-bold">→</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-pink-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-pink-600 border-l-4 border-pink-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
  // --- TEMPLATE 10: Unique (Resume-Now Inspired) ---
  const renderUniqueTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px] bg-white">
      {/* Header with Simple and Polished Styling */}
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4"></div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{data.fullName}</h1>
        <div className="text-sm space-y-1 text-gray-600">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          <div><a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium">LinkedIn Profile</a></div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">CORE SKILLS</h2>
          <div className="text-sm text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm text-emerald-600">{exp.company}</h4>
                <span className="text-xs italic text-gray-600">{exp.location}</span>
              </div>
              <ul className="text-sm space-y-2">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex} className="flex items-start">
                    <span className="mr-3 text-emerald-500 font-bold">✓</span>
                    <span className="text-gray-700">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-emerald-600">{edu.institution}</div>
                <div className="italic text-gray-600">{edu.location}</div>
                {edu.gpa && <div className="text-gray-700">GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">KEY PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
              <p className="text-sm mb-2 text-gray-700">{project.description}</p>
              <div className="text-sm italic text-gray-600">Technologies: {project.technologies.join(', ')}</div>
              {project.link && <div className="text-sm mt-1"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium">View Project</a></div>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase mb-4 text-emerald-600 border-l-4 border-emerald-600 pl-3">CERTIFICATIONS</h2>
          <ul className="text-sm space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index} className="flex justify-between font-medium">
                <span className="text-gray-800">{cert.name} - {cert.issuer}</span>
                <span className="text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
    const renderSection = (key: keyof ParsedResumeData, value: any, theme = 'default') => {
        switch (key) {
        case 'summary':
            return <p className="text-sm">{value}</p>;
        case 'skills':
            return <p className="text-sm">{Array.isArray(value) ? value.join(theme === 'classic' ? ' • ' : ', ') : value}</p>;
        case 'experience':
            return (
            <div>
                {value.map((exp: any, index: number) => (
                <div key={index} className="mb-3">
                    <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold text-base ${theme === 'executive' ? 'text-blue-900' : ''}`}>{exp.title} at {exp.company}</h3>
                    {theme !== 'chronological' && <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>}
                    </div>
                    <div className="flex justify-between items-baseline">
                    <p className="text-sm italic">{exp.location}</p>
                    {theme === 'chronological' && <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>}
                    </div>
                    <ul className="list-disc list-inside text-sm mt-1">
                    {exp.description.map((desc: string, descIndex: number) => (
                        desc.trim() && <li key={descIndex} className={theme === 'achievement' ? 'font-semibold' : ''}>{desc}</li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            );
        case 'education':
            return (
            <div>
                {value.map((edu: any, index: number) => (
                <div key={index} className="mb-3">
                    <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-base">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                    </div>
                    <p className="text-sm italic">{edu.institution}, {edu.location}</p>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                </div>
                ))}
            </div>
            );
        case 'projects':
            return (
            <div>
                {value.map((project: any, index: number) => (
                <div key={index} className="mb-3">
                    <h3 className="font-bold text-base">{project.name}</h3>
                    <p className="text-sm italic">Technologies: {project.technologies.join(", ")}</p>
                    <p className="text-sm">{project.description}</p>
                    {project.link && <p className="text-sm"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></p>}
                </div>
                ))}
            </div>
            );
        case 'certifications':
            return (
            <ul className="list-disc list-inside text-sm">
                {value.map((cert: any, index: number) => (
                <li key={index}>{cert.name} - {cert.issuer} ({cert.date})</li>
                ))}
            </ul>
            );
        default:
            return null;
        }
    };
  
  const renderTemplate = () => {
    switch (templateId) {
      case 'blue-monogram': return renderBlueMonogramTemplate(resumeData);
      case 'classic': return renderClassicTemplate(resumeData);
      case 'intelligent': return renderIntelligentTemplate(resumeData);
      case 'novel': return renderNovelTemplate(resumeData);
      case 'spotlight': return renderSpotlightTemplate(resumeData);
      case 'patterns': return renderPatternsTemplate(resumeData);
      case 'polished': return renderPolishedTemplate(resumeData);
      case 'quote-bubble': return renderQuoteBubbleTemplate(resumeData);
      case 'trendy': return renderTrendyTemplate(resumeData);
      case 'unique': return renderUniqueTemplate(resumeData);
      default: return renderBlueMonogramTemplate(resumeData);
    }
  };

    return (
        <div className="resume-preview-container bg-white shadow-lg">
        {renderTemplate()}
        </div>
    );
    };

export default ResumePreview;

