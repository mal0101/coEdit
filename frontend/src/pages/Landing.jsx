import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
      <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-cyan-300">
              Real-time collaboration
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 mb-6">
            Collaborate on Documents
            <span className="block bg-linear-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            coEdit makes it easy to work together on documents with your team.
            See changes instantly, leave comments, and track version history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 relative">
          <div className="bg-linear-to-br from-cyan-500 to-teal-600 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-4 text-sm text-zinc-500">
                  Untitled Document - coEdit
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-cyan-500/20 rounded w-2/3 border-l-2 border-cyan-500"></div>
                <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500"></div>
                <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                <span className="text-xs text-zinc-500 ml-2">
                  3 collaborators editing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            Everything You Need to Collaborate
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Powerful features that make working together seamless and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
            title="Real-Time Editing"
            description="See changes as they happen. Multiple users can edit the same document simultaneously with instant synchronization."
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            title="Team Collaboration"
            description="Invite team members with different permission levels. Control who can view, edit, or manage your documents."
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
            title="Comments & Feedback"
            description="Leave comments on any part of the document. Discuss changes and provide feedback right where it matters."
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Version History"
            description="Never lose your work. Track all changes with complete version history and restore previous versions instantly."
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
            title="Secure & Private"
            description="Your documents are protected with industry-standard security. Control access with granular permissions."
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            title="Lightning Fast"
            description="Optimized for speed with instant saves and real-time updates. No lag, no waiting, just seamless editing."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-linear-to-br from-cyan-500 to-teal-600 py-20">
        <div className="absolute inset-0 bg-zinc-950/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Collaborating?
          </h2>
          <p className="text-xl text-cyan-100/80 mb-10 max-w-2xl mx-auto">
            Join thousands of teams already using coEdit to work together more
            effectively.
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-cyan-700 hover:bg-zinc-100 border-0"
              >
                Create Free Account
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-zinc-950 border-t border-zinc-800/30 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-3">
                coEdit
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Collaborate in real-time with your team on documents that matter.
              </p>
            </div>
            <div>
              <h4 className="text-zinc-100 font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#docs" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-100 font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">About</a></li>
                <li><a href="#privacy" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">Privacy</a></li>
                <li><a href="#terms" className="text-zinc-400 hover:text-cyan-400 transition-colors text-sm">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} coEdit. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
