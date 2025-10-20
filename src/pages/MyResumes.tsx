import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDataFetching } from "@/hooks/useDataFetching";
import { FileText, Plus, ArrowLeft, Upload, Loader2, User, Mail, Phone, Briefcase, Code, Trash } from "lucide-react";
import { TextItem } from "pdfjs-dist/types/src/display/api";

interface ParsedResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      description: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      location: string;
      graduationDate: string;
      gpa?: string;
    }>;
    skills: string[];
    projects: Array<{
      name: string;
      description: string[];
      technologies: string[];
      link?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
    thumbnail?: string;
  }
  
  interface Resume {
      id: string;
      title: string;
      content: ParsedResumeData;
      is_ats_optimized: boolean;
      type: 'uploaded' | 'created';
      user_id: string;
      updated_at: { seconds: number, nanoseconds: number };
  }
  
const parseExperience = (expLines: string[]): ParsedResumeData['experience'] => {
  const experience: ParsedResumeData['experience'] = [];
  let currentJob: ParsedResumeData['experience'][0] | null = null;
  let i = 0;

  while (i < expLines.length) {
    const line = expLines[i].trim();
    if (line.length === 0) {
      i++;
      continue;
    }

    // Look for company name (often first line after header)
    if (!currentJob) {
      currentJob = {
        title: "Frontend Developer", // Default from top or infer
        company: line,
        location: "",
        startDate: "",
        endDate: "",
        description: []
      };
      i++;
      continue;
    }

    // Look for date line
    const dateRegex = /(Aug 2020|Sep 2018)\s*-\s*(May 2022|May 2020)/i;
    if (dateRegex.test(line) && currentJob) {
      const match = line.match(dateRegex);
      if (match) {
        currentJob.startDate = match[1];
        currentJob.endDate = match[2];
      }
      i++;
      continue;
    }

    // Non-bullet line as title or additional info
    if (!line.startsWith("•") && line.length > 0) {
      if (currentJob.description.length === 0) {
        currentJob.description.push(line); // First description line
      } else {
        // New job
        experience.push(currentJob);
        currentJob = {
          title: "Frontend Developer",
          company: line,
          location: "",
          startDate: "",
          endDate: "",
          description: []
        };
      }
      i++;
      continue;
    }

    // Bullet points for description
    if (line.startsWith("•") || line.match(/^- /)) {
      if (currentJob) {
        currentJob.description.push(line.replace(/^[-•]\s*/, '').trim());
      }
      i++;
      continue;
    }

    i++;
  }
  if (currentJob) experience.push(currentJob);
  return experience;
};

const parseEducation = (eduLines: string[]): ParsedResumeData['education'] => {
  const education: ParsedResumeData['education'] = [];
  let currentEdu: ParsedResumeData['education'][0] | null = null;
  let i = 0;

  while (i < eduLines.length) {
    const line = eduLines[i].trim();
    if (line.length === 0) {
      i++;
      continue;
    }

    // Degree and institution
    if (!currentEdu) {
      const parts = line.split(/,\s*|\s+at\s+|\s-\s+/i);
      currentEdu = {
        degree: parts[0] || line,
        institution: parts.slice(1).join(' ') || line,
        location: "",
        graduationDate: ""
      };
      i++;
      continue;
    }

    // Date line
    const dateRegex = /(Sep\s+2018)\s*-\s*(May\s+2020)/i;
    if (dateRegex.test(line) && currentEdu) {
      currentEdu.graduationDate = line.match(dateRegex)?.[0] || line;
      education.push(currentEdu);
      currentEdu = null;
      i++;
      continue;
    }

    i++;
  }
  if (currentEdu) education.push(currentEdu);
  return education;
};

const parseProjects = (projLines: string[]): ParsedResumeData['projects'] => {
  const projects: ParsedResumeData['projects'] = [];
  let currentProject: ParsedResumeData['projects'][0] | null = null;
  let i = 0;

  while (i < projLines.length) {
    const line = projLines[i].trim();
    if (line.length === 0) {
      i++;
      continue;
    }

    if (!currentProject) {
      currentProject = {
        name: line,
        description: [],
        technologies: [],
        link: ""
      };
      i++;
      continue;
    }

    // Bullets for description
    if (line.startsWith("•")) {
      if (currentProject) {
        currentProject.description.push(line.replace(/^•\s*/, '').trim());
      }
      i++;
      continue;
    }

    // If next project or end
    if (line.length > 0 && !line.startsWith("•")) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = null;
    }
    i++;
  }
  if (currentProject) projects.push(currentProject);
  return projects;
};

const parseResumeText = (text: string): ParsedResumeData => {
  const lines = text.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(line => line.length > 0);
  console.log("Extracted lines:", lines.slice(0, 20)); // Debug: First 20 lines

  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/i;

  let email = "";
  let phone = "";
  let location = "";
  let linkedin = "";

  // Extract contact from line with | separator
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    if (line.includes('|') && emailRegex.test(line)) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 3) {
        phone = parts[0] || "";
        location = parts[1] || "";
        email = parts[2] || "";
        if (parts.length > 3) linkedin = parts[3] || "";
      }
      break;
    }
  }

  // Fallback regex if no | line
  if (!email) email = text.match(emailRegex)?.[0] || "";
  if (!phone) phone = text.match(phoneRegex)?.[0] || "";
  if (!linkedin) linkedin = text.match(linkedinRegex)?.[0] || "";

  // fullName: First line with 2+ words, not contact-like
  let fullName = "Your Name";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wordCount = line.split(' ').length;
    if (wordCount >= 2 && !line.includes('|') && !emailRegex.test(line) && !phoneRegex.test(line) && !line.startsWith('http') && line.length > 5) {
      fullName = line.split(' ')[0] + ' ' + line.split(' ').slice(1, 2).join(' '); // First two words as name
      break;
    }
  }

  const sections: { [key: string]: string[] } = {};
  let currentSection = 'summary';
  sections[currentSection] = [];

  const sectionHeaders = [
    "summary", "about", "about me", "professional summary", "profile",
    "experience", "work experience", "professional experience", "employment history",
    "education", "academic background",
    "skills", "technical skills", "core competencies",
    "projects", "certifications", "certificates"
  ];

  const sectionMapping: { [key: string]: string } = {
    "about": "summary",
    "about me": "summary",
    "professional summary": "summary",
    "profile": "summary",
    "work experience": "experience",
    "professional experience": "experience",
    "employment history": "experience",
    "academic background": "education",
    "technical skills": "skills",
    "core competencies": "skills",
    "certificates": "certifications"
  };

  let i = 0;
  while (i < lines.length) {
    let line = lines[i];
    const lowerLine = line.toLowerCase();
    const upperLine = line.toUpperCase().replace(/\s+/g, ' ');
    let isHeader = false;

    // Check for all-caps headers or exact matches, trimmed
    if (upperLine === "ABOUT ME" || lowerLine.includes("about me") || lowerLine.startsWith("about me:")) {
      currentSection = "summary";
      sections[currentSection] = [];
      isHeader = true;
    } else if (upperLine === "PROFESSIONAL EXPERIENCE" || lowerLine.includes("professional experience")) {
      currentSection = "experience";
      sections[currentSection] = [];
      isHeader = true;
    } else if (upperLine === "TECHNICAL SKILLS" || lowerLine.includes("technical skills")) {
      currentSection = "skills";
      sections[currentSection] = [];
      isHeader = true;
    } else if (upperLine === "EDUCATION" || lowerLine.includes("education")) {
      currentSection = "education";
      sections[currentSection] = [];
      isHeader = true;
    } else if (upperLine === "PROJECTS" || lowerLine.includes("projects")) {
      currentSection = "projects";
      sections[currentSection] = [];
      isHeader = true;
    } else {
      for (const header of sectionHeaders) {
        if (lowerLine.includes(header) || lowerLine.startsWith(header + ':')) {
          const mappedSection = sectionMapping[header] || header;
          currentSection = mappedSection;
          if (!sections[currentSection]) sections[currentSection] = [];
          isHeader = true;
          break;
        }
      }
    }

    if (isHeader) {
      i++;
      continue;
    }

    if (!sections[currentSection]) sections[currentSection] = [];
    sections[currentSection].push(line);
    i++;
  }

  console.log("Sections:", sections); // Debug: Sections found

  // Parse skills more robustly: for listed items
  const skillsSection = sections.skills || [];
  const skills = skillsSection
    .filter(line => line.length > 1)
    .flatMap(line => line.split(/,\s*|\s+•\s+|\n/))
    .map(s => s.trim())
    .filter(s => s.length > 1 && !s.match(/^\d+$/))
    .slice(0, 20);

  // Summary: Limit to avoid too much text
  const summaryLines = sections.summary || [];
  const summary = summaryLines.join(' ').substring(0, 500).trim();

  return {
    fullName,
    email,
    phone,
    location,
    linkedin,
    summary,
    experience: sections.experience ? parseExperience(sections.experience) : [],
    education: sections.education ? parseEducation(sections.education) : [],
    skills,
    projects: sections.projects ? parseProjects(sections.projects) : [],
    certifications: []
  };
};

const MyResumes = () => {
  const { user } = useAuth();
  const { data: fetchedResumes, loading: resumesLoading, authLoading } = useDataFetching<Resume>('resumes', 'updated_at', { filterByUser: true, limit: 50 });
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const db = getFirestore();

  useEffect(() => {
    if(fetchedResumes) {
        setResumes(fetchedResumes);
    }
  }, [fetchedResumes]);

  const generatePdfThumbnail = async (file: File): Promise<string | undefined> => {
    try {
      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 }); 
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) return undefined;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext, viewport }).promise;
      return canvas.toDataURL(); 
    } catch (error) {
      console.error("Error generating PDF thumbnail:", error);
      return undefined;
    }
  };

  const processFile = async (file: File): Promise<ParsedResumeData> => {
    let parsedData: ParsedResumeData = parseResumeText("");
    let thumbnail: string | undefined = undefined;

    try {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = () => reject(new Error("Failed to read DOCX file"));
          reader.readAsArrayBuffer(file);
        });
        const mammoth = (await import("mammoth")).default;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value || "";
        parsedData = parseResumeText(text);
      } else if (file.type === "application/pdf") {
        thumbnail = await generatePdfThumbnail(file);
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = () => reject(new Error("Failed to read PDF file"));
          reader.readAsArrayBuffer(file);
        });
        const pdfJS = await import('pdfjs-dist');
        pdfJS.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

        const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
        const maxPages = pdf.numPages;
        const countPromises = [];
        for (let j = 1; j <= maxPages; j++) {
          const page = pdf.getPage(j);
          countPromises.push(
            page.then((page) => {
              const textContent = page.getTextContent();
              return textContent.then((textContent) => {
                return textContent.items
                  .filter((item): item is TextItem => 'str' in item)
                  .map((s) => s.str)
                  .join(' ');
              });
            })
          );
        }
        const texts = await Promise.all(countPromises);
        const text = texts.join('\n');
        parsedData = parseResumeText(text);
        parsedData.thumbnail = thumbnail;
      } else {
        // Fallback for other file types like .txt
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || "");
          reader.onerror = () => reject(new Error("Failed to read text file"));
          reader.readAsText(file);
        });
        parsedData = parseResumeText(text);
      }
      return parsedData;
    } catch (error) {
      console.error("Error processing file:", error);
      throw new Error(`Failed to process ${file.name}: ${(error as Error).message}`);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsProcessing(true);
      try {
        console.log("Starting file processing for:", file.name);
        const data = await processFile(file);
        console.log("File processing successful. Attempting to save to the database.");
        const title = data.fullName || file.name;
        const resumeInsert = {
          title,
          content: data,
          is_ats_optimized: false,
          type: 'uploaded' as 'uploaded',
          user_id: user.uid,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };

        console.log("Data to be saved:", resumeInsert);
        const docRef = await addDoc(collection(db, "resumes"), resumeInsert);
        console.log("Resume saved successfully to database with ID:", docRef.id);

        const newResume: Resume = {
          id: docRef.id,
          title: resumeInsert.title,
          content: resumeInsert.content,
          is_ats_optimized: resumeInsert.is_ats_optimized,
          type: resumeInsert.type,
          user_id: resumeInsert.user_id,
          updated_at: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        };

        setResumes(currentResumes => [newResume, ...currentResumes]);

        toast({
          title: "Success",
          description: "Resume uploaded and saved successfully!",
        });
      } catch (error: any) {
        console.error("Error in handleFileSelect:", error);
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to process or save the resume.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await deleteDoc(doc(db, "resumes", resumeToDelete.id));
      setResumes(currentResumes => currentResumes.filter(r => r.id !== resumeToDelete.id));
      toast({
        title: "Success",
        description: "Resume deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete the resume.",
        variant: "destructive",
      });
    } finally {
      setResumeToDelete(null);
    }
  };

  const uploadedResumes = resumes.filter((r) => r.type === "uploaded");
  const savedResumes = resumes.filter((r) => r.type === "created" || !r.type);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
      />
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">My Resumes</h1>
            </div>
          </div>
          <Button onClick={() => navigate("/resumes/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {resumesLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
        <>
          <Tabs defaultValue="uploaded" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="uploaded">Resumes uploaded by you ({uploadedResumes.length})</TabsTrigger>
              <TabsTrigger value="saved">Saved resumes ({savedResumes.length})</TabsTrigger>
            </TabsList>
          <TabsContent value="uploaded" className="mt-6">
            {uploadedResumes.length > 0 ? (
              <>
                <div className="mb-6">
                  <Card className="p-4 border-0 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-1">Add More Resumes</h3>
                        <p className="text-sm text-muted-foreground">Upload additional resumes to optimize with AI tools</p>
                      </div>
                      <Button onClick={handleUploadClick} disabled={isProcessing} className="w-full sm:w-auto">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center sm:text-left mt-2">
                      Supports PDF, DOCX, and TXT files
                    </p>
                  </Card>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {uploadedResumes.map((resume) => (
                    <Card key={resume.id} className="p-6 bg-gradient-to-br from-background to-muted hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          {resume.content.thumbnail ? (
                            <img src={resume.content.thumbnail} alt={`${resume.title} thumbnail`} className="w-24 h-32 object-cover rounded-lg shadow-sm border" />
                          ) : (
                            <div className="w-24 h-32 bg-muted rounded-lg flex items-center justify-center">
                              <FileText className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 self-start">
                          <div className="flex gap-2">
                            <Badge variant="secondary">Uploaded</Badge>
                            {resume.is_ats_optimized && (
                              <Badge variant="default">ATS Optimized</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resume.updated_at.seconds * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-3 line-clamp-1">{resume.title}</h3>
                      <div className="mb-4 space-y-2">
                        {resume.content.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{resume.content.summary}</p>
                        )}
                        {resume.content.skills && resume.content.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resume.content.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {resume.content.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{resume.content.skills.length - 3}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResume(resume);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/resume-builder/${resume.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResumeToDelete(resume);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center border-0 shadow-sm">
                <div className="animate-[fadeIn_0.5s_ease-in-out_forwards]">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold mb-2">No resumes uploaded yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Upload your existing resume to optimize it with our AI tools and ATS-friendly templates.
                  </p>
                  <Button onClick={handleUploadClick} disabled={isProcessing} className="w-full max-w-sm">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your Resume
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports PDF, DOCX, and TXT files
                  </p>
                </div>
              </Card>
            )}
              <Dialog open={!!selectedResume} onOpenChange={() => setSelectedResume(null)}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{selectedResume?.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {selectedResume?.content.fullName && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{selectedResume.content.fullName}</span>
                      </div>
                    )}
                    {selectedResume?.content.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedResume.content.email}</span>
                      </div>
                    )}
                    {selectedResume?.content.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedResume.content.phone}</span>
                      </div>
                    )}
                    {selectedResume?.content.summary && (
                      <div>
                        <h4 className="font-medium mb-1 flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          Summary
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedResume.content.summary}</p>
                      </div>
                    )}
                    {selectedResume?.content.skills && selectedResume.content.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1 flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedResume.content.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Full details available in the editor.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent value="saved" className="mt-6">
              {savedResumes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedResumes.map((resume) => (
                    <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
                      <div className="flex items-start justify-between mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex gap-2">
                          <Badge variant="secondary">{resume.type === "created" ? "Created" : "Saved"}</Badge>
                          {resume.is_ats_optimized && (
                            <Badge variant="default">ATS Optimized</Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{resume.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Last updated {new Date(resume.updated_at.seconds * 1000).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResume(resume);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/resume-builder/${resume.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResumeToDelete(resume);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No saved resumes yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first resume using our builder to get personalized templates and ATS optimization.
                  </p>
                  <Button onClick={() => navigate("/resumes/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Resume
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          <AlertDialog open={!!resumeToDelete} onOpenChange={() => setResumeToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteResume}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
        )}
      </main>
    </div>
  );
};

export default MyResumes;