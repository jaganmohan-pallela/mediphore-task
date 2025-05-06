import Image from "next/image";
import { Shield, BarChart2, Heart } from "lucide-react";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-8 flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="wave-bg"></div>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-4">
          {/* <Image
            src="/mediphore_logo.png"
            alt="Mediphore"
            width={140}
            height={36}
            className="mb-2 bg-gray-700"
          /> */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Care Made <span className="text-indigo-600">Simple</span>
          </h1>
          <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
            Helping you focus on patients with tools that are easy to use and secure.
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="relative z-10 space-y-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          What We Offer
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-gray-900 font-medium text-sm">Safe & Secure</p>
              <p className="text-xs text-gray-500">Your data is protected with top-notch security.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart2 className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-gray-900 font-medium text-sm">Clear Insights</p>
              <p className="text-xs text-gray-500">Understand your work with real-time data.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-gray-900 font-medium text-sm">Patient Focus</p>
              <p className="text-xs text-gray-500">Tools to care for patients, step by step.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs text-gray-400">
          Made with care by Mediphore, 2025.
        </p>
      </div>
    </div>
  );
}