
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, GraduationCap, UserRound, Building2, HeartPulse, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const solutions = [
  {
    icon: <Briefcase className="h-8 w-8 text-blue-600" />,
    title: "Business Teams",
    description: "For companies of all sizes. Coordinate teams, manage projects, and track resources efficiently.",
    cta: "For Businesses"
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
    title: "Educational Institutions",
    description: "For schools and universities. Manage course assignments, track student progress, and schedule academic tasks.",
    cta: "For Education"
  },
  {
    icon: <UserRound className="h-8 w-8 text-green-600" />,
    title: "Individuals & Freelancers",
    description: "For personal productivity. Track billable hours, manage personal projects, and stay on top of deadlines.",
    cta: "For Individuals"
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-red-600" />,
    title: "Healthcare Organizations",
    description: "For hospitals and clinics. Manage patient care tasks, clinical workflows, and resource allocation.",
    cta: "For Healthcare"
  }
];

const aboutPoints = [
  "AI-powered time tracking that learns your habits",
  "Smart task organization with context-aware suggestions",
  "Seamless integration with your existing workflow tools",
  "Real-time collaboration features for distributed teams",
  "Beautiful and intuitive interface designed for focus",
  "Data-driven insights to optimize your productivity"
];

const Index = () => {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <section id="home">
        <Hero />
      </section>
      
      <section id="features">
        <Features />
      </section>
      
      <section id="about" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Why choose Chronos?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A revolutionary approach to time management and task organization
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 md:p-10 border border-border">
              <div className={`space-y-6 ${isAboutExpanded ? '' : 'max-h-[400px] overflow-hidden relative'}`}>
                <p className="text-lg">
                  In today's fast-paced world, effective time management isn't just a skill—it's a necessity. Chronos was built from the ground up with a single mission: to transform how individuals and teams interact with their most precious resource—time.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
                
                <p>
                  Unlike conventional time tracking tools that simply record hours, Chronos actively helps you make better decisions about your time. Our intelligent system learns from your habits and provides actionable insights to optimize your workflow.
                </p>
                
                <p>
                  For teams, Chronos eliminates the friction of coordination. Real-time visibility into task status, intelligent resource allocation, and automated reporting save countless hours of administrative overhead.
                </p>
                
                <p>
                  Whether you're a freelancer tracking billable hours, a student balancing courses, or an enterprise managing complex projects, Chronos adapts to your specific needs with intuitive controls and powerful customization options.
                </p>
                
                <p>
                  With bank-level security, privacy-first design, and constant innovation, Chronos isn't just another productivity tool—it's a partner in your success.
                </p>
                
                {!isAboutExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/20 to-transparent"></div>
                )}
              </div>
              
              {!isAboutExpanded && (
                <div className="mt-4 text-center">
                  <Button 
                    onClick={() => setIsAboutExpanded(true)} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Read More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section id="solutions" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Tailored solutions for every team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our system adapts to your organization's unique structure and workflow needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6 md:p-8">
                  <div className="mb-6">{solution.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>
                  <Button 
                    variant="outline" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors gap-2"
                  >
                    {solution.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="pricing" className="py-20 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that's right for your team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Basic</h3>
                <div className="mb-4">
                  <span className="text-3xl font-semibold">$0</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Perfect for individuals and small projects.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 10 tasks
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic time tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    1 user only
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
              </div>
            </div>
            
            <div className="bg-white border-2 border-primary rounded-xl overflow-hidden shadow-md relative">
              <div className="absolute top-0 inset-x-0 bg-primary text-white text-xs font-medium py-1 text-center">
                Most Popular
              </div>
              <div className="p-6 pt-8">
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-3xl font-semibold">$12</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Perfect for freelancers and small teams.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited tasks
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced time tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 5 users
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic reporting
                  </li>
                </ul>
                <Button className="w-full">Try for Free</Button>
              </div>
            </div>
            
            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-3xl font-semibold">$49</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Perfect for large teams and organizations.</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited everything
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited users
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated support
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to start tracking time more effectively?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of teams that use Chronos to manage their work and track their time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2 min-w-[180px]">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary-foreground/20 hover:bg-primary-foreground/10 min-w-[180px]">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 bg-secondary/40">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Businesses</button></li>
                <li><button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Education</button></li>
                <li><button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Individuals</button></li>
                <li><button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Healthcare</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-semibold">Chronos</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chronos. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
