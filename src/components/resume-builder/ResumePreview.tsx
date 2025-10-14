import React from 'react';
import type { ParsedResumeData } from "@/pages/ResumeBuilder";

interface ResumePreviewProps {
  resumeData: ParsedResumeData;
  templateId: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId }) => {
  // --- TEMPLATE 1: Modern Minimal ---
  const renderModernMinimalTemplate = (data: ParsedResumeData) => (
    <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px]">
      <h1 className="text-3xl font-bold mb-1 text-center">{data.fullName}</h1>
      <p className="text-center text-xs mb-4">
        {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
      </p>
      {Object.entries(data).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
        return (
          <section key={key} className="mb-4">
            <h2 className="text-sm font-semibold border-b-2 border-gray-300 pb-1 mb-2 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
            {renderSection(key as keyof ParsedResumeData, value)}
          </section>
        );
      })}
    </div>
  );

  // --- TEMPLATE 2: Professional Classic ---
  const renderProfessionalClassicTemplate = (data: ParsedResumeData) => (
    <div className="font-serif text-gray-700 p-6 leading-snug text-[10px]">
      <h1 className="text-3xl font-bold mb-0.5 text-center uppercase tracking-widest">{data.fullName}</h1>
      <p className="text-center text-xs mb-4 border-b pb-2 border-gray-400">
        {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
      </p>
      {Object.entries(data).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
        return (
          <section key={key} className="mb-4">
            <h2 className="text-xs font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
            {renderSection(key as keyof ParsedResumeData, value, 'classic')}
          </section>
        );
      })}
    </div>
  );
  
  // --- TEMPLATE 3: Technical Focused ---
    const renderTechnicalFocusedTemplate = (data: ParsedResumeData) => (
    <div className="font-mono text-gray-800 p-6 leading-relaxed text-[10px]">
        <h1 className="text-2xl font-bold mb-1 text-left">// {data.fullName}</h1>
        <p className="text-left text-xs mb-4">
        {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">LinkedIn</a>
        </p>
        {Object.entries(data).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
        return (
            <section key={key} className="mb-4">
            <h2 className="text-sm font-semibold pb-1 mb-2 text-green-700">// {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
            {renderSection(key as keyof ParsedResumeData, value, 'technical')}
            </section>
        );
        })}
    </div>
    );
  // --- TEMPLATE 4: Executive Summary ---
    const renderExecutiveSummaryTemplate = (data: ParsedResumeData) => (
        <div className="font-sans text-gray-900 p-6 leading-normal text-[11px]">
            <h1 className="text-4xl font-extrabold mb-1 text-center border-b-4 border-gray-800 pb-2">{data.fullName}</h1>
            <p className="text-center text-xs mb-4 pt-2">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-sm font-bold pb-1 mb-2 uppercase tracking-wider text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value, 'executive')}
                </section>
            );
            })}
        </div>
    );
  // --- TEMPLATE 5: Academic & Research ---
    const renderAcademicResearchTemplate = (data: ParsedResumeData) => (
        <div className="font-serif text-gray-800 p-6 leading-relaxed text-[10.5px]">
            <h1 className="text-3xl font-bold mb-1 text-left">{data.fullName}</h1>
            <p className="text-left text-xs mb-4 border-b pb-2">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-base font-semibold pb-1 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value, 'academic')}
                </section>
            );
            })}
        </div>
    );
    // --- TEMPLATE 6: Creative Professional ---
    const renderCreativeProfessionalTemplate = (data: ParsedResumeData) => (
        <div className="font-sans text-gray-700 p-6 leading-relaxed text-[11px]">
            <h1 className="text-3xl font-bold mb-1 text-center text-purple-800">{data.fullName}</h1>
            <p className="text-center text-xs mb-4">
            {data.email} • {data.phone} • {data.location} • <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-sm font-semibold border-b-2 border-purple-200 pb-1 mb-2 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value)}
                </section>
            );
            })}
        </div>
    );
    // --- TEMPLATE 7: Skill-Focused ---
    const renderSkillFocusedTemplate = (data: ParsedResumeData) => (
        <div className="font-sans text-gray-800 p-6 leading-relaxed text-[11px]">
            <h1 className="text-3xl font-bold mb-1 text-center">{data.fullName}</h1>
            <p className="text-center text-sm mb-4">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            </p>
            {data.skills && (
            <section className="mb-4">
                <h2 className="text-xl font-semibold border-b-2 border-blue-500 pb-1 mb-2">SKILLS</h2>
                <div className="flex flex-wrap gap-2 text-sm">
                {data.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{skill}</span>
                ))}
                </div>
            </section>
            )}
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin', 'skills'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-sm font-semibold border-b-2 border-gray-300 pb-1 mb-2 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value)}
                </section>
            );
            })}
        </div>
    );
    // --- TEMPLATE 8: Achievement-Driven ---
    const renderAchievementDrivenTemplate = (data: ParsedResumeData) => (
        <div className="font-sans text-gray-800 p-6 leading-normal text-[11px]">
            <h1 className="text-3xl font-extrabold mb-1 text-center text-blue-800">{data.fullName}</h1>
            <p className="text-center text-sm mb-4 border-b-2 border-blue-200 pb-2">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-1 mb-2 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value, 'achievement')}
                </section>
            );
            })}
        </div>
    );
    // --- TEMPLATE 9: Chronological ---
    const renderChronologicalTemplate = (data: ParsedResumeData) => (
        <div className="font-serif text-gray-800 p-6 leading-relaxed text-[11px]">
            <h1 className="text-3xl font-bold mb-1 text-left border-b-2 pb-2">{data.fullName}</h1>
            <p className="text-left text-xs my-2">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-4">
                <h2 className="text-sm font-semibold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value, 'chronological')}
                </section>
            );
            })}
        </div>
    );
    // --- TEMPLATE 10: Simple Modern ---
    const renderSimpleModernTemplate = (data: ParsedResumeData) => (
        <div style={{ fontFamily: "'Roboto', sans-serif" }} className="text-gray-700 p-6 leading-relaxed text-[11px]">
            <h1 className="text-4xl font-light mb-1 text-center tracking-wider">{data.fullName}</h1>
            <p className="text-center text-xs mb-6 tracking-widest">
            {data.email} | {data.phone} | {data.location} | <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            </p>
            {Object.entries(data).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || ['fullName', 'email', 'phone', 'location', 'linkedin'].includes(key)) return null;
            return (
                <section key={key} className="mb-5">
                <h2 className="text-xs font-bold pb-1 mb-2 uppercase tracking-widest text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
                {renderSection(key as keyof ParsedResumeData, value, 'simple-modern')}
                </section>
            );
            })}
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
        case 'modern-minimal': return renderModernMinimalTemplate(resumeData);
        case 'professional-classic': return renderProfessionalClassicTemplate(resumeData);
        case 'technical-focused': return renderTechnicalFocusedTemplate(resumeData);
        case 'executive-summary': return renderExecutiveSummaryTemplate(resumeData);
        case 'academic-research': return renderAcademicResearchTemplate(resumeData);
        case 'creative-professional': return renderCreativeProfessionalTemplate(resumeData);
        case 'skill-focused': return renderSkillFocusedTemplate(resumeData);
        case 'achievement-driven': return renderAchievementDrivenTemplate(resumeData);
        case 'chronological': return renderChronologicalTemplate(resumeData);
        case 'simple-modern': return renderSimpleModernTemplate(resumeData);
        default: return renderModernMinimalTemplate(resumeData);
        }
    };

    return (
        <div className="resume-preview-container bg-white shadow-lg">
        {renderTemplate()}
        </div>
    );
    };

export default ResumePreview;
