import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Save,
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import type { ParsedResumeData } from "@/pages/ResumeBuilder";
import jsPDF from "jspdf";

interface ResumeEditorProps {
  parsedData: ParsedResumeData;
  templateId: string;
  userId: string;
  onDataChange: (data: ParsedResumeData) => void; // New prop
}

interface ATSWarning {
  type: "warning" | "tip" | "success";
  message: string;
}

const ResumeEditor = ({ parsedData, templateId, userId, onDataChange }: ResumeEditorProps) => {
  const [resumeData, setResumeData] = useState<ParsedResumeData>(parsedData);
  const [atsWarnings, setAtsWarnings] = useState<ATSWarning[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setResumeData(parsedData);
    checkATSCompliance(parsedData);
  }, [parsedData]); // Re-run when parsedData changes

  // Check for ATS issues
  const checkATSCompliance = (data: ParsedResumeData) => {
    const warnings: ATSWarning[] = [];

    // Check for tables mention (users shouldn't add them)
    const allText = JSON.stringify(data).toLowerCase();
    if (allText.includes("table") || allText.includes("|")) {
      warnings.push({
        type: "warning",
        message: "Avoid using tables or complex formatting. ATS systems may not parse them correctly.",
      });
    }

    // Check for standard sections
    if (!data.experience || data.experience.length === 0) {
      warnings.push({
        type: "tip",
        message: "Add work experience to improve your resume's completeness.",
      });
    }

    if (!data.education || data.education.length === 0) {
      warnings.push({
        type: "tip",
        message: "Add education details for a complete profile.",
      });
    }

    if (!data.skills || data.skills.length === 0) {
      warnings.push({
        type: "tip",
        message: "Add relevant skills to help ATS match you with job requirements.",
      });
    }

    // Check for good practices
    if (data.experience.length > 0 && data.education.length > 0 && data.skills.length > 0) {
      warnings.push({
        type: "success",
        message: "Great! Your resume has all the essential sections for ATS optimization.",
      });
    }

    setAtsWarnings(warnings);
  };

  const updateField = (field: keyof ParsedResumeData, value: any) => {
    const newData = { ...resumeData, [field]: value };
    setResumeData(newData);
    onDataChange(newData); // Call onDataChange
    checkATSCompliance(newData);
  };

  const addExperience = () => {
    const newExp = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: [""],
    };
    updateField("experience", [...resumeData.experience, newExp]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    updateField("experience", newExperience);
  };

  const removeExperience = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    updateField("experience", newExperience);
  };

  const addEducation = () => {
    const newEdu = {
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    updateField("education", [...resumeData.education, newEdu]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    updateField("education", newEducation);
  };

  const removeEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    updateField("education", newEducation);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from("resumes").insert({
        user_id: userId,
        title: `${resumeData.fullName || "My"} Resume`,
        content: resumeData as any,
        is_ats_optimized: true,
        type: 'created',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });

      setTimeout(() => {
        navigate("/resumes");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save resume.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      const addText = (text: string, fontSize: number, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 2;
      };

      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(resumeData.fullName || "Your Name", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const contactInfo = [
        resumeData.email,
        resumeData.phone,
        resumeData.location,
        resumeData.linkedin,
      ].filter(Boolean).join(" | ");
      
      if (contactInfo) {
        addText(contactInfo, 10);
      }

      yPosition += 3;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      if (resumeData.summary) {
        addText("PROFESSIONAL SUMMARY", 12, true);
        addText(resumeData.summary, 10);
        yPosition += 3;
      }

      if (resumeData.experience.length > 0) {
        addText("WORK EXPERIENCE", 12, true);
        
        resumeData.experience.forEach((exp) => {
          addText(`${exp.title} at ${exp.company}`, 11, true);
          const expDetails = [exp.location, `${exp.startDate} - ${exp.endDate}`]
            .filter(Boolean)
            .join(" | ");
          if (expDetails) {
            addText(expDetails, 10);
          }
          
          exp.description.forEach((desc) => {
            if (desc.trim()) {
              addText(`• ${desc}`, 10);
            }
          });
          yPosition += 3;
        });
      }

      if (resumeData.education.length > 0) {
        addText("EDUCATION", 12, true);
        
        resumeData.education.forEach((edu) => {
          addText(`${edu.degree}`, 11, true);
          const eduDetails = [
            edu.institution,
            edu.location,
            edu.graduationDate,
            edu.gpa ? `GPA: ${edu.gpa}` : "",
          ].filter(Boolean).join(" | ");
          if (eduDetails) {
            addText(eduDetails, 10);
          }
          yPosition += 3;
        });
      }

      if (resumeData.skills.length > 0) {
        addText("SKILLS", 12, true);
        addText(resumeData.skills.join(", "), 10);
        yPosition += 3;
      }

      if (resumeData.projects.length > 0) {
        addText("PROJECTS", 12, true);
        
        resumeData.projects.forEach((project) => {
          addText(project.name, 11, true);
          addText(project.description, 10);
          if (project.technologies.length > 0) {
            addText(`Technologies: ${project.technologies.join(", ")}`, 10);
          }
          if (project.link) {
            addText(`Link: ${project.link}`, 10);
          }
          yPosition += 3;
        });
      }

      if (resumeData.certifications.length > 0) {
        addText("CERTIFICATIONS", 12, true);
        
        resumeData.certifications.forEach((cert) => {
          addText(`${cert.name} - ${cert.issuer} (${cert.date})`, 10);
        });
      }

      const fileName = resumeData.fullName
        ? `${resumeData.fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Resume exported as PDF successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Your Resume</h1>
          <p className="text-muted-foreground">
            Customize your resume with real-time ATS guidance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={exportToPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {atsWarnings.length > 0 && (
            <div className="space-y-2">
              {atsWarnings.map((warning, idx) => (
                <Alert
                  key={idx}
                  variant={warning.type === "warning" ? "destructive" : "default"}
                  className={
                    warning.type === "success"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : warning.type === "tip"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }
                >
                  {warning.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                  {warning.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {warning.type === "tip" && <Lightbulb className="h-4 w-4 text-blue-600" />}
                  <AlertDescription>{warning.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.linkedin}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Write a brief summary of your professional background and key qualifications..."
              rows={4}
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Work Experience</h2>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            <div className="space-y-6">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Experience {idx + 1}</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(idx, "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        placeholder="Tech Company Inc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(idx, "location", e.target.value)}
                        placeholder="New York, NY"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description (one achievement per line)</Label>
                    <Textarea
                      value={exp.description.join("\n")}
                      onChange={(e) =>
                        updateExperience(idx, "description", e.target.value.split("\n"))
                      }
                      placeholder="• Led team of 5 engineers\n• Increased performance by 40%"
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Education</h2>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            <div className="space-y-6">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Education {idx + 1}</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(idx, "location", e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(idx, "graduationDate", e.target.value)}
                        placeholder="May 2020"
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(idx, "gpa", e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <Textarea
              value={resumeData.skills.join(", ")}
              onChange={(e) => updateField("skills", e.target.value.split(",").map(s => s.trim()))}
              placeholder="JavaScript, Python, React, Node.js, SQL"
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Separate skills with commas
            </p>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">ATS Optimization Tips</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Use Standard Fonts</p>
                  <p className="text-xs text-muted-foreground">
                    Stick to Arial, Calibri, or Times New Roman
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Single Column Layout</p>
                  <p className="text-xs text-muted-foreground">
                    Our templates use single-column for best ATS parsing
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Avoid Tables & Graphics</p>
                  <p className="text-xs text-muted-foreground">
                    ATS can't read images, charts, or complex tables
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Use Keywords</p>
                  <p className="text-xs text-muted-foreground">
                    Include relevant keywords from job descriptions
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Clear Section Headers</p>
                  <p className="text-xs text-muted-foreground">
                    Use standard titles like "Experience" and "Education"
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
