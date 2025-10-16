import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Zap, FileText, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b animate-in slide-in-from-top-2 duration-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-in fade-in-0 duration-1000 delay-300">
            <Briefcase className="h-6 w-6 text-primary animate-in zoom-in-50 duration-1000 delay-500" />
            <span className="text-xl font-bold animate-in fade-in-0 duration-1000 delay-700">JobSync Ninja</span>
          </div>
          <div className="flex gap-2 animate-in fade-in-0 duration-1000 delay-1000">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="hover:scale-105 transition-transform duration-200">
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="hover:scale-105 transition-transform duration-200">Get Started</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300">
              Automate Your Job Applications
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
              Sync jobs from LinkedIn, optimize your resume with AI, and streamline your job search - all in one place.
            </p>
            <div className="flex gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-700">
              <Button size="lg" onClick={() => navigate("/auth")} className="hover:scale-105 hover:shadow-lg transition-all duration-300">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 hover:shadow-md transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-1000 delay-500">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Job Sync</h3>
              <p className="text-muted-foreground">
                Automatically fetch the latest jobs from LinkedIn as soon as they're posted.
              </p>
            </div>

            <div className="text-center p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-1000 delay-700">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Resume Builder</h3>
              <p className="text-muted-foreground">
                Create optimized resumes tailored to each job description with AI assistance.
              </p>
            </div>

            <div className="text-center p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-700 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-1000 delay-900">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Get matched with jobs that fit your skills and experience automatically.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
