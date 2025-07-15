import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Calculator, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Mail, 
  CalendarDays,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Star,
  ArrowRight,
  PlayCircle,
  Zap,
  Building,
  HomeIcon,
  Wrench
} from 'lucide-react';

// Counter Animation Hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return [count, setIsVisible] as const;
};

// Counter Component
const AnimatedCounter = ({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) => {
  const [count, setIsVisible] = useCountUp(end);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [setIsVisible, end]);

  return (
    <span id={`counter-${end}`} className="font-bold text-2xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const Exchange1031 = () => {
  const [saleDate, setSaleDate] = useState('');
  const [userState, setUserState] = useState('California');
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Calculate days remaining for urgency banner
  useEffect(() => {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const days = Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 3600 * 24));
    setDaysRemaining(days);
  }, []);

  // Calculate timeline when sale date changes
  const calculateTimeline = () => {
    if (!saleDate) return null;
    
    const sale = new Date(saleDate);
    const identification = new Date(sale.getTime() + (45 * 24 * 60 * 60 * 1000));
    const completion = new Date(sale.getTime() + (180 * 24 * 60 * 60 * 1000));
    
    return {
      identification: identification.toLocaleDateString(),
      completion: completion.toLocaleDateString(),
      daysLeft: Math.ceil((identification.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    };
  };

  const timeline = calculateTimeline();

  const horrorStories = [
    {
      title: "The 45-Day Email That Cost $2.3M",
      description: "A Seattle investor thought he sent the identification letter but it went to spam. IRS rejected his exchange.",
      loss: "$2.3M"
    },
    {
      title: "How a Typo Triggered $890K in Taxes",
      description: "One wrong digit in a property address invalidated the entire exchange. The correction came too late.",
      loss: "$890K"
    },
    {
      title: "The Related Party Rule Disaster",
      description: "A family business exchange was disqualified due to a hidden relationship between buyer and seller.",
      loss: "$1.2M"
    }
  ];

  const services = [
    {
      title: "Delayed Exchange",
      subtitle: "Sell First, Buy Later",
      description: "The most common 1031 exchange. Sell your property first, then have 45 days to identify and 180 days to close on replacement property.",
      price: "Starting at $1,250",
      icon: <Clock className="w-8 h-8 text-[#00A86B]" />
    },
    {
      title: "Reverse Exchange",
      subtitle: "Buy First, Sell Later",
      description: "Purchase your replacement property first, then sell your relinquished property. Perfect for competitive markets.",
      price: "Starting at $3,500",
      icon: <TrendingUp className="w-8 h-8 text-[#00A86B]" />
    },
    {
      title: "Improvement Exchange",
      subtitle: "Renovate Tax-Free",
      description: "Use exchange proceeds to improve your replacement property. Add value while deferring taxes.",
      price: "Starting at $2,500",
      icon: <Wrench className="w-8 h-8 text-[#00A86B]" />
    }
  ];

  const statCards = [
    { number: "45", unit: "Days", description: "Strict identification deadline" },
    { number: "180", unit: "Days", description: "Exchange completion deadline" },
    { number: "0", unit: "Extensions", description: "Allowed by IRS" },
    { number: "200+", unit: "Rules", description: "Federal rules governing exchanges" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-50 bg-[#003366] text-white px-4 py-2 md:hidden">
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">The 1031 Center</span>
          <a href="tel:8555551031" className="flex items-center gap-2 bg-[#00A86B] px-3 py-1 rounded-full text-sm">
            <Phone className="w-4 h-4" />
            (855) 555-1031
          </a>
        </div>
      </header>

      {/* Urgency Banner */}
      <div className="bg-[#FF6B35] text-white py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">
            ⚠️ Property closed recently? You have {daysRemaining} days remaining to identify
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003366] to-[#004080] text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Save $100,000+ in Taxes<br />
              <span className="text-[#00A86B]">with Zero IRS Risk</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
              We've Protected $2.3 Billion in 1031 Exchanges. Your Deal Closes in{' '}
              <span className="text-[#FF6B35] font-bold">{daysRemaining}</span> Days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-[#00A86B] hover:bg-[#008A5A] text-white px-8 py-6 text-lg">
                Start My Exchange
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#003366] px-8 py-6 text-lg">
                Calculate My Timeline →
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-gray-400">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00A86B]">
                  <AnimatedCounter end={15247} suffix="" />
                </div>
                <div className="text-sm text-gray-300">Successful Exchanges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00A86B]">
                  <AnimatedCounter end={0} suffix="" />
                </div>
                <div className="text-sm text-gray-300">Failed Exchanges</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#00A86B]">FEA</div>
                <div className="text-sm text-gray-300">Certified QI</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#00A86B]">Same-Day</div>
                <div className="text-sm text-gray-300">Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complexity Showcase Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Why Professional QI Services Protect Your Exchange
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              1031 exchanges involve complex federal regulations with strict deadlines. One mistake can cost you hundreds of thousands in taxes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <Card key={index} className="text-center p-6 border-2 border-gray-200 hover:border-[#00A86B] transition-colors">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-[#003366] mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-[#FF6B35] mb-1">{stat.unit}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <h3 className="text-lg font-bold text-red-800 mb-3">Real Consequences of Errors</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Entire exchange disqualified - pay all capital gains taxes immediately</li>
              <li>• Depreciation recapture penalties up to 25%</li>
              <li>• State taxes and additional penalties</li>
              <li>• No second chances - IRS rules are absolute</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-[#00A86B] mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Timeline Calculator</h3>
              <p className="text-gray-600 text-sm">Never miss critical deadlines</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <AlertTriangle className="w-12 h-12 text-[#FF6B35] mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Tax Trap Detector</h3>
              <p className="text-gray-600 text-sm">Identify potential disqualifiers</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Calculator className="w-12 h-12 text-[#003366] mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Boot Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate taxable boot amounts</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Choose Your Exchange Type
            </h2>
            <p className="text-gray-600 text-lg">
              Different situations require different strategies. We handle all types of 1031 exchanges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-[#003366]">{service.title}</CardTitle>
                  <CardDescription className="text-[#00A86B] font-semibold">{service.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="text-2xl font-bold text-[#003366] mb-4">{service.price}</div>
                  <Button className="w-full bg-[#00A86B] hover:bg-[#008A5A] text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Horror Story Carousel */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Learn From Their $2.3M+ Mistakes
            </h2>
            <p className="text-gray-600 text-lg">
              Real stories from investors who tried to handle their 1031 exchange without professional help
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {horrorStories.map((story, index) => (
              <Card key={index} className="min-w-[300px] md:min-w-[400px] bg-white border-l-4 border-red-400">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Loss: {story.loss}
                    </Badge>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <CardTitle className="text-lg text-[#003366]">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{story.description}</p>
                  <Button variant="outline" className="w-full border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B] hover:text-white">
                    Read Story →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">By The Numbers</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#00A86B]">
                    <AnimatedCounter end={2.3} suffix="B" prefix="$" />
                  </div>
                  <div className="text-gray-600">in exchanges protected</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#00A86B]">
                    <AnimatedCounter end={15247} />
                  </div>
                  <div className="text-gray-600">successful exchanges</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#00A86B]">
                    <AnimatedCounter end={99.9} suffix="%" />
                  </div>
                  <div className="text-gray-600">success rate</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#00A86B]">
                    <AnimatedCounter end={24} />
                  </div>
                  <div className="text-gray-600">years in business</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">Credentials</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-[#00A86B] mx-auto mb-3" />
                  <div className="font-bold text-[#003366]">FEA Certified</div>
                  <div className="text-sm text-gray-600">Qualified Intermediary</div>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-[#00A86B] mx-auto mb-3" />
                  <div className="font-bold text-[#003366]">BBB A+</div>
                  <div className="text-sm text-gray-600">Accredited Business</div>
                </div>
                <div className="text-center">
                  <Shield className="w-12 h-12 text-[#00A86B] mx-auto mb-3" />
                  <div className="font-bold text-[#003366]">SSL Secured</div>
                  <div className="text-sm text-gray-600">Bank-Level Security</div>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-[#00A86B] mx-auto mb-3" />
                  <div className="font-bold text-[#003366]">Insured</div>
                  <div className="text-sm text-gray-600">$10M+ Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Interactive Timeline Calculator
            </h2>
            <p className="text-gray-600 text-lg">
              Enter your sale date to see your critical deadlines
            </p>
          </div>

          <Card className="p-8 bg-white">
            <div className="space-y-6">
              <div>
                <Label htmlFor="saleDate" className="text-lg font-semibold text-[#003366]">
                  Your Sale Date
                </Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>

              {timeline && (
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-[#FFF5F5] rounded-lg border-2 border-[#FF6B35]">
                      <CalendarDays className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
                      <div className="text-sm text-gray-600">45-Day Identification Deadline</div>
                      <div className="text-xl font-bold text-[#FF6B35]">{timeline.identification}</div>
                    </div>
                    <div className="text-center p-4 bg-[#F0F9FF] rounded-lg border-2 border-[#00A86B]">
                      <CheckCircle className="w-8 h-8 text-[#00A86B] mx-auto mb-2" />
                      <div className="text-sm text-gray-600">180-Day Completion Deadline</div>
                      <div className="text-xl font-bold text-[#00A86B]">{timeline.completion}</div>
                    </div>
                  </div>
                  
                  {timeline.daysLeft < 40 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <strong>Warning:</strong> Only {timeline.daysLeft} days remaining for identification!
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mt-6">
                    <Button size="lg" className="bg-[#00A86B] hover:bg-[#008A5A] text-white">
                      Get Full Timeline Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* State-Specific Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              {userState} 1031 Exchange Rules
            </h2>
            <p className="text-gray-600 text-lg">
              State-specific requirements and tax implications for your exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-[#FF6B35] mb-2">13.3%</div>
              <div className="text-sm text-gray-600">State Capital Gains Tax</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-[#00A86B] mb-2">No</div>
              <div className="text-sm text-gray-600">Additional State Requirements</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-[#003366] mb-2">Same</div>
              <div className="text-sm text-gray-600">Federal Deadlines Apply</div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-[#00A86B] hover:bg-[#008A5A] text-white">
              Get {userState} Exchange Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-[#003366] text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Save $100,000+ in Taxes?
            </h2>
            <p className="text-xl text-gray-300">
              Get started with your 1031 exchange today. Expert guidance every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <a href="tel:8555551031" className="flex items-center gap-3 p-4 bg-[#00A86B] hover:bg-[#008A5A] rounded-lg transition-colors">
              <Phone className="w-6 h-6" />
              <div>
                <div className="font-semibold">Call Now</div>
                <div className="text-sm opacity-90">(855) 555-1031</div>
              </div>
            </a>
            
            <button className="flex items-center gap-3 p-4 bg-[#FF6B35] hover:bg-[#E55A2B] rounded-lg transition-colors">
              <MessageCircle className="w-6 h-6" />
              <div>
                <div className="font-semibold">Live Chat</div>
                <div className="text-sm opacity-90">Available 24/7</div>
              </div>
            </button>
            
            <a href="mailto:info@1031center.com" className="flex items-center gap-3 p-4 bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg transition-colors">
              <Mail className="w-6 h-6" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm opacity-90">30-sec response</div>
              </div>
            </a>
            
            <button className="flex items-center gap-3 p-4 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors">
              <Calendar className="w-6 h-6" />
              <div>
                <div className="font-semibold">Schedule</div>
                <div className="text-sm opacity-90">Free consultation</div>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 The 1031 Center. All rights reserved. | Licensed Qualified Intermediary</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Exchange1031;