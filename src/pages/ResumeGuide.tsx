import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, FileText } from "lucide-react";

const ResumeGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/resumes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Resume Guide</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            More Than a Document: Your Key to Unlocking Opportunities
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            In today's competitive job market, where hundreds of candidates apply for a single position, 
            your resume is your first—and often only—chance to make an impression. But here's the reality: 
            a great resume isn't about fancy designs, colorful graphics, or creative layouts.
          </p>
          <p className="text-lg text-muted-foreground">
            <strong>It's about successfully communicating with both automated systems and human recruiters.</strong> The 
            difference between landing an interview at your dream company and getting automatically rejected 
            often comes down to understanding how modern hiring systems work.
          </p>
        </section>

        {/* The Challenge */}
        <section className="mb-12">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <XCircle className="h-6 w-6 text-destructive" />
                The Challenge: First, You Have to Beat the Bots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <strong>What is an ATS?</strong> An Applicant Tracking System (ATS) is automated software 
                that companies use to electronically parse and evaluate resumes. With hundreds or even thousands 
                of applications for each position, hiring managers can't manually review every single resume. 
                ATS systems reduce this workload by automatically screening applications.
              </p>
              <p className="text-muted-foreground">
                <strong>The Problem:</strong> Complex, colorful, or "creative" templates often fail to parse 
                correctly in these systems. What looks beautiful to you might be completely unreadable to an ATS. 
                Intricate multi-column layouts, tables, images, and graphics can cause your resume to be 
                automatically rejected—before a human ever sees it.
              </p>
              <div className="bg-background p-4 rounded-lg border">
                <p className="font-semibold mb-2">Important to Know:</p>
                <p className="text-sm text-muted-foreground">
                  The goal is <strong>not</strong> to get a high "ATS score" (which is often a marketing gimmick 
                  used by resume checker websites). The real goal is to ensure your resume's content is perfectly 
                  aligned with the job description and can be properly read by the system. Focus on matching 
                  keywords and qualifications from the job posting, not arbitrary scores.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Solution */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            The Winning Resume Formula: Do's and Don'ts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* DO THIS */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  DO THIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Submit as PDF</strong> named "[First Name Last Name].pdf"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Include your full location</strong> and a clickable LinkedIn URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Use simple, consistent date formats</strong> throughout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Ensure all text is selectable</strong> and readable (not a scanned image)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Tailor skills and experience</strong> to keywords in the job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Use standard section titles</strong> like "Work Experience," "Education," "Skills"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Maintain proper whitespace</strong> and appropriate margins/font sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span><strong>Use action verbs</strong> and quantifiable achievements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AVOID THIS */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  AVOID THIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>No images, graphs, tables,</strong> or elaborate colors/designs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Do not include an "Objective" section</strong>—use a concise Summary instead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Avoid listing irrelevant skills;</strong> ATS only looks for what's required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Never use scanned documents</strong> or non-selectable text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Don't use multi-column layouts</strong> that confuse parsing software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Avoid inconsistent formatting</strong> or date styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Don't remove sections</strong> recommended by professional templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span><strong>Never prioritize "creativity" over readability</strong> for ATS systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* See It in Action */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            See It in Action: A Proven Template for Success
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Why This Template Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Clean and Professional</p>
                    <p className="text-sm text-muted-foreground">
                      Notice the ample whitespace, standard font (like Arial or Calibri), and single-column layout. 
                      This ensures both ATS and human readers can easily scan the content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Clear Sections</p>
                    <p className="text-sm text-muted-foreground">
                      It uses standard headings like "Summary," "Education," "Projects," and "Technical Skills" 
                      that are immediately recognizable to both ATS and recruiters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Impactful Summary</p>
                    <p className="text-sm text-muted-foreground">
                      A concise summary at the top immediately states the candidate's career goals and key qualifications, 
                      helping both systems and recruiters quickly understand the applicant's value.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Action-Oriented Experience</p>
                    <p className="text-sm text-muted-foreground">
                      The internship and project descriptions use strong action verbs like "Engineered," "Orchestrated," 
                      and "Architected," combined with quantifiable achievements wherever possible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Relevant Skills</p>
                    <p className="text-sm text-muted-foreground">
                      Skills listed are specific and relevant to the target role, without unnecessary fluff. 
                      Each skill mentioned can be backed up by experience in the resume.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-6">
                <p className="text-sm font-semibold mb-2">Success Record:</p>
                <p className="text-sm text-muted-foreground">
                  Templates following these principles have been successfully used by candidates to secure positions 
                  at prestigious companies including <strong>Google, McKinsey, and Goldman Sachs</strong>. They've been 
                  reviewed and approved by recruiters and hiring managers from leading companies worldwide.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3">Key Takeaway</h3>
              <p className="text-muted-foreground mb-4">
                Remember: Your resume's job is to get you an interview, not to showcase your graphic design skills. 
                Keep it simple, keep it readable, and most importantly—tailor it to the specific job description. 
                The winning formula is alignment with job requirements + ATS compatibility + clear communication.
              </p>
              <Button onClick={() => navigate("/resumes/new")} size="lg" className="w-full md:w-auto">
                Create Your ATS-Optimized Resume
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default ResumeGuide;
