import React, { useState } from 'react';
import {
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowUp,
  Star,
  Users,
  Globe,
  Shield,
  Zap,
  Award,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Code
} from 'lucide-react';

const DashboardFooter = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back to top button when scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/app/features', icon: <Zap className="w-4 h-4" /> },
        { name: 'AI Tools', href: '/app/ai-generator', icon: <Star className="w-4 h-4" /> },
        { name: 'Analytics', href: '/app/enhanced-analytics', icon: <TrendingUp className="w-4 h-4" /> },
        { name: 'Templates', href: '/app/smart-templates', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Integrations', href: '/app/integrations', icon: <Globe className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'API Reference', href: '/api-docs', icon: <Code className="w-4 h-4" /> },
        { name: 'Help Center', href: '/help', icon: <HelpCircle className="w-4 h-4" /> },
        { name: 'Community', href: '/community', icon: <Users className="w-4 h-4" /> },
        { name: 'Blog', href: '/blog', icon: <MessageSquare className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about', icon: <Award className="w-4 h-4" /> },
        { name: 'Careers', href: '/careers', icon: <Users className="w-4 h-4" /> },
        { name: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
        { name: 'Privacy Policy', href: '/privacy', icon: <Shield className="w-4 h-4" /> },
        { name: 'Terms of Service', href: '/terms', icon: <Shield className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Twitter', href: 'https://twitter.com/surveyguy', icon: <Twitter className="w-4 h-4" />, external: true },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/surveyguy', icon: <Linkedin className="w-4 h-4" />, external: true },
        { name: 'GitHub', href: 'https://github.com/surveyguy', icon: <Github className="w-4 h-4" />, external: true },
        { name: 'Email', href: 'mailto:infoajumapro@gmail.com', icon: <Mail className="w-4 h-4" /> },
        { name: 'Phone', href: 'tel:+1-555-SURVEY', icon: <Phone className="w-4 h-4" /> }
      ]
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: <Users className="w-5 h-5" /> },
    { label: 'Surveys Created', value: '1M+', icon: <Star className="w-5 h-5" /> },
    { label: 'Countries', value: '150+', icon: <Globe className="w-5 h-5" /> },
    { label: 'Uptime', value: '99.9%', icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Stats Section */}
        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SurveyGuy</h3>
                  <p className="text-sm text-slate-400">Advanced Survey Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                The most advanced survey and form platform with AI-powered insights, 
                real-time collaboration, and enterprise-grade security.
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : '_self'}
                        rel={link.external ? 'noopener noreferrer' : ''}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
                      >
                        {link.icon}
                        <span className="text-sm">{link.name}</span>
                        {link.external && (
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-blue-100 mb-6">
                Get the latest features, tips, and insights delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4 md:mb-0">
                <span>© 2024 SurveyGuy. All rights reserved.</span>
                <span>•</span>
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in San Francisco</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Globe className="w-4 h-4" />
                  <span>GDPR Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Award className="w-4 h-4" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default DashboardFooter;
