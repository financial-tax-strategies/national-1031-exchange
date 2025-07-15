import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Clock, 
  TrendingUp, 
  Home, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Shield,
  BookOpen,
  Star,
  Award,
  DollarSign,
  Target,
  Building,
  FileText,
  Phone,
  Mail,
  MapPin,
  Zap,
  BarChart3,
  PieChart,
  TrendingDown,
  Eye,
  Search,
  Calendar,
  Building2,
  Briefcase
} from "lucide-react";

import heroImage from "@/assets/hero-image.jpg";
import testimonialPhoto from "@/assets/testimonial-photo.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">National 1031 Exchange Services</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tools" className="text-foreground hover:text-brand-teal transition-colors">Tools</a>
            <a href="#education" className="text-foreground hover:text-brand-teal transition-colors">Education</a>
            <a href="#pricing" className="text-foreground hover:text-brand-teal transition-colors">Pricing</a>
            <Button variant="brand" size="sm">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-tight">
                  Save <span className="text-brand-teal">$100,000+</span> in Taxes on Your Property Sale
                </h1>
                <h2 className="text-xl lg:text-2xl text-muted-foreground font-semibold">
                  Master Your 1031 Exchange with Confidence
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Join 10,000+ investors who've successfully deferred <span className="font-semibold text-brand-teal">$2.5B</span> in capital gains taxes using our tools, guides, and expert network.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="brand" size="xl" className="flex-1 sm:flex-none">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate My Tax Savings
                </Button>
                <Button variant="brand-outline" size="xl" className="flex-1 sm:flex-none">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Start My Exchange Checklist
                </Button>
              </div>

              {/* Trust Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-brand-teal" />
                  <span className="text-sm font-medium">99.2% Success Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-brand-teal" />
                  <span className="text-sm font-medium">$2.5B Taxes Deferred</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-brand-teal" />
                  <span className="text-sm font-medium">10,000+ Successful Exchanges</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional real estate investor" 
                className="w-full h-auto rounded-lg shadow-hover"
              />
              <div className="absolute -bottom-4 -right-4 bg-brand-teal text-primary-foreground p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold">$2.5B</div>
                <div className="text-sm">Taxes Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-brand-pearl">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Why 47% of 1031 Exchanges Fail (And How We Help You Succeed)
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-destructive">The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Missed Deadlines</h3>
                <p className="text-muted-foreground">
                  Complex 45-day and 180-day deadlines catch investors off guard, leading to costly failures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-brand-copper/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-brand-copper" />
                </div>
                <CardTitle className="text-brand-copper">Traditional Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Expensive Advisors</h3>
                <p className="text-muted-foreground">
                  High fees, limited availability, and one-size-fits-all approaches that don't scale.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-brand-teal">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-brand-teal" />
                </div>
                <CardTitle className="text-brand-teal">Our Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Complete Success System</h3>
                <p className="text-muted-foreground">
                  Automated tools, expert guidance, and proven processes that guarantee success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tools Showcase */}
      <section id="tools" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Everything You Need to Execute a Perfect 1031 Exchange
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-hover transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Tax Savings Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Calculate your exact tax savings and ROI in seconds.
                </p>
                <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                  Try It Free →
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-hover transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Exchange Timeline Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Never miss a deadline with automated reminders and tracking.
                </p>
                <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                  Try It Free →
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-hover transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Success Predictor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  AI-powered analysis of your exchange success probability.
                </p>
                <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                  Try It Free →
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-hover transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Property Matcher</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Find qualified replacement properties in your area.
                </p>
                <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                  Try It Free →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-brand-pearl">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="p-8">
                <div className="flex items-start space-x-4">
                  <img 
                    src={testimonialPhoto} 
                    alt="Customer testimonial" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                    <p className="text-lg mb-4">
                      "I saved $180,000 in taxes on my commercial property sale. Their calculator was spot-on, and the timeline tracker kept me on track throughout the entire process."
                    </p>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">Commercial Real Estate Investor</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-teal mb-2">99.2%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-teal mb-2">$2.5B</div>
                <div className="text-sm text-muted-foreground">Taxes Deferred</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-teal mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Successful Exchanges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-teal mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Hub Preview */}
      <section id="education" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Master 1031 Exchanges with Expert-Led Education
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Beginner's Guide</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <span>(2,340 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete introduction to 1031 exchanges, requirements, and strategies.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. 2 hours</span>
                  <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                    Start Learning →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Advanced Strategies</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <span>(1,890 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Advanced techniques for maximizing tax benefits and investment returns.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. 3 hours</span>
                  <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                    Start Learning →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Risk Management</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <span>(1,456 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Identify and mitigate common risks in 1031 exchange transactions.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. 1.5 hours</span>
                  <Button variant="ghost" className="text-brand-teal hover:text-brand-teal p-0">
                    Start Learning →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Net Section */}
      <section className="py-16 bg-brand-pearl">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Our Safety Net Protects You From Common Failure Points
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-destructive">Common Failure Points</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <div className="font-medium">Missed 45-Day Deadline</div>
                    <div className="text-sm text-muted-foreground">Property identification window expires</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <div className="font-medium">Incomplete Documentation</div>
                    <div className="text-sm text-muted-foreground">Missing required paperwork and forms</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <div className="font-medium">Improper Property Identification</div>
                    <div className="text-sm text-muted-foreground">Non-qualifying properties selected</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <div className="font-medium">Financing Issues</div>
                    <div className="text-sm text-muted-foreground">Unable to secure replacement property funding</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-brand-teal">Our Protection Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brand-teal mt-1" />
                  <div>
                    <div className="font-medium">Automated Timeline Alerts</div>
                    <div className="text-sm text-muted-foreground">Never miss critical deadlines again</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brand-teal mt-1" />
                  <div>
                    <div className="font-medium">Document Verification System</div>
                    <div className="text-sm text-muted-foreground">Ensure all paperwork is complete and accurate</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brand-teal mt-1" />
                  <div>
                    <div className="font-medium">Pre-Qualified Property Database</div>
                    <div className="text-sm text-muted-foreground">Access verified replacement properties</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brand-teal mt-1" />
                  <div>
                    <div className="font-medium">Lender Network Access</div>
                    <div className="text-sm text-muted-foreground">Connect with 1031-experienced lenders</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button variant="brand" size="lg" className="w-full">
                  <Shield className="mr-2 h-5 w-5" />
                  Get My Protection Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QI Marketplace */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Qualified Intermediary Marketplace
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare and connect with vetted QIs in your area
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Provider</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Fee Structure</th>
                  <th className="text-left p-4">Specialization</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">
                    <div className="font-medium">Premier Exchange Corp</div>
                    <div className="text-sm text-muted-foreground">National coverage</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                      <span className="text-sm">4.9</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">$1,200</div>
                    <div className="text-sm text-muted-foreground">+ 0.25% of exchange</div>
                  </td>
                  <td className="p-4">Commercial & Residential</td>
                  <td className="p-4">
                    <Button variant="brand" size="sm">Get Quote</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <div className="font-medium">Exchange Solutions LLC</div>
                    <div className="text-sm text-muted-foreground">Regional specialist</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                         <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                      <span className="text-sm">4.8</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">$950</div>
                    <div className="text-sm text-muted-foreground">Flat fee</div>
                  </td>
                  <td className="p-4">Residential Focus</td>
                  <td className="p-4">
                    <Button variant="brand" size="sm">Get Quote</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <div className="font-medium">Capital Exchange Group</div>
                    <div className="text-sm text-muted-foreground">High-value specialist</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                      <span className="text-sm">4.7</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">$2,500</div>
                    <div className="text-sm text-muted-foreground">+ 0.15% of exchange</div>
                  </td>
                  <td className="p-4">Commercial & Industrial</td>
                  <td className="p-4">
                    <Button variant="brand" size="sm">Get Quote</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="pricing" className="py-16 bg-brand-pearl">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Choose Your Success Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to execute a perfect 1031 exchange
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$97</div>
                <CardDescription>Per exchange</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Tax Savings Calculator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Timeline Tracker</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Basic Education Hub</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Email Support</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-brand-teal relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-brand-teal text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <div className="text-3xl font-bold">$297</div>
                <CardDescription>Per exchange</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Everything in Starter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Property Matcher</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Success Predictor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">QI Marketplace Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Phone Support</span>
                  </div>
                </div>
                <Button variant="brand" className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">$597</div>
                <CardDescription>Per exchange</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Everything in Professional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Dedicated Account Manager</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Custom Strategy Session</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span className="text-sm">Advanced Analytics</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="font-bold">National 1031 Exchange Services</span>
              </div>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Helping real estate investors save millions in taxes through expert 1031 exchange guidance and tools.
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-brand-teal" />
                <span className="text-sm">Licensed & Bonded</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tools & Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-teal transition-colors">Tax Calculator</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Timeline Tracker</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Property Matcher</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Education Hub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-1031-HELP</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@1031exchange.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support Available</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Trust & Security</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-brand-teal" />
                  <span>$5M Insurance Coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-brand-teal" />
                  <span>A+ BBB Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-brand-teal" />
                  <span>99.2% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
            <p>© 2024 National 1031 Exchange Services. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
