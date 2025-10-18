
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft, FileText } from "lucide-react";

const Resumes = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Templates</h1>
            </div>
          </div>
          <Button onClick={() => navigate("/resumes/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Professional Resume Templates</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose from our collection of 10 ATS-optimized resume templates inspired by the best designs in the industry. 
            Each template is professionally crafted to help you stand out to employers.
          </p>
        </div>

        {/* Template Gallery */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Template Preview Cards */}
            {[
              { name: "Blue Monogram", color: "from-blue-500 to-blue-600", description: "Modern & Professional" },
              { name: "Classic", color: "from-gray-600 to-gray-700", description: "Traditional & Timeless" },
              { name: "Intelligent", color: "from-green-500 to-green-600", description: "Smart & Stylish" },
              { name: "Novel", color: "from-purple-500 to-purple-600", description: "Bold & Creative" },
              { name: "Spotlight", color: "from-orange-500 to-orange-600", description: "Vibrant & Eye-catching" },
            ].map((template, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`h-32 bg-gradient-to-r ${template.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <div className="text-white font-bold text-lg">{template.name}</div>
                </div>
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <Button 
                  size="sm" 
                  className="w-full group-hover:bg-primary"
                  onClick={() => navigate("/resumes/new")}
                >
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Guide Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">📚 New to Resume Writing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to create ATS-optimized resumes that get you interviews at top companies. 
                Our comprehensive guide covers everything from beating applicant tracking systems to crafting compelling content.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/resume-guide")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Read the Resume Guide
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Resumes;
