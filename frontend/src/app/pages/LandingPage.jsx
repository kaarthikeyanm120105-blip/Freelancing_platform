import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Target,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Job Matching',
      description: 'Get matched with jobs based on your skills and career goals',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Escrow',
      description: 'Safe payment system protecting both students and clients',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Skill Growth Tracking',
      description: 'Monitor your employability score and career progression',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Verified Skills',
      description: 'Showcase certified skills and portfolio projects',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Learning Recommendations',
      description: 'AI-powered course suggestions to fill skill gaps',
    },
  ];

  const stats = [
    { value: '2,800+', label: 'Active Freelancers' },
    { value: '700+', label: 'Trusted Clients' },
    { value: '1,200+', label: 'Jobs Completed' },
    { value: '$890K+', label: 'Total Earnings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 flex items-center whitespace-nowrap">
                  <span className="shrink-0">TVK</span>
                  <span className="max-w-0 overflow-hidden group-hover:max-w-[300px] transition-all duration-700 ease-in-out">
                    <span className="pl-1 text-sm italic text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium">
                      - Talent Venture Konnect
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            <Globe className="w-3 h-3 mr-1" />
            Supporting SDG 8: Decent Work & Economic Growth
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Launch Your Freelance Career While Studying
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with clients, build your portfolio, and earn while you learn.
            AI-powered platform helping freelancers find freelance opportunities matched to their skills.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Join
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-2">
                <Briefcase className="mr-2 h-5 w-5" />
                Hire Top Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center border-2 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600">
            Professional tools and features designed for Talent Venture Konnect (TVK)
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Start earning in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Profile', description: 'Sign up and showcase your skills and portfolio' },
              { step: '2', title: 'Get Matched', description: 'AI finds jobs that match your expertise' },
              { step: '3', title: 'Apply & Work', description: 'Submit proposals and complete projects' },
              { step: '4', title: 'Get Paid', description: 'Receive secure payments via escrow system' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              For Freelancers
            </Badge>
            <h2 className="text-3xl font-bold mb-6">
              Build Your Career While Studying
            </h2>
            <div className="space-y-4">
              {[
                'Gain real-world experience with professional projects',
                'Build an impressive portfolio to showcase to employers',
                'Earn money to support your education',
                'Track your employability score and skill growth',
                'Get personalized learning recommendations',
                'Access verified certifications and badges',
              ].map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              For Clients
            </Badge>
            <h2 className="text-3xl font-bold mb-6">
              Find Talented, Affordable Freelancers
            </h2>
            <div className="space-y-4">
              {[
                'Access a pool of motivated, skilled freelancers',
                'Cost-effective solutions for your projects',
                'Secure escrow payment system',
                'Quality work from verified freelancers',
                'Support the next generation of professionals',
              ].map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Freelance Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of freelancers earning while building their careers
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-white transition-all duration-300 flex items-center whitespace-nowrap">
                    <span className="shrink-0">TVK</span>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-[300px] transition-all duration-700 ease-in-out">
                      <span className="pl-1 text-xs italic text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        - Talent Venture Konnect
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-sm">
                Empowering freelancers with freelance opportunities and supporting SDG 8.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Trust & Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2026 Talent Venture Konnect (TVK). Supporting Sustainable Development Goal 8.
          </div>
        </div>
      </footer>
    </div>
  );
}





