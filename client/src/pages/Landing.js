import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {
  BarChart3,
  Users,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
  TrendingUp,
  MessageSquare,
  FileText,
  PieChart,
  Globe,
  Smartphone,
  Database,
  Lock,
  Clock,
  Target,
  Sparkles,
  QrCode,
  CreditCard,
  Calendar,
  Share2,
  Download,
  Eye,
  Brain,
  Palette,
  Activity,
  DollarSign,
  Mail,
  Settings,
  Bell
} from 'lucide-react';
const Landing = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Messages",
      description: "Create custom QR codes that reveal thank you messages, appointments, or special offers when scanned."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Real-time analytics with pie charts, demographics, response trends, and detailed insights."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Processing",
      description: "Seamless payment processing for subscriptions, billing, and payment methods."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Management",
      description: "Create and manage events with registration forms, attendee tracking, and event analytics."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Features",
      description: "Smart survey suggestions, automated insights, and intelligent question recommendations."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Multi-Channel Sharing",
      description: "Share surveys via email, social media, QR codes, and embed them anywhere."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Reports",
      description: "Export data to PDF, Excel, CSV with beautiful charts and professional reports."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with data encryption, GDPR compliance, and secure hosting."
    }
  ];
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "The QR code messages feature is a game-changer! Our customers love scanning codes to get personalized thank you messages.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Research Lead",
      company: "UniResearch",
      content: "The advanced analytics with pie charts and demographics give us insights we never had before. Amazing platform!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "StartupXYZ",
      content: "The payment processing integration made our billing seamless. The system is smooth and professional.",
      rating: 5
    }
  ];
  const stats = [
    { number: "50K+", label: "Surveys Created" },
    { number: "2M+", label: "Responses Collected" },
    { number: "10K+", label: "QR Codes Generated" },
    { number: "98%", label: "Customer Satisfaction" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SurveyGuy</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => {
                  try {
                    navigate('/app/templates');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/app/templates';
                  }
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Templates
              </button>
              <button
                onClick={() => {
                  try {
                    navigate('/pricing');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/pricing';
                  }
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  try {
                    navigate('/register');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/register';
                  }
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  console.log('Sign In clicked - navigating to /login');
                  try {
                    navigate('/login');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/login';
                  }
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  console.log('Get Started clicked - navigating to /register');
                  try {
                    navigate('/register');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/register';
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The Complete Survey Platform with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> QR Codes & Analytics</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create surveys, generate QR codes, manage payments, and get real-time analytics. 
                The most advanced platform with payment processing, event management, and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    console.log('Start Creating Free clicked - navigating to /register');
                    try {
                      navigate('/register');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/register';
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center group"
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    try {
                      navigate('/app/templates');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/app/templates';
                    }
                  }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition-all duration-200 font-semibold text-lg flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">Join 10,000+ users</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-1">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Survey Demo */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">Customer Satisfaction Survey</h3>
                    <p className="text-sm opacity-90">How satisfied are you with our service?</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Very Satisfied</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-700">Satisfied</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-700">Neutral</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Question 1 of 5</span>
                      <span>2 min remaining</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Demo */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <QrCode className="w-5 h-5 mr-2" />
                      QR Message
                    </h3>
                    <p className="text-sm opacity-90">Thank you for your feedback!</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Scan to reveal message</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>0 scans</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Survey Platform with Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From QR code messages to advanced analytics, event management to AI-powered insights - everything you need in one platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* New Features Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Latest Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the newest additions to SurveyGuy that make survey creation and management even more powerful.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* QR Messages Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">QR Code Messages</h3>
              <p className="text-gray-600 mb-6">
                Create custom QR codes that reveal thank you messages, appointment confirmations, or special offers when customers scan them.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <span>New Feature</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>

            {/* Payment Processing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600 mb-6">
                Seamless payment processing for subscriptions, billing, and payment methods with enterprise-grade security.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Payment Ready</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>

            {/* Advanced Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <PieChart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 mb-6">
                Real-time analytics with pie charts, demographics, response trends, and detailed insights to understand your data better.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Data Insights</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Templates Preview Section */}
      <section id="templates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Templates for Every Use Case
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from hundreds of pre-built templates designed by experts for various industries and purposes.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Customer Satisfaction", icon: <MessageSquare />, color: "from-blue-500 to-blue-600" },
              { title: "QR Code Messages", icon: <QrCode />, color: "from-green-500 to-green-600" },
              { title: "Event Registration", icon: <Calendar />, color: "from-purple-500 to-purple-600" },
              { title: "Payment Forms", icon: <CreditCard />, color: "from-indigo-500 to-indigo-600" },
              { title: "Analytics Dashboard", icon: <BarChart3 />, color: "from-pink-500 to-pink-600" },
              { title: "AI-Powered Surveys", icon: <Brain />, color: "from-orange-500 to-orange-600" }
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  try {
                    navigate('/app/templates');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/app/templates';
                  }
                }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {template.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-gray-600 text-sm mb-4">Professional templates designed for optimal response rates.</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  View Templates
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => {
                try {
                  navigate('/app/templates');
                } catch (error) {
                  console.error('Navigation error:', error);
                  window.location.href = '/app/templates';
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg"
            >
              Browse All Templates
            </button>
          </motion.div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with SurveyGuy.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Experience the Future of Surveys?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SurveyGuy for surveys, QR codes, analytics, and event management. 
              Start creating with our advanced platform today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  try {
                    navigate('/register');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/register';
                  }
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => {
                  try {
                    navigate('/pricing');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    window.location.href = '/pricing';
                  }
                }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
              >
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SurveyGuy</span>
              </div>
              <p className="text-gray-400">
                The complete survey platform with QR codes, analytics, event management, and payment processing for businesses, researchers, and educators.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/app/templates');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/app/templates';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/pricing');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/pricing';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    API
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      try {
                        navigate('/register');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        window.location.href = '/register';
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SurveyGuy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Landing; 