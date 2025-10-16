import React from 'react';
import type { ParsedResumeData } from "@/pages/ResumeBuilder";

interface ResumePreviewProps {
  resumeData: ParsedResumeData;
  templateId: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId }) => {
  
  // TEMPLATE 1: Executive Leadership
  const renderExecutive = (data: ParsedResumeData) => (
    <div className="font-serif bg-white p-10 text-gray-900">
      <header className="mb-8 text-center border-b-2 border-gray-900 pb-6">
        <h1 className="text-4xl font-bold mb-3">{data.fullName}</h1>
        <div className="flex justify-center gap-4 text-sm">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>•</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Executive Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Professional Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-base">{exp.title}</h3>
                <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">{exp.company}</span>
                <span className="text-sm">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-5 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-sm">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Core Competencies</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              {cert.name} - {cert.issuer} ({cert.date})
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 2: Software Engineer
  const renderSoftwareEngineer = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-8 text-gray-900">
      <header className="mb-6 pb-4 border-b-2 border-blue-600">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>|</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>|</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Technical Skills</h2>
          <p className="text-sm">{data.skills.join(' • ')}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Work Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-semibold text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Projects</h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold text-sm">{proj.name}</h3>
              <p className="text-sm mb-1">{proj.description}</p>
              <p className="text-xs text-gray-600">Tech Stack: {proj.technologies.join(', ')}</p>
              {proj.link && <p className="text-xs text-gray-600">{proj.link}</p>}
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="text-xs text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 3: Business Professional
  const renderBusiness = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-9 text-gray-900">
      <header className="mb-7 pb-5 border-b border-gray-400">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{data.fullName}</h1>
        <div className="text-sm text-gray-700 space-x-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>•</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 text-gray-800">Professional Profile</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3 text-gray-800">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3 text-gray-800">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 text-gray-800">Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );

  // TEMPLATE 4: Finance Professional
  const renderFinance = (data: ParsedResumeData) => (
    <div className="font-serif bg-white p-10 text-gray-900">
      <header className="text-center mb-7 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="text-sm flex justify-center gap-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>|</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>|</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3">Professional Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="italic text-sm">{exp.company}</span>
                <span className="text-xs">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-5 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="text-xs">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              <span className="font-semibold">{cert.name}</span> - {cert.issuer}, {cert.date}
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );

  // TEMPLATE 5: Marketing Professional
  const renderMarketing = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-8 text-gray-900">
      <header className="mb-6 pb-4 border-b-2 border-purple-600">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>•</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm">{cert.name} - {cert.issuer}</div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 6: Recent Graduate
  const renderRecentGrad = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-8 text-gray-900">
      <header className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="text-sm text-gray-700 space-x-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>•</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Objective</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-sm">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Projects</h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold text-sm">{proj.name}</h3>
              <p className="text-sm mb-1">{proj.description}</p>
              <p className="text-xs text-gray-600">Technologies: {proj.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );

  // TEMPLATE 7: Career Changer
  const renderCareerChanger = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-9 text-gray-900">
      <header className="mb-6 pb-4 border-b-2 border-green-600">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="text-sm flex flex-wrap gap-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>|</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>|</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Key Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Professional Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Relevant Projects</h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold text-sm">{proj.name}</h3>
              <p className="text-sm mb-1">{proj.description}</p>
              <p className="text-xs text-gray-600">Skills Applied: {proj.technologies.join(', ')}</p>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 8: Project Manager
  const renderProjectManager = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-9 text-gray-900">
      <header className="mb-7 pb-5 border-b-2 border-orange-600">
        <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
        <div className="text-sm flex gap-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Core Competencies</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Professional Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2">Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              {cert.name} - {cert.issuer} ({cert.date})
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 9: Creative Professional
  const renderCreative = (data: ParsedResumeData) => (
    <div className="font-sans bg-white p-8 text-gray-900">
      <header className="mb-6">
        <div className="h-1 w-24 bg-gray-900 mb-4"></div>
        <h1 className="text-4xl font-light mb-2">{data.fullName}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>•</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2">About</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-3">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">{exp.company}</span>
                <span className="text-xs text-gray-600">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-4 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2">Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // TEMPLATE 10: Healthcare Professional
  const renderHealthcare = (data: ParsedResumeData) => (
    <div className="font-serif bg-white p-9 text-gray-900">
      <header className="mb-7 pb-4 border-b border-gray-400">
        <h1 className="text-3xl font-bold mb-2 text-center">{data.fullName}</h1>
        <div className="text-sm text-center space-x-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Licenses & Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              {cert.name} - {cert.issuer} ({cert.date})
            </div>
          ))}
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3">Professional Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{exp.company}</span>
                <span className="text-xs">{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.description.map((desc, i) => desc.trim() && (
                  <li key={i} className="text-sm ml-5 list-disc">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{edu.degree}</span>
                <span className="text-xs">{edu.graduationDate}</span>
              </div>
              <div className="text-sm">{edu.institution}, {edu.location}</div>
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2">Clinical Skills</h2>
          <div className="text-sm">{data.skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (templateId) {
      case 'executive': return renderExecutive(resumeData);
      case 'software-engineer': return renderSoftwareEngineer(resumeData);
      case 'business': return renderBusiness(resumeData);
      case 'finance': return renderFinance(resumeData);
      case 'marketing': return renderMarketing(resumeData);
      case 'recent-grad': return renderRecentGrad(resumeData);
      case 'career-changer': return renderCareerChanger(resumeData);
      case 'project-manager': return renderProjectManager(resumeData);
      case 'creative': return renderCreative(resumeData);
      case 'healthcare': return renderHealthcare(resumeData);
      default: return renderExecutive(resumeData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
