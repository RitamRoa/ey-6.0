import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, Database } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">System Operational</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                NeuroGrid
              </span>
              <span className="text-indigo-500">.</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              The self-healing provider directory. Automated verification, conflict resolution, and risk scoring for modern healthcare networks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/dashboard"
                className="inline-flex justify-center items-center px-8 py-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Launch Dashboard
                <Activity className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://github.com/RitamRoa/ey-6.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-8 py-4 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200 text-white font-medium"
              >
                View Source
              </a>
            </div>
          </div>

          {/* Right Visuals (Feature Grid) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 opacity-90">
            <div className="space-y-4 mt-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <Shield className="h-8 w-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold text-white">Risk Scoring</h3>
                <p className="text-sm text-gray-400 mt-2">Predictive analytics to identify outdated provider data before it impacts care.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <Database className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white">TruthLens™</h3>
                <p className="text-sm text-gray-400 mt-2">AI-driven conflict resolution for multi-source data discrepancies.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <Zap className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="text-lg font-semibold text-white">Instant Sync</h3>
                <p className="text-sm text-gray-400 mt-2">Real-time updates across your entire provider network infrastructure.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
