
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileEdit, UploadCloud, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemplateSelection from "@/components/resume-builder/TemplateSelection";
import ResumeEditor from "@/components/resume-builder/ResumeEditor";
import ResumePreview from "@/components/resume-builder/ResumePreview";

export interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Array<{
    title:string;
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
    description: string;
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

const parseResumeText = (text: string): ParsedResumeData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/i;
  
    const email = text.match(emailRegex)?.[0] || "";
    const phone = text.match(phoneRegex)?.[0] || "";
    const linkedin = text.match(linkedinRegex)?.[0] || "";
  
    let fullName = lines[0] || "Your Name";
    if (lines.length > 1 && (lines[1].toLowerCase().includes('developer') || lines[1].toLowerCase().includes('engineer'))) {
      fullName = `${lines[0]} ${lines[1]}`;
    }
  
    const sections: { [key: string]: string[] } = {};
    let currentSection = 'summary';
    sections[currentSection] = [];
  
    const sectionHeaders = [
      "summary", "about me", "professional experience", "experience", "education",
      "skills", "technical skills", "projects", "certifications"
    ];
    
    const sectionMapping: { [key: string]: string } = {
      "about me": "summary",
      "professional experience": "experience",
      "technical skills": "skills",
    };
  
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      let isHeader = false;
      for (const header of sectionHeaders) {
        if (lowerLine === header) {
          currentSection = sectionMapping[header] || header;
          sections[currentSection] = [];
          isHeader = true;
          break;
        }
      }
      if (!isHeader) {
        if (!sections[currentSection]) sections[currentSection] = [];
        sections[currentSection].push(line);
      }
    });
  
    const parseExperience = (expLines: string[]): ParsedResumeData['experience'] => {
      const experience: ParsedResumeData['experience'] = [];
      let currentJob: ParsedResumeData['experience'][0] | null = null;
  
      expLines.forEach(line => {
        const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\s-\s(Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}/;
        const isDate = dateRegex.test(line);
  
        if (isDate && currentJob) {
          const [startDate, endDate] = line.split(' - ');
          currentJob.startDate = startDate;
          currentJob.endDate = endDate;
        } else if (!line.startsWith("•")) {
           if(currentJob) experience.push(currentJob);
           currentJob = { title: line, company: "", location: "", startDate: "", endDate: "", description: [] };
        } else if(line.startsWith("•") && currentJob) {
            currentJob.description.push(line.substring(1).trim());
        } else if(currentJob && !currentJob.company) {
            currentJob.company = line;
        }
      });
      if (currentJob) experience.push(currentJob);
      return experience;
    }
  
    return {
      fullName,
      email,
      phone,
      location: "",
      linkedin,
      summary: sections.summary ? sections.summary.join(' ') : "",
      experience: sections.experience ? parseExperience(sections.experience) : [],
      education: [],
      skills: sections.skills ? sections.skills.join(', ').split(/, | \| | • /).filter(s => s) : [],
      projects: [],
      certifications: []
    };
};
  

const processFile = async (file: File, onSuccess: (data: ParsedResumeData) => void, setIsProcessing: (value: boolean) => void, toast: any) => {
  setIsProcessing(true);
  try {
    let text = "";
    let thumbnail: string | undefined;

    if (file.type === "application/pdf") {
      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
      
      const pageTexts = await Promise.all(Array.from({ length: pdf.numPages }, async (_, i) => {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        return textContent.items.map((item: any) => item.str).join(' ');
      }));
      text = pageTexts.join('\n');

      const page1 = await pdf.getPage(1);
      const viewport = page1.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page1.render({ canvasContext: context, viewport }).promise;
        thumbnail = canvas.toDataURL();
      }
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (file.type === "text/plain") {
      text = await file.text();
    } else {
      throw new Error("Unsupported file type");
    }

    const parsedData = { ...parseResumeText(text), thumbnail };
    onSuccess(parsedData);

  } catch (error) {
    console.error("File processing error:", error);
    toast({
      title: "Error",
      description: "Failed to process the resume file. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};

const getSampleDataForTemplate = (templateId: string): ParsedResumeData => {
    const baseData = {
    fullName: "Alexandra Chen",
    email: "alexandra.chen@email.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/alexandrachen",
  };

  switch (templateId) {
    case "blue-monogram":
      return {
        ...baseData,
        fullName: "Michael Rodriguez",
        summary: "Visionary executive with 15+ years driving digital transformation and revenue growth across Fortune 500 companies.",
        experience: [
          {
            title: "Chief Technology Officer",
            company: "Global Tech Corp",
            location: "New York, NY",
            startDate: "Jan 2020",
            endDate: "Present",
            description: [
              "Led digital transformation initiatives resulting in $50M revenue increase",
              "Managed team of 200+ engineers across 5 countries",
              "Implemented AI-driven solutions improving operational efficiency by 40%",
            ],
          },
        ],
        education: [
          {
            degree: "MBA in Technology Management",
            institution: "Stanford University",
            location: "Stanford, CA",
            graduationDate: "May 2010",
            gpa: "3.8",
          },
        ],
        skills: ["Strategic Planning", "Team Leadership", "Digital Transformation", "Revenue Growth", "AI Implementation"],
        projects: [
          {
            name: "Enterprise AI Platform",
            description: "Led development of company-wide AI platform serving 50,000+ employees",
            technologies: ["Machine Learning", "Cloud Architecture", "Python", "TensorFlow"],
            link: "https://github.com/mrodriguez/ai-platform"
          }
        ],
        certifications: [
          {
            name: "Certified Executive Leadership Program",
            issuer: "Harvard Business School",
            date: "2023"
          }
        ],
      };

    case "developer":
      return {
        ...baseData,
        fullName: "John Doe",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            startDate: "Mar 2021",
            endDate: "Present",
            description: [
              "Developed and maintained scalable microservices architecture serving over 1 million users",
              "Implemented CI/CD pipelines, reducing deployment time by 60%",
              "Mentored junior developers and conducted code reviews to maintain code quality",
            ],
          },
          {
            title: "Software Engineer",
            company: "Innovate Co.",
            location: "Austin, TX",
            startDate: "Jun 2018",
            endDate: "Feb 2021",
            description: [
              "Contributed to the development of a real-time analytics dashboard using React and D3.js",
              "Collaborated with cross-functional teams to deliver new features on time",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Texas at Austin",
            location: "Austin, TX",
            graduationDate: "May 2018",
            gpa: "3.8",
          },
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "CI/CD"],
        projects: [
          {
            name: "E-commerce Platform",
            description: "Built a fully functional e-commerce platform with features like product catalog, shopping cart, and payment integration.",
            technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
            link: "https://github.com/johndoe/ecommerce-platform"
          },
          {
            name: "Real-time Chat Application",
            description: "Developed a real-time chat application using WebSockets and React.",
            technologies: ["React", "Node.js", "Socket.IO", "Redis"],
            link: "https://github.com/johndoe/chat-app"
          }
        ],
        certifications: [
          {
            name: "AWS Certified Developer - Associate",
            issuer: "Amazon Web Services",
            date: "2023"
          }
        ],
      };

    case "intelligent":
      return {
        ...baseData,
        fullName: "Emma Thompson",
        summary: "Creative director with expertise in brand strategy, digital marketing, and user experience design.",
        experience: [
          {
            title: "Creative Director",
            company: "Design Studio Co.",
            location: "Los Angeles, CA",
            startDate: "Jun 2020",
            endDate: "Present",
            description: [
              "Led creative campaigns increasing brand awareness by 150%",
              "Designed user interfaces for mobile apps with 500K+ downloads",
              "Managed creative team of 12 designers and copywriters",
            ],
          },
        ],
        education: [
          {
            degree: "Master of Fine Arts in Design",
            institution: "Art Center College of Design",
            location: "Pasadena, CA",
            graduationDate: "May 2018",
            gpa: "3.9",
          },
        ],
        skills: ["Brand Strategy", "UI/UX Design", "Adobe Creative Suite", "Figma", "Digital Marketing"],
        projects: [],
        certifications: [],
      };

    default:
      return {
        ...baseData,
        summary: "Experienced professional with strong background in technology and business operations.",
        experience: [
          {
            title: "Project Manager",
            company: "Tech Solutions Inc.",
            location: "Seattle, WA",
            startDate: "Jan 2022",
            endDate: "Present",
            description: [
              "Managed cross-functional teams delivering projects on time and under budget",
              "Implemented agile methodologies improving team productivity by 25%",
            ],
          },
        ],
        education: [
          {
            degree: "Master of Business Administration",
            institution: "University of Washington",
            location: "Seattle, WA",
            graduationDate: "May 2021",
            gpa: "3.7",
          },
        ],
        skills: ["Project Management", "Agile Methodologies", "Stakeholder Management"],
        projects: [],
        certifications: [],
      };
  }
};
const ResumeBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "template" | "editor">("upload");
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("executive");
  const [editedData, setEditedData] = useState<ParsedResumeData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (id) {
          loadExistingResume(id, user.uid);
        } else {
          setCurrentStep("upload");
          setIsLoadingResume(false);
        }
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, id]);

  const loadExistingResume = async (resumeId: string, userId: string) => {
    setIsLoadingResume(true);
    try {
      const resumeDoc = await getDoc(doc(db, "resumes", resumeId));
      if (resumeDoc.exists() && resumeDoc.data()?.user_id === userId) {
        const resumeData = resumeDoc.data();
        setParsedData(resumeData.content);
        setEditedData(resumeData.content);
        setSelectedTemplate(resumeData.templateId || "executive");
        setCurrentStep("editor");
      } else {
        toast({ title: "Error", description: "Resume not found or access denied.", variant: "destructive" });
        navigate("/my-resumes");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load resume.", variant: "destructive" });
      navigate("/my-resumes");
    } finally {
      setIsLoadingResume(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await processFile(file, (data) => {
        setParsedData(data);
        setEditedData(data);
        setCurrentStep("template");
      }, setIsProcessing, toast);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartFromScratch = () => {
    const sampleData = getSampleDataForTemplate("executive");
    setParsedData(sampleData);
    setEditedData(sampleData);
    setCurrentStep("template");
  };

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!parsedData) { // Starting from scratch
      setEditedData(getSampleDataForTemplate(templateId));
    }
    setCurrentStep("editor");
  };

  const handleEditorChange = (data: ParsedResumeData) => {
    setEditedData(data);
  };
  
  const handleSaveResume = async () => {
    if (!user || !editedData) return;
    setIsSaving(true);
    try {
      const resumePayload = {
        title: editedData.fullName ? `${editedData.fullName}'s Resume` : "My Resume",
        content: editedData,
        templateId: selectedTemplate,
        user_id: user.uid,
        updated_at: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "resumes", id), resumePayload);
        toast({ title: "Success", description: "Resume updated successfully!" });
      } else {
        const docRef = await addDoc(collection(db, "resumes"), {
          ...resumePayload,
          created_at: serverTimestamp(),
          type: parsedData ? 'uploaded' : 'created'
        });
        navigate(`/resume-builder/${docRef.id}`, { replace: true });
        toast({ title: "Success", description: "Resume saved successfully!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save resume.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "template") setCurrentStep("upload");
    else if (currentStep === "editor") setCurrentStep("template");
    else navigate("/my-resumes");
  };

  if (isLoadingResume) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading resume...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
       <header className="border-b sticky top-0 bg-background/95 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep === "editor" && (
            <Button size="sm" onClick={handleSaveResume} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Resume
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === "upload" && (
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Create Your Resume</h1>
            <p className="text-muted-foreground text-lg mb-8">How would you like to start?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardAction title="Build from Scratch" icon={FileEdit} onClick={handleStartFromScratch} description="Use our editor to create a new resume." />
              <CardAction title="Upload Existing" icon={UploadCloud} onClick={handleUploadClick} description="Import a PDF, DOCX, or TXT file." isProcessing={isProcessing} />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.docx,.txt" className="hidden" />
          </div>
        )}
        
        {currentStep === "template" && parsedData && (
          <TemplateSelection parsedData={parsedData} onTemplateSelected={handleTemplateSelected} />
        )}
        
        {currentStep === "editor" && editedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeEditor
              parsedData={editedData}
              templateId={selectedTemplate}
              userId={user?.uid || ""}
              onDataChange={handleEditorChange}
              resumeId={id}
            />
            <div className="sticky top-20">
              <ResumePreview resumeData={editedData} templateId={selectedTemplate} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const CardAction = ({ title, icon: Icon, onClick, description, isProcessing }: { title: string, icon: React.ElementType, onClick: () => void, description: string, isProcessing?: boolean }) => (
  <div
    className="border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent hover:shadow-lg transition-all"
    onClick={onClick}
  >
    <Icon className="h-12 w-12 text-primary mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <Button variant="outline" className="w-full" disabled={isProcessing}>
      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Select'}
    </Button>
  </div>
);

export default ResumeBuilder;
