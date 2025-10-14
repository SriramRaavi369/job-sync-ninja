import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Sparkles, Shield } from "lucide-react";
import type { ParsedResumeData } from "@/pages/ResumeBuilder";
import ResumePreview from "@/components/resume-builder/ResumePreview";

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
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "AWS",
  ],
  projects: [],
  certifications: [],
};

const templates: Template[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, sans-serif font with simple bottom borders. Ideal for tech professionals.",
    preview: "A simple, elegant design with clear section headers",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Clean, scannable format is great for technical roles.",
    features: [
      "Single-column layout",
      "Standard sans-serif font",
      "Clear section headers",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="modern-minimal" />
      </div>
    ),
  },
  {
    id: "professional-classic",
    name: "Professional Classic",
    description: "Serif font with uppercase headers for a traditional, corporate feel.",
    preview: "A timeless design with traditional formatting",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Trusted format for corporate and academic roles.",
    features: [
      "Traditional serif font",
      "Clear, uppercase headers",
      "High readability",
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
    description: "Monospace font for headers and a prominent skills section. Perfect for developers.",
    preview: "Technical layout emphasizing skills and projects",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Highlights technical skills and experience.",
    features: [
      "Monospace font for headers",
      "Prominent skills section",
      "Clean, readable layout",
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
    description: "A strong, bold name and prominent summary section. For senior and leadership roles.",
    preview: "Professional layout for executive-level resumes",
    atsOptimized: true,
    features: [
      "Bold, prominent name",
      "Emphasis on summary section",
      "Strong, professional look",
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
    description: "A formal, serif font with clear sections for publications and research.",
    preview: "Academic-focused layout with publications section",
    atsOptimized: true,
    features: [
      "Formal serif font",
      "Clear, distinct sections",
      "Ideal for academic applications",
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
    description: "Stylish sans-serif font with subtle color accents on the headers.",
    preview: "Professional yet creative layout",
    atsOptimized: true,
    features: [
      "Stylish, modern font",
      "Subtle color accents",
      "Visually appealing layout",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="creative-professional" />
      </div>
    ),
  },
  {
    id: "skill-focused",
    name: "Skill-Focused",
    description: "Skills section at the top with tags. For career changers or skill-heavy roles.",
    preview: "A template that emphasizes your core competencies and technical abilities.",
    atsOptimized: true,
    features: [
      "Skills section at the top",
      "Visually highlighted skills",
      "Great for technical roles",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="skill-focused" />
      </div>
    ),
  },
  {
    id: "achievement-driven",
    name: "Achievement-Driven",
    description: "A results-oriented design that emphasizes quantifiable accomplishments.",
    preview: "A results-oriented template designed to showcase your impact.",
    atsOptimized: true,
    features: [
      "Focus on achievements",
      "Quantifiable results",
      "Strong for senior roles",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="achievement-driven" />
      </div>
    ),
  },
  {
    id: "chronological",
    name: "Chronological",
    description: "A traditional, easy-to-scan format with clear date alignment.",
    preview: "A traditional template showcasing career progression.",
    atsOptimized: true,
    features: [
      "Easy-to-scan format",
      "Clear date alignment",
      "Traditional and professional",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="chronological" />
      </div>
    ),
  },
  {
    id: "simple-modern",
    name: "Simple Modern",
    description: "Minimalist design with ample white space and light font weights.",
    preview: "A minimalist template with a modern aesthetic.",
    atsOptimized: true,
    features: [
      "Minimalist design",
      "Ample white space",
      "Clean and contemporary",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={sampleResumeData} templateId="simple-modern" />
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
          Select from our gallery of 10 ATS-optimized resume templates.
        </p>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
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
                  Based on your profile, we've selected templates that will best showcase your experience. These templates are optimized for applicant tracking systems and designed to increase your interview chances.
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
