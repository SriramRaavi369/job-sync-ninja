
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileEdit, UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemplateSelection from "@/components/resume-builder/TemplateSelection";
import ResumeEditor from "@/components/resume-builder/ResumeEditor";
import ResumePreview from "@/components/resume-builder/ResumePreview";

export interface OriginalTemplateMetadata {
  layout: 'one-column' | 'two-column' | 'custom';
  fonts: { header: string; body: string; };
  colors: { primary?: string; secondary?: string; }; // Limited detection; fallback to defaults
  sections: Array<{
    id: string;
    title: string;
    yStart: number;
    items: Array<{ text: string; x: number; y: number; style: { fontSize: number; bold: boolean; italic?: boolean; } }>;
  }>;
  rawFile?: string; // base64 of original for reference/overlay
  pageStyle?: React.CSSProperties;
  header?: {
    style?: React.CSSProperties;
    nameStyle?: React.CSSProperties;
    contactStyle?: React.CSSProperties;
  };
  summary?: {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    title?: string;
  };
  experience?: {
    style?: React.CSSProperties;
    sectionTitleStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    jobTitleStyle?: React.CSSProperties;
    companyStyle?: React.CSSProperties;
    locationStyle?: React.CSSProperties;
    dateStyle?: React.CSSProperties;
    subheaderStyle?: React.CSSProperties;
    listStyle?: React.CSSProperties;
    bulletStyle?: React.CSSProperties;
    title?: string;
  };
  education?: {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    degreeStyle?: React.CSSProperties;
    institutionStyle?: React.CSSProperties;
    locationStyle?: React.CSSProperties;
    dateStyle?: React.CSSProperties;
    gpaStyle?: React.CSSProperties;
    title?: string;
  };
  skills?: {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    title?: string;
  };
  projects?: {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    nameStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    techStyle?: React.CSSProperties;
    linkStyle?: React.CSSProperties;
    title?: string;
  };
  certifications?: {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    title?: string;
  };
}

export interface ParsedResumeData {
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
  originalTemplate?: OriginalTemplateMetadata;
  preserveOriginal?: boolean;
}

const parseResumeText = (text: string, metadata?: OriginalTemplateMetadata): ParsedResumeData => {
  const lines = text.split('\n').filter(line => line.trim());
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : "";
  const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/;
  const linkedinMatch = text.match(linkedinRegex);
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";
  const fullName = lines[0] || "Your Name";

  const data: ParsedResumeData = {
    fullName,
    email,
    phone,
    location: "",
    linkedin,
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    originalTemplate: metadata,
    preserveOriginal: !!metadata,
  };

  // Basic section population from text (enhanced later with metadata)
  if (metadata) {
    // Use metadata to populate sections more accurately
    metadata.sections.forEach(section => {
      const sectionText = section.items.map(item => item.text).join(' ');
      if (section.id === 'experience') {
        // Simple parsing: split into entries
        data.experience = sectionText.split(/(\d{4}|\w+ \d{4})/).filter(Boolean).map((chunk, i) => ({
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: [chunk.trim()],
        }));
      } else if (section.id === 'education') {
        data.education = [{ degree: '', institution: '', location: '', graduationDate: '', gpa: sectionText }];
      } else if (section.id === 'skills') {
        data.skills = sectionText.split(/,\s*/);
      }
      // Add more mappings as needed
    });
  }

  return data;
};

const processFile = async (file: File, onSuccess: (data: ParsedResumeData) => void, setIsProcessing: (value: boolean) => void, toast: any) => {
  setIsProcessing(true);
  try {
    let text = "";
    let thumbnail = "";
    let metadata: OriginalTemplateMetadata | undefined;

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdfJS = await import('pdfjs-dist');
          pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;

          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfJS.getDocument(typedArray).promise;
          const page = await pdf.getPage(1);
          
          // Get text content with positions for template detection
          const textContent = await page.getTextContent();
          const items = textContent.items as any[];
          text = items.map((item: any) => item.str).join(' ');

          // Extract metadata for template conversion
          metadata = extractTemplateMetadata(items, page);
          
          // Create thumbnail
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            thumbnail = canvas.toDataURL();
          }

          const parsedData = { ...parseResumeText(text, metadata), thumbnail };
          onSuccess(parsedData);
        } catch (pdfError) {
          console.error("Error processing PDF:", pdfError);
          toast({ title: "Error", description: "Failed to process PDF file.", variant: "destructive" });
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const mammoth = (await import("mammoth")).default;
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
        // Basic metadata for DOCX (limited; no positions)
        metadata = {
          layout: 'one-column' as const,
          fonts: { header: 'serif', body: 'sans-serif' },
          colors: {},
          sections: [], // Would need enhanced mammoth for structure
        };
        const parsedData = parseResumeText(text, metadata);
        onSuccess(parsedData);
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        text = e.target?.result as string;
        const parsedData = parseResumeText(text);
        onSuccess(parsedData);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to process resume file. Please try again.",
      variant: "destructive",
    });
    setIsProcessing(false);
  }
};

// Helper function to extract template metadata from PDF text items
const extractTemplateMetadata = (items: any[], page: any): OriginalTemplateMetadata => {
  const viewport = page.getViewport({ scale: 1 });
  const pageWidth = viewport.width;
  const pageHeight = viewport.height;

  // Group items by approximate y-position (tolerance for line height)
  const yGroups: { [y: number]: any[] } = {};
  items.forEach(item => {
    const transform = item.transform as [number, number, number, number, number, number];
    const x = transform[4];
    const y = pageHeight - transform[5]; // Flip y for CSS top
    const fontSize = item.width / item.str.length || 12; // Approximate
    const bold = item.fontName?.toLowerCase().includes('bold') || fontSize > 14;

    const roundedY = Math.round(y / 10) * 10; // Cluster tolerance
    if (!yGroups[roundedY]) yGroups[roundedY] = [];
    yGroups[roundedY].push({ ...item, x, y: roundedY, style: { fontSize, bold } });
  });

  // Sort y positions descending (top to bottom)
  const sortedY = Object.keys(yGroups).map(Number).sort((a, b) => b - a);

  // Detect sections based on large font or keywords
  const sections: OriginalTemplateMetadata['sections'] = [];
  let currentSection: { id: string; title: string; yStart: number; items: any[] } | null = null;
  const commonHeaders = ['experience', 'education', 'skills', 'summary', 'projects', 'certifications'];

  sortedY.forEach(yPos => {
    const group = yGroups[yPos].sort((a, b) => a.x - b.x); // Left to right
    const fullText = group.map(i => i.str).join(' ').toLowerCase().trim();

    // Check if header (large font or keyword)
    if ((group[0].style.fontSize > 14 || commonHeaders.some(h => fullText.includes(h))) && !currentSection) {
      currentSection = {
        id: fullText.includes('experience') ? 'experience' : fullText.includes('education') ? 'education' : fullText.includes('skills') ? 'skills' : 'other',
        title: group.map(i => i.str).join(' '),
        yStart: yPos,
        items: [],
      };
    } else if (currentSection) {
      currentSection.items.push(...group.map(i => ({ text: i.str, x: i.x, y: yPos, style: i.style })));
    }

    if (currentSection && fullText.includes('\n') || yPos < sortedY[0] * 0.8) { // End section on large gap or bottom
      if (currentSection.items.length > 0) sections.push(currentSection);
      currentSection = null;
    }
  });

  // Infer layout: Check x-span
  const maxX = Math.max(...items.map(i => (i.transform as any)[4]));
  const layout = maxX > pageWidth * 0.6 ? 'two-column' : 'one-column';

  // Sample fonts (map common pdfjs names)
  const headerFont = items.find(i => i.style.fontSize > 14)?.fontName || 'serif';
  const bodyFont = items.find(i => i.style.fontSize <= 14)?.fontName || 'sans-serif';

  return {
    layout,
    fonts: { header: headerFont.includes('Helvetica') ? 'sans-serif' : 'serif', body: 'sans-serif' },
    colors: { primary: '#000000', secondary: '#666666' }, // Default; advanced color detection needs pdf-lib
    sections: sections.length > 0 ? sections : [{ id: 'content', title: 'Main Content', yStart: 0, items }],
  };
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
  const [editedData, setEditedData] = useState<ParsedResumeData | null>(getSampleDataForTemplate("executive"));
  const [isStartingFromScratch, setIsStartingFromScratch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
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
        }
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, id]);

  const loadExistingResume = async (resumeId: string, userId: string) => {
    if (!userId) return;
    setIsLoadingResume(true);
    try {
      const resumeDoc = await getDoc(doc(db, "resumes", resumeId));
      if (resumeDoc.exists() && resumeDoc.data()?.user_id === userId) {
        const resumeData = resumeDoc.data();
        setParsedData(resumeData.content);
        setEditedData(resumeData.content);
        setSelectedTemplate(resumeData.content.originalTemplate ? "original" : "executive"); // Use original if available
        // If original template exists, allow template selection; otherwise go straight to editor
        setCurrentStep(resumeData.content.originalTemplate ? "template" : "editor");
        setIsStartingFromScratch(false);
        toast({
          title: "Resume Loaded",
          description: "Your resume is ready for editing.",
        });
      } else {
        toast({
          title: "Error",
          description: "Resume not found or access denied.",
          variant: "destructive",
        });
        navigate("/my-resumes");
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      toast({
        title: "Error",
        description: "Failed to load resume.",
        variant: "destructive",
      });
      navigate("/my-resumes");
    } finally {
      setIsLoadingResume(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      processFile(file, async (data) => {
        setParsedData(data);
        setEditedData(data);
        setIsStartingFromScratch(false);
        setCurrentStep("template");

        try {
          const title = data.fullName ? `${data.fullName}'s Resume` : "Uploaded Resume";
          await addDoc(collection(db, "resumes"), {
            title,
            content: data,
            is_ats_optimized: false,
            type: 'uploaded',
            user_id: user.uid,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          });

          toast({
            title: "Success",
            description: "Resume uploaded and saved successfully!",
          });
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Failed to save resume. You can save it later in the editor.",
            variant: "destructive",
          });
        }
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
    setIsStartingFromScratch(true);
    setCurrentStep("template");
  };

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (isStartingFromScratch) {
      const templateSampleData = getSampleDataForTemplate(templateId);
      setEditedData(templateSampleData);
    } else if (parsedData?.originalTemplate && templateId === 'original') {
      // Preserve original template
      setEditedData({ ...editedData, preserveOriginal: true });
    }
    setCurrentStep("editor");
  };

  const handleEditorChange = (data: ParsedResumeData) => {
    setEditedData(data);
  };

  const handleBack = () => {
    if (currentStep === "template") {
      setCurrentStep("upload");
    } else if (currentStep === "editor") {
      setCurrentStep("template");
    } else {
      navigate("/resumes");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep !== "upload" && (
        <header className="border-b animate-in slide-in-from-top-2 duration-500">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="hover:scale-110 transition-transform duration-200">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 py-8">
        {isLoadingResume ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading resume...</span>
          </div>
        ) : currentStep === "upload" && (
          <div className="space-y-8 animate-in fade-in-0 duration-1000">
            <div className="text-center animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              <h1 className="text-4xl font-bold mb-2">Create Your Professional Resume</h1>
              <p className="text-muted-foreground text-lg">How would you like to get started?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div
                className="border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/50 hover:scale-105 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left-4 duration-1000 delay-400"
                onClick={handleStartFromScratch}
              >
                <FileEdit className="h-16 w-16 text-primary mb-4 animate-in zoom-in-50 duration-1000 delay-600" />
                <h3 className="text-2xl font-semibold mb-2">Build a New Resume</h3>
                <p className="text-muted-foreground mb-4">
                  Start with a blank canvas and use our tools to build one from the ground up.
                </p>
                <Button className="w-full hover:scale-105 transition-transform duration-200">Start from Scratch</Button>
              </div>
              <div className="border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/50 hover:scale-105 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-right-4 duration-1000 delay-400">
                <UploadCloud className="h-16 w-16 text-primary mb-4 animate-in zoom-in-50 duration-1000 delay-600" />
                <h3 className="text-2xl font-semibold mb-2">Improve an Existing Resume</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your resume and we'll provide AI-powered suggestions, ATS-optimized templates, and real-time editing guidance.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.txt"
                  style={{ display: "none" }}
                />
                <Button
                  className="w-full hover:scale-105 transition-transform duration-200"
                  onClick={handleUploadClick}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin animate-in spin-in-12 duration-1000" />
                      Processing...
                    </>
                  ) : (
                    "Upload your resume"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === "template" && parsedData && (
          <TemplateSelection
            parsedData={parsedData}
            onTemplateSelected={handleTemplateSelected}
          />
        )}
        
        {currentStep === "editor" && parsedData && selectedTemplate && editedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 overflow-auto">
              <ResumeEditor
                key={selectedTemplate}
                parsedData={editedData}
                templateId={selectedTemplate}
                userId={user?.uid || ""}
                onDataChange={handleEditorChange}
                resumeId={id}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8 border rounded-lg p-6 bg-white shadow-lg overflow-auto max-h-[calc(100vh-4rem)]">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <h2 className="text-lg font-semibold">Resume Preview</h2>
                  <span className="text-xs text-muted-foreground">Live Preview</span>
                </div>
                <div className="resume-preview-wrapper" style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
                  <ResumePreview resumeData={editedData} templateId={selectedTemplate} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeBuilder;
