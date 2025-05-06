import Image from "next/image";
import { CheckCircle, LineChart, HeartPulse } from "lucide-react";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-blue-900 to-blue-950 p-8 flex-col justify-between relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/5 opacity-20"></div>
      
      {/* Subtle accent elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div className="mb-6">
          <Image
            src="/mediphore-logo-white.svg" 
            alt="Mediphore"
            width={180}
            height={48}
            className="mb-2"
          />
          <p className="text-blue-200 text-sm">Healthcare Management Portal</p>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Streamline Your <br />
            <span className="text-cyan-300">Healthcare Operations</span>
          </h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Access your comprehensive dashboard and manage patient care, clinical workflows, and administrative tasks in one secure platform.
          </p>
        </div>
      </div>
      
      {/* Features list */}
      <div className="relative z-10 py-8">
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-4">
          Platform Benefits
        </h3>
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-medium mb-1">HIPAA Compliant Security</p>
              <p className="text-sm text-slate-300">End-to-end encryption with enterprise-grade protection</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <LineChart className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-medium mb-1">Clinical Analytics</p>
              <p className="text-sm text-slate-300">Real-time insights for improved patient outcomes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HeartPulse className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-medium mb-1">Patient-Centered Care</p>
              <p className="text-sm text-slate-300">Comprehensive tools for managing patient journeys</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 mt-6">
        <p className="text-xs text-slate-400">
          © 2025 Mediphore Health Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
}