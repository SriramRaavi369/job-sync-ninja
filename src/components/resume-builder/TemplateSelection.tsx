import { useState, useEffect } from "react";
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
  atsOptimized: boolean;
  recommended?: boolean;
  recommendedReason?: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: "executive",
    name: "Executive",
    description: "A classic, professional design suitable for senior-level roles.",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Its clean and traditional layout is favored by executive recruiters.",
    features: ["Traditional serif font", "Centered header", "Clear section breaks"],
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "A modern design that highlights technical skills and projects.",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Emphasizes the skills and projects sections crucial for tech roles.",
    features: ["Modern sans-serif font", "Prominent skills section", "Project showcase"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "A stylish template for roles in design, marketing, and other creative fields.",
    atsOptimized: false,
    features: ["Unique layout", "Emphasis on visual presentation", "Space for portfolio link"],
  },
];

const TemplateSelection = ({ parsedData, onTemplateSelected }: TemplateSelectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("executive");

  const getSampleDataForTemplate = (templateId: string): ParsedResumeData => {
    // Return different data based on template to give a better preview
    if (templateId === 'software-engineer') {
      return {
        ...parsedData,
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "123-456-7890",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/janedoe",
        summary: "Innovative software engineer with a passion for developing scalable web applications.",
        skills: ["React", "Node.js", "Python", "AWS", ...parsedData.skills],
      };
    }
    return parsedData;
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    onTemplateSelected(selectedTemplate);
  };

  useEffect(() => {
    // Auto-select a recommended template based on parsed data
    const hasTechnicalSkills = parsedData.skills.some(skill => ['javascript', 'python', 'java', 'react'].includes(skill.toLowerCase()));
    if (hasTechnicalSkills) {
      setSelectedTemplate("software-engineer");
    }
  }, [parsedData]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Template</h1>
        <p className="text-muted-foreground">Select a template to see a live preview with your content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <Tabs defaultValue="recommended">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="recommended" className="space-y-4 pt-4">
              {templates.filter(t => t.recommended).map((template) => (
                <TemplateCard key={template.id} template={template} selectedTemplate={selectedTemplate} onSelect={handleTemplateSelect} />
              ))}
            </TabsContent>
            <TabsContent value="all" className="space-y-4 pt-4">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} selectedTemplate={selectedTemplate} onSelect={handleTemplateSelect} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2 sticky top-8">
          <Card className="p-4">
            <div className="aspect-[8.5/11] bg-white">
              <ResumePreview resumeData={getSampleDataForTemplate(selectedTemplate)} templateId={selectedTemplate} />
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-end">
          <Button size="lg" onClick={handleContinue}>Continue to Editor</Button>
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({ template, selectedTemplate, onSelect }: { template: Template, selectedTemplate: string, onSelect: (id: string) => void }) => (
  <Card
    className={`p-4 cursor-pointer transition-all ${selectedTemplate === template.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
    onClick={() => onSelect(template.id)}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
      {selectedTemplate === template.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
    </div>
    <div className="mt-2 flex items-center gap-2">
      {template.atsOptimized ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800"><Shield className="h-3 w-3 mr-1" />ATS Friendly</Badge>
      ) : (
        <Badge variant="destructive">Not ATS Friendly</Badge>
      )}
      {template.recommended && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Sparkles className="h-3 w-3 mr-1" />Recommended</Badge>
      )}
    </div>
    {template.recommendedReason && <p className="text-xs text-muted-foreground mt-2"><strong>Reason:</strong> {template.recommendedReason}</p>}
  </Card>
);

export default TemplateSelection;
