import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDataFetching } from "@/hooks/useDataFetching";
import { FileText, Plus, ArrowLeft, Upload, Loader2, User, Mail, Phone, Briefcase, Code } from "lucide-react";
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
  
  interface Resume {
      id: string;
      title: string;
      content: ParsedResumeData;
      is_ats_optimized: boolean;
      type: 'uploaded' | 'created';
      user_id: string;
      updated_at: { seconds: number, nanoseconds: number };
  }
  
  const parseResumeText = (text: string): ParsedResumeData => {
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
  
    return {
      fullName,
      email,
      phone,
      location: "",
      linkedin: "",
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    };
  };

const MyResumes = () => {
  const { user } = useAuth();
  const { data: fetchedResumes, loading: resumesLoading, authLoading } = useDataFetching<Resume>('resumes', 'updated_at', { filterByUser: true, limit: 50 });
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
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

  const processFile = async (file: File, onSuccess: (data: ParsedResumeData) => void) => {
    let parsedData: ParsedResumeData = parseResumeText("");
    let thumbnail: string | undefined = undefined;

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const mammoth = (await import("mammoth")).default;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        parsedData = parseResumeText(text);
        onSuccess(parsedData);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/pdf") {
        thumbnail = await generatePdfThumbnail(file);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const pdfJS = await import('pdfjs-dist');
            pdfJS.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

            const text = await pdfJS.getDocument({data: e.target?.result as ArrayBuffer}).promise.then(pdf => {
                const maxPages = pdf.numPages;
                const countPromises = [];
                for (let j = 1; j <= maxPages; j++) {
                    const page = pdf.getPage(j);
                    countPromises.push(page.then((page) => {
                        const textContent = page.getTextContent();
                        return textContent.then((textContent) => {
                            return textContent.items.filter((item): item is TextItem => 'str' in item).map(s => s.str).join('');
                        });
                    }));
                }
                return Promise.all(countPromises).then((texts) => {
                    return texts.join('');
                });
            });
            parsedData = parseResumeText(text);
            parsedData.thumbnail = thumbnail; 
            onSuccess(parsedData); 
        };
        reader.readAsArrayBuffer(file);
    }
    else {
      // Fallback for other file types like .txt
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parsedData = parseResumeText(text);
        onSuccess(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsProcessing(true);
      console.log("Starting file processing for:", file.name);
      await processFile(file, async (data) => {
        console.log("File processing successful. Attempting to save to the database.");
        try {
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
          console.error("!!! Critical Error: Failed to save resume to database.", error);
          toast({
            title: "Error Saving Resume",
            description: error.message || "Failed to save the resume to the database.",
            variant: "destructive",
          });
        }
      });
      setIsProcessing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
        <Tabs defaultValue="uploaded" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uploaded">Resumes uploaded by you ({uploadedResumes.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved resumes ({savedResumes.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="uploaded" className="mt-6">
            {uploadedResumes.length > 0 ? (
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
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResume(resume);
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/resume-builder/${resume.id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-0 shadow-sm">
                <div className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
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
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        Edit
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
        )}
      </main>
    </div>
  );
};

export default MyResumes;
