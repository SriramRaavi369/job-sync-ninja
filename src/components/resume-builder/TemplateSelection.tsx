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

// Different sample data for each template to showcase unique designs
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

    case "classic":
      return {
        ...baseData,
        fullName: "Sarah Kim",
        summary: "Full-stack developer specializing in React, Python, and cloud architecture with expertise in microservices.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "TechStart Inc.",
            location: "San Francisco, CA",
            startDate: "Mar 2021",
            endDate: "Present",
            description: [
              "Built scalable microservices architecture serving 1M+ users",
              "Implemented CI/CD pipelines reducing deployment time by 60%",
              "Mentored 5 junior developers and conducted code reviews",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "MIT",
            location: "Cambridge, MA",
            graduationDate: "May 2019",
            gpa: "3.7",
          },
        ],
        skills: ["React", "Python", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
        projects: [
          {
            name: "Microservices E-commerce Platform",
            description: "Built scalable e-commerce platform handling 1M+ transactions daily",
            technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
            link: "https://github.com/sarahkim/ecommerce-platform"
          },
          {
            name: "Real-time Analytics Dashboard",
            description: "Developed dashboard for monitoring system performance and user behavior",
            technologies: ["React", "D3.js", "WebSocket", "Python"],
            link: "https://github.com/sarahkim/analytics-dashboard"
          }
        ],
        certifications: [
          {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023"
          },
          {
            name: "Certified Kubernetes Administrator",
            issuer: "Cloud Native Computing Foundation",
            date: "2022"
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

    case "novel":
      return {
        ...baseData,
        fullName: "Dr. James Wilson",
        summary: "Research scientist specializing in machine learning and artificial intelligence with 20+ published papers.",
        experience: [
          {
            title: "Research Scientist",
            company: "MIT Computer Science Lab",
            location: "Cambridge, MA",
            startDate: "Sep 2018",
            endDate: "Present",
            description: [
              "Published 15 peer-reviewed papers in top-tier AI conferences",
              "Led research team developing novel neural network architectures",
              "Secured $2M in research funding from NSF and DARPA",
            ],
          },
        ],
        education: [
          {
            degree: "PhD in Computer Science",
            institution: "Stanford University",
            location: "Stanford, CA",
            graduationDate: "May 2018",
            gpa: "3.9",
          },
        ],
        skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow", "PyTorch", "Research"],
        projects: [
          {
            name: "Neural Architecture Search for Computer Vision",
            description: "Published research on automated neural network design achieving state-of-the-art results on ImageNet",
            technologies: ["Python", "PyTorch", "Computer Vision", "Neural Architecture Search"],
            link: "https://arxiv.org/abs/2023.nas-cv"
          },
          {
            name: "Federated Learning Framework",
            description: "Developed privacy-preserving machine learning framework for distributed training",
            technologies: ["Python", "TensorFlow", "Federated Learning", "Privacy"],
            link: "https://github.com/jwilson/federated-learning"
          }
        ],
        certifications: [
          {
            name: "Google Research Scholar",
            issuer: "Google Research",
            date: "2023"
          }
        ],
      };

    case "spotlight":
      return {
        ...baseData,
        fullName: "David Park",
        summary: "Career changer transitioning from finance to software development with strong analytical and problem-solving skills.",
        experience: [
          {
            title: "Financial Analyst",
            company: "Investment Bank LLC",
            location: "Chicago, IL",
            startDate: "Jan 2019",
            endDate: "Dec 2023",
            description: [
              "Analyzed financial data using Python and SQL",
              "Developed automated reporting tools saving 20 hours/week",
              "Led cross-functional teams on complex financial modeling projects",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Finance",
            institution: "University of Chicago",
            location: "Chicago, IL",
            graduationDate: "May 2018",
            gpa: "3.6",
          },
        ],
        skills: ["Python", "SQL", "JavaScript", "React", "Financial Analysis", "Data Visualization"],
        projects: [],
        certifications: [],
      };

    case "patterns":
      return {
        ...baseData,
        fullName: "Lisa Martinez",
        summary: "Sales executive with proven track record of exceeding targets and driving revenue growth in competitive markets.",
        experience: [
          {
            title: "Regional Sales Manager",
            company: "Enterprise Solutions Inc.",
            location: "Austin, TX",
            startDate: "Jan 2021",
            endDate: "Present",
            description: [
              "Exceeded annual sales targets by 35% for 3 consecutive years",
              "Generated $5M in new revenue through strategic client acquisition",
              "Led sales team of 8 representatives across 4 states",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Business Administration",
            institution: "University of Texas",
            location: "Austin, TX",
            graduationDate: "May 2017",
            gpa: "3.8",
          },
        ],
        skills: ["Sales Management", "Client Relations", "Revenue Growth", "Team Leadership", "CRM Systems"],
        projects: [],
        certifications: [],
      };

    case "polished":
      return {
        ...baseData,
        fullName: "Jordan Lee",
        summary: "Strategic product manager with expertise in user-centered design and data-driven decision making.",
        experience: [
          {
            title: "Senior Product Manager",
            company: "Innovation Labs",
            location: "Seattle, WA",
            startDate: "Jan 2022",
            endDate: "Present",
            description: [
              "Led product strategy for mobile app reaching 2M+ active users",
              "Collaborated with design and engineering teams to deliver features on schedule",
              "Analyzed user data to inform product roadmap and feature prioritization",
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
        skills: ["Product Strategy", "User Research", "Data Analysis", "Agile Development"],
        projects: [],
        certifications: [],
      };

    case "quote-bubble":
      return {
        ...baseData,
        fullName: "Robert Johnson",
        summary: "Experienced financial analyst with strong background in investment banking and portfolio management.",
        experience: [
          {
            title: "Senior Financial Analyst",
            company: "Goldman Sachs",
            location: "New York, NY",
            startDate: "Jun 2019",
            endDate: "Present",
            description: [
              "Analyzed investment opportunities worth over $500M in total value",
              "Prepared detailed financial models and risk assessments for client portfolios",
              "Collaborated with senior management on strategic investment decisions",
            ],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Finance",
            institution: "Wharton School, University of Pennsylvania",
            location: "Philadelphia, PA",
            graduationDate: "May 2019",
            gpa: "3.8",
          },
        ],
        skills: ["Financial Modeling", "Investment Analysis", "Risk Management", "Portfolio Optimization"],
        projects: [],
        certifications: [],
      };

    case "trendy":
      return {
        ...baseData,
        fullName: "Sophie Chen",
        summary: "UX designer focused on creating intuitive digital experiences through user research and iterative design.",
        experience: [
          {
            title: "Senior UX Designer",
            company: "Design Studio Co.",
            location: "San Francisco, CA",
            startDate: "Mar 2021",
            endDate: "Present",
            description: [
              "Designed user interfaces for mobile apps with 1M+ downloads",
              "Conducted user research studies improving conversion rates by 40%",
              "Led design system implementation across 5 product teams",
            ],
          },
        ],
        education: [
          {
            degree: "Master of Design in Human-Computer Interaction",
            institution: "Carnegie Mellon University",
            location: "Pittsburgh, PA",
            graduationDate: "May 2020",
            gpa: "3.9",
          },
        ],
        skills: ["User Research", "Prototyping", "Design Systems", "Figma"],
        projects: [],
        certifications: [],
      };

    case "unique":
      return {
        ...baseData,
        fullName: "William Thompson",
        summary: "Corporate attorney specializing in mergers and acquisitions with extensive experience in complex transactions.",
        experience: [
          {
            title: "Senior Associate Attorney",
            company: "Cravath, Swaine & Moore LLP",
            location: "New York, NY",
            startDate: "Sep 2018",
            endDate: "Present",
            description: [
              "Led legal due diligence for M&A transactions exceeding $2B in value",
              "Drafted and negotiated complex acquisition agreements and financing documents",
              "Advised clients on corporate governance and regulatory compliance matters",
            ],
          },
        ],
        education: [
          {
            degree: "Juris Doctor",
            institution: "Harvard Law School",
            location: "Cambridge, MA",
            graduationDate: "May 2018",
            gpa: "3.7",
          },
        ],
        skills: ["Mergers & Acquisitions", "Corporate Law", "Contract Negotiation", "Regulatory Compliance"],
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
              "Coordinated with stakeholders across multiple departments",
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
        skills: ["Project Management", "Agile Methodologies", "Team Leadership", "Stakeholder Management"],
        projects: [],
        certifications: [],
      };
  }
};

const templates: Template[] = [
  {
    id: "blue-monogram",
    name: "Blue Monogram",
    description: "Modern template with a splash of blue color to highlight section headers, making it easy for recruiters to navigate. Features clean typography and professional styling.",
    preview: "Modern layout with blue accent colors",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Perfect balance of professionalism and visual appeal with blue accent colors.",
    features: [
      "Blue gradient header accent",
      "Clean, modern typography",
      "Professional section headers",
      "ATS-optimized layout",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("blue-monogram")} templateId="blue-monogram" />
      </div>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless design that focuses on your accomplishments with a simple yet appealing layout. Features serif typography and traditional styling perfect for conservative industries.",
    preview: "Traditional classic layout with serif typography",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Perfect for traditional industries with clean, professional serif typography.",
    features: [
      "Serif typography styling",
      "Traditional professional layout",
      "Clean section borders",
      "Conservative industry friendly",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("classic")} templateId="classic" />
      </div>
    ),
  },
  {
    id: "intelligent",
    name: "Intelligent",
    description: "Provides a dash of style to draw employers to your qualifications. Features green accent colors and clean typography with professional styling elements.",
    preview: "Intelligent layout with green accent colors",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Balances style with professionalism, perfect for modern job applications.",
    features: [
      "Green accent color scheme",
      "Clean, intelligent styling",
      "Professional typography",
      "Modern visual elements",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("intelligent")} templateId="intelligent" />
      </div>
    ),
  },
  {
    id: "novel",
    name: "Novel",
    description: "Features bold colors to make your skills and experience stand out. Purple gradient header with distinctive styling perfect for creative and modern professionals.",
    preview: "Bold colorful layout with purple accents",
    atsOptimized: true,
    features: [
      "Purple gradient header",
      "Bold color accents",
      "Distinctive styling",
      "Creative professional appeal",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("novel")} templateId="novel" />
      </div>
    ),
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description: "A colorful template ideal for applicants in creative industries. Features orange gradient header and star bullet points to highlight achievements.",
    preview: "Colorful creative layout with orange accents",
    atsOptimized: true,
    recommended: true,
    recommendedReason: "Perfect for creative industries with vibrant colors and unique styling.",
    features: [
      "Orange gradient header",
      "Star bullet points",
      "Creative industry focused",
      "Vibrant color scheme",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("spotlight")} templateId="spotlight" />
      </div>
    ),
  },
  {
    id: "patterns",
    name: "Patterns",
    description: "Uses a mix of patterns and colors to leave a memorable impression. Features indigo gradient header with diamond bullet points for unique visual appeal.",
    preview: "Patterned layout with indigo accents",
    atsOptimized: true,
    features: [
      "Indigo gradient header",
      "Diamond bullet points",
      "Memorable visual patterns",
      "Unique styling elements",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("patterns")} templateId="patterns" />
      </div>
    ),
  },
  {
    id: "polished",
    name: "Polished",
    description: "Combines a bold header with subtle color to mix artistry with professionalism. Features teal gradient header and arrow bullet points for a polished look.",
    preview: "Polished layout with teal accents",
    atsOptimized: true,
    features: [
      "Teal gradient header",
      "Arrow bullet points",
      "Artistry meets professionalism",
      "Polished visual design",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("polished")} templateId="polished" />
      </div>
    ),
  },
  {
    id: "quote-bubble",
    name: "Quote Bubble",
    description: "Showcases your credentials and personality with a fun design. Features cyan gradient header and quote bubble bullet points for a unique, memorable look.",
    preview: "Fun layout with quote bubble styling",
    atsOptimized: true,
    features: [
      "Cyan gradient header",
      "Quote bubble bullets",
      "Fun, memorable design",
      "Personality showcase",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("quote-bubble")} templateId="quote-bubble" />
      </div>
    ),
  },
  {
    id: "trendy",
    name: "Trendy",
    description: "Features a pop of color and crisp fonts for a unique CV. Pink gradient header with arrow bullet points perfect for modern, trendy professionals.",
    preview: "Trendy layout with pink accents",
    atsOptimized: true,
    features: [
      "Pink gradient header",
      "Arrow bullet points",
      "Crisp, modern fonts",
      "Trendy professional appeal",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("trendy")} templateId="trendy" />
      </div>
    ),
  },
  {
    id: "unique",
    name: "Unique",
    description: "Presents your achievements with simple and polished styling. Features emerald gradient header and checkmark bullet points for a clean, unique look.",
    preview: "Unique layout with emerald accents",
    atsOptimized: true,
    features: [
      "Emerald gradient header",
      "Checkmark bullet points",
      "Simple, polished styling",
      "Unique visual appeal",
    ],
    previewComponent: (
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] p-4">
        <ResumePreview resumeData={getSampleDataForTemplate("unique")} templateId="unique" />
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
