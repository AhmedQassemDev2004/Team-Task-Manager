"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Menu,
  X,
  Shield,
  Calendar,
  MessageSquare,
  List,
  Bell,
  Target,
  ArrowUpRight,
  Sparkles,
  Star,
  Zap,
  Check,
  BarChart,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Function to determine active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const features = document.getElementById("features");
      const howItWorks = document.getElementById("how-it-works");

      const scrollPosition = window.scrollY + window.innerHeight / 3; // Adjust for better accuracy

      if (hero && scrollPosition < hero.offsetHeight) {
        setActiveSection("hero");
      } else if (features && scrollPosition < features.offsetTop + features.offsetHeight) {
        setActiveSection("features");
      } else if (howItWorks && scrollPosition < howItWorks.offsetTop + howItWorks.offsetHeight) {
        setActiveSection("how-it-works");
      } else {
        setActiveSection(""); // No specific section active or scrolled past all
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <List className="w-6 h-6 text-indigo-500" />,
      title: "Intelligent Task Management",
      description: "Streamline your workflow with task organization and prioritization.",
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      title: "Seamless Collaboration",
      description: "Connect and work together effortlessly with real-time updates and communication tools.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-indigo-500" />,
      title: "Smart Scheduling",
      description: "Effortlessly manage timelines and deadlines with automated reminders and smart suggestions.",
    },
    {
      icon: <BarChart className="w-6 h-6 text-indigo-500" />,
      title: "Insightful Analytics",
      description: "Make data-driven decisions with powerful, easy-to-understand insights into your team's performance.",
    },
  ];

  const NavLink = ({ href, children, sectionId }) => {
    const isActive = activeSection === sectionId;
    return (
      <a
        href={href}
        onClick={() => setIsMenuOpen(false)}
        className={`relative text-gray-600 hover:text-indigo-600 transition-colors py-2 md:py-0 ${
          isActive ? "font-semibold text-indigo-600" : ""
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full md:block hidden transform scale-x-0 origin-left animate-grow-x"></span>
        )}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="pattern-dots pattern-indigo-200 pattern-size-4 opacity-50 absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-lg border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskMaster<span className="text-indigo-700">.</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features" sectionId="features">Features</NavLink>
              <NavLink href="#how-it-works" sectionId="how-it-works">How it Works</NavLink>
              <a href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Login</a>
              <a href="/register">
                <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-2 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                  Get Started
                </button>
              </a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-16 animate-fade-in-down">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavLink href="#features" sectionId="features">Features</NavLink>
            <NavLink href="#how-it-works" sectionId="how-it-works">How it Works</NavLink>
            <a href="/login" className="block text-gray-600 hover:text-indigo-600 py-2">Login</a>
            <a href="/register" className="block mt-4">
              <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 py-3 text-white rounded-full font-medium shadow-md">
                Get Started
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="moving-grid-background pt-40 pb-24 min-h-screen flex items-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-white rounded-full shadow-lg border border-indigo-100 transform -rotate-1 hover:rotate-0 transition-transform duration-300 ease-out animate-fade-in delay-100">
            <Sparkles className="w-4 h-4 text-indigo-600 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-gray-800">Welcome to TaskMaster</span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 leading-tight animate-fade-in-up delay-200">
            Revolutionize Your Team's Productivity.
            <br className="hidden md:inline" /> The Future of Work is Here.
          </h1>
          <p className="text-xl sm:text-2xl mb-12 text-gray-700 max-w-3xl mx-auto animate-fade-in-up delay-300">
            Experience seamless team collaboration with our intelligent task management platform.
            Built for modern teams who value efficiency, simplicity, and powerful insights.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up delay-400">
            <a href="/register">
              <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-10 py-5 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-indigo-600/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                Start Free
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </a>
            <a href="#features">
              <button className="px-10 py-5 text-indigo-700 rounded-full font-semibold text-lg hover:bg-indigo-50 border border-indigo-200 transition-colors hover:shadow-md">
                Learn More
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </a>
          </div>
          {/* Placeholder for a hero image/illustration */}
          <div className="mt-20 max-w-5xl mx-auto animate-fade-in-up delay-500">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
              <img
                src="/hero.png"
                alt="TaskMaster Product Dashboard"
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-indigo-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 mb-4">
              Powerful Features for Peak Productivity
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to manage your team's tasks efficiently, collaborate seamlessly, and gain valuable insights.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-indigo-50 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-500/[0.05] to-indigo-600/[0.05] rounded-3xl p-12 shadow-inner border border-indigo-100">
            <div className="text-center">
              <span className="text-md font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">Getting Started is Simple</span>
              <h2 className="mt-4 text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mb-12">
                Three Simple Steps to Get Started
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Create Your Account",
                    description: "Sign up in minutes. No credit card is required to begin your Free.",
                  },
                  {
                    step: "2",
                    title: "Invite Your Team",
                    description: "Easily add your team members and assign roles to get everyone on board.",
                  },
                  {
                    step: "3",
                    title: "Start Managing Tasks",
                    description: "Instantly begin organizing projects, assigning tasks, and tracking progress.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl relative group shadow-md hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-base">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-10 text-indigo-100 max-w-2xl mx-auto">
            Join thousands of productive teams already using TaskMaster to achieve their goals with ease and efficiency.
          </p>
          <a href="/register">
            <button className="bg-white text-indigo-700 px-10 py-5 rounded-full font-semibold text-lg shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
              Start Free Today!
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </a>
          <p className="mt-8 text-sm text-indigo-200">No credit card required &middot; Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-indigo-100 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskMaster<span className="text-indigo-700">.</span>
            </span>
            <p className="mt-4 text-sm text-gray-500">© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes grow-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }

        .animate-pulse {
            animation: pulse 2s infinite;
        }

        .animate-grow-x {
            animation: grow-x 0.3s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Added styles for the background pattern */}
      <style jsx global>{`
        @keyframes moveGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }

        .moving-grid-background {
          background-color: rgb(251, 251, 255); /* Base color for the grid background */
          background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.08) 2px,
            transparent 2.5px
          );
          background-size: 40px 40px;
          animation: moveGrid 5s linear infinite;
        }

        /* --- Tailwind CSS Background Pattern (Requires tailwind.config.js setup) --- */
        /* To use this, you would typically configure 'tailwindcss-bg-patterns' plugin in your tailwind.config.js */
        /* For this example, I'm providing a direct CSS equivalent that you can copy to your global CSS if you don't use the plugin. */
        /* If using the plugin, uncomment the classes like 'pattern-dots pattern-indigo-200 pattern-size-4' */

        /* Fallback for the background pattern if plugin isn't configured, or direct implementation */
        .pattern-dots {
            background-image: radial-gradient(
              circle,
              var(--pattern-color, #e0e7ff) 1px, /* indigo-200 equivalent */
              transparent 1px
            );
            background-size: var(--pattern-size, 1rem) var(--pattern-size, 1rem); /* size-4 equivalent */
        }
        .pattern-indigo-200 {
            --pattern-color: #e0e7ff;
        }
        .pattern-size-4 {
            --pattern-size: 1rem; /* 16px */
        }
      `}</style>
    </div>
  );
}
