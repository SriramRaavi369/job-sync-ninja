
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDataFetching } from "@/hooks/useDataFetching";
import { FileText, Plus, ArrowLeft, Upload, Loader2 } from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
      linkedin,
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
  const { data: resumes, loading: resumesLoading, authLoading } = useDataFetching<Resume>('resumes', 'updated_at', { filterByUser: true, limit: 50 });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const db = getFirestore();

  const generatePdfThumbnail = async (file: File): Promise<string | undefined> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 }); 
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) return undefined;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext, viewport, canvas }).promise;
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
            const text = await pdfjs.getDocument({data: e.target?.result as ArrayBuffer}).promise.then(pdf => {
                const maxPages = pdf.numPages;
                const countPromises = [];
                for (let j = 1; j <= maxPages; j++) {
                    const page = pdf.getPage(j);
                    countPromises.push(page.then((page) => {
                        const textContent = page.getTextContent();
                        return textContent.then((textContent) => {
                            // Filter for TextItem and then map to str
                            return textContent.items.filter((item): item is TextItem => 'str' in item).map(s => s.str).join('');
                        });
                    }));
                }
                return Promise.all(countPromises).then((texts) => {
                    return texts.join('');
                });
            });
            parsedData = parseResumeText(text);
            parsedData.thumbnail = thumbnail; // Assign thumbnail here
            onSuccess(parsedData); // Call onSuccess after parsedData is fully populated
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
      await processFile(file, async (data) => {
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

          await addDoc(collection(db, "resumes"), resumeInsert);

          toast({
            title: "Success",
            description: "Resume uploaded and saved successfully!",
          });

        } catch (error: any) {
          console.error("Error saving resume:", error);
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploadedResumes.map((resume) => (
                  <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      {resume.content.thumbnail ? (
                        <img src={resume.content.thumbnail} alt={`${resume.title} thumbnail`} className="w-20 h-28 object-cover border rounded-md" />
                      ) : (
                        <FileText className="h-8 w-8 text-primary" />
                      )}
                      <div className="flex gap-2">
                        <Badge variant="secondary">Uploaded</Badge>
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
                <h3 className="text-xl font-semibold mb-2">No resumes uploaded yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your existing resume to optimize it with our AI tools and ATS-friendly templates.
                </p>
                <Button onClick={handleUploadClick} disabled={isProcessing}>
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
              </Card>
            )}
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
