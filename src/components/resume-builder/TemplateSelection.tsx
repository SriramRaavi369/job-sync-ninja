import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Sparkles, Shield } from "lucide-react";
import type { ParsedResumeData } from "@/pages/ResumeBuilder";
import ResumePreview from "@/components/resume-builder/ResumePreview"; // Import ResumePreview

interface TemplateSelectionProps {
  parsedData: ParsedResumeData;
  onTemplateSelected: (templateId: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  atsOptimized: boolean;
  recommended?: boolean;
  recommendedReason?: string;
  features: string[];
  previewComponent: JSX.Element;
}

// Sample data for template previews
const sampleResumeData: ParsedResumeData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "(123) 456-7890",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/johndoe",
  summary:
    "Highly motivated and results-oriented software engineer with 5+ years of experience in developing and deploying scalable web applications.",
  experience: [
    {
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      description: [
        "Developed and maintained full-stack web applications using React, Node.js, and PostgreSQL.",
        "Led a team of 3 engineers in the successful launch of a new product feature, increasing user engagement by 20%.",
        "Implemented CI/CD pipelines, reducing deployment time by 50%.",
      ],
    },
    {
      title: "Junior Developer",
      company: "Innovate Corp.",
      location: "Seattle, WA",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      description: [
        "Contributed to the development of a mobile application using React Native.",
        "Assisted in bug fixing and performance optimization.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduationDate: "May 2022",
      gpa: "3.9",
    },
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "University of Washington",
      location: "Seattle, WA",
      graduationDate: "May 2020",
      gpa: "3.8",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Git",
    "Agile Methodologies",
  ],
  projects: [],
  certifications: [],
};

const templates: Template[] = [
  {
    id: "default-template", // Changed to default-template to match ResumePreview logic
    name: "Modern Minimal",
    description: "Clean, single-column layout perfect for tech professionals",
    preview: "A simple, elegant design with clear section headers",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Recommended for AI/ML professionals - emphasizes technical skills and projects",
    features: [
      "Single-column layout",
      "Standard fonts (Arial, Calibri)",
      "Clear section headers",
      "No images or graphics",
      "Excellent ATS compatibility",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="default-template" />
      </div>
    ),
  },
  {
    id: "professional-classic",
    name: "Professional Classic",
    description: "Traditional format trusted by Fortune 500 companies",
    preview: "A timeless design with traditional formatting",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Improved layout for showcasing extensive experience",
    features: [
      "Traditional structure",
      "Experience-focused",
      "High readability",
      "No tables or columns",
      "Proven ATS success rate",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="professional-classic" />
      </div>
    ),
  },
  {
    id: "technical-focused",
    name: "Technical Focused",
    description: "Optimized for engineering and technical roles",
    preview: "Technical layout emphasizing skills and projects",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Enhanced for technical project showcase",
    features: [
      "Skills section prominence",
      "Project-focused layout",
      "Technical certifications highlight",
      "Clean bullet points",
      "ATS-friendly formatting",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="technical-focused" />
      </div>
    ),
  },
  {
    id: "executive-summary",
    name: "Executive Summary",
    description: "Leadership-focused template for senior positions",
    preview: "Professional layout for executive-level resumes",
    atsOptimized: true,
    features: [
      "Executive summary section",
      "Achievement-focused",
      "Leadership emphasis",
      "Clean structure",
      "ATS compliant",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="executive-summary" />
      </div>
    ),
  },
  {
    id: "academic-research",
    name: "Academic & Research",
    description: "Designed for academic and research positions",
    preview: "Academic-focused layout with publications section",
    atsOptimized: true,
    features: [
      "Publications section",
      "Research highlights",
      "Academic credentials focus",
      "Simple formatting",
      "ATS compatible",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="academic-research" />
      </div>
    ),
  },
  {
    id: "creative-professional",
    name: "Creative Professional",
    description: "Balanced design for creative roles",
    preview: "Professional yet creative layout",
    atsOptimized: true,
    features: [
      "Portfolio integration",
      "Project showcase",
      "Skills visualization",
      "ATS-safe design",
      "Professional appearance",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="creative-professional" />
      </div>
    ),
  },
];

const TemplateSelection = ({ parsedData, onTemplateSelected }: TemplateSelectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const recommendedTemplates = templates.filter((t) => t.recommended);
  const allTemplates = templates;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onTemplateSelected(selectedTemplate);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Template</h1>
        <p className="text-muted-foreground">
          Select from AI-recommended templates or browse our ATS-optimized gallery
        </p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="recommended" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommended
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Shield className="h-4 w-4" />
            ATS Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your profile, we've selected templates that will best showcase your experience
                  {parsedData.fullName && ` as ${parsedData.fullName}`}. These templates are optimized for
                  applicant tracking systems and designed to increase your interview chances.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedTemplates.map((template) => (
              <Card
                key={template.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="aspect-[8.5/11] bg-muted rounded mb-4 flex items-center justify-center overflow-hidden">
                  {template.previewComponent}
                </div>

                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>

                {template.recommendedReason && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mb-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Why recommended:</strong> {template.recommendedReason}
                    </p>
                  </div>
                )}

                <div className="space-y-1 mb-4">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? "Selected" : "Select Template"}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">100% ATS-Optimized Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Every template in our gallery is designed to pass Applicant Tracking Systems with the
                  following guarantees:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>No Visual Clutter:</strong> Excludes images, graphs, colors, and tables that
                      confuse ATS
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Standard Structure:</strong> Single-column layouts with clearly labeled
                      sections
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>High Readability:</strong> Standard fonts with appropriate margins and
                      whitespace
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Proven Compatibility:</strong> Pre-tested for text selection and system parsing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allTemplates.map((template) => (
              <Card
                key={template.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    ATS Optimized
                  </Badge>
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="aspect-[8.5/11] bg-muted rounded mb-4 flex items-center justify-center overflow-hidden">
                  {template.previewComponent}
                </div>

                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>

                <div className="space-y-1 mb-4">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? "Selected" : "Select Template"}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium">
                {templates.find((t) => t.id === selectedTemplate)?.name} selected
              </p>
              <p className="text-sm text-muted-foreground">Ready to customize your resume</p>
            </div>
            <Button size="lg" onClick={handleContinue}>
              Continue to Editor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;
