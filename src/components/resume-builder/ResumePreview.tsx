import React from 'react';
import type { ParsedResumeData } from "@/pages/ResumeBuilder";

interface ResumePreviewProps {
  resumeData: ParsedResumeData;
  templateId: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId }) => {
  const renderDefaultTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed">
      <h1 className="text-3xl font-bold mb-1 text-center">{data.fullName}</h1>
      <p className="text-center text-sm mb-4">
        {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
      </p>

      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Work Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-base">{exp.title} at {exp.company}</h3>
              <p className="text-sm italic">{exp.location} | {exp.startDate} - {exp.endDate}</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-base">{edu.degree}</h3>
              <p className="text-sm italic">{edu.institution}, {edu.location} | {edu.graduationDate}</p>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="text-sm">{data.skills.join(", ")}</p>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-base">{project.name}</h3>
              <p className="text-sm italic">Technologies: {project.technologies.join(", ")}</p>
              <p className="text-sm">{project.description}</p>
              {project.link && <p className="text-sm"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></p>}
            </div>
          ))}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Certifications</h2>
          <ul className="list-disc list-inside text-sm">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert.name} - {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  const renderProfessionalClassicTemplate = (data: ParsedResumeData) => (
    <div className="font-serif text-gray-700 p-6 leading-snug">
      <h1 className="text-3xl font-bold mb-0.5 text-center uppercase">{data.fullName}</h1>
      <p className="text-center text-xs mb-4 border-b pb-2 border-gray-400">
        {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
      </p>

      {data.summary && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{exp.title} - {exp.company}</h3>
                <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-xs italic mb-1">{exp.location}</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {exp.description.map((desc, descIndex) => (
                  desc.trim() && <li key={descIndex}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
              <p className="text-xs italic">{edu.institution}, {edu.location}</p>
              {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Skills</h2>
          <p className="text-sm">{data.skills.join(" • ")}</p>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-sm">{project.name}</h3>
              <p className="text-xs italic">Technologies: {project.technologies.join(", ")}</p>
              <p className="text-xs">{project.description}</p>
              {project.link && <p className="text-xs"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Link</a></p>}
            </div>
          ))}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 uppercase">Certifications</h2>
          <ul className="list-disc list-inside text-xs">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert.name} - {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (templateId) {
      case "professional-classic":
        return renderProfessionalClassicTemplate(resumeData);
      case "default-template":
      default:
        return renderDefaultTemplate(resumeData);
    }
  };

  return (
    <div className="resume-preview-container">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
