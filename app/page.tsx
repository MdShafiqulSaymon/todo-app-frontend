"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLinkClick = () => {
    setLoading(true);
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20"></div>
              <Spinner className="relative h-16 w-16 text-blue-600" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading todo app...
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex items-center">
          <div className="w-full text-center">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Now with real-time collaboration
              </div>

              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                Collaborative
                <br />
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  ToDo Application
                </span>
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                Transform the way your team manages tasks. Create dynamic todo
                lists, assign responsibilities, track progress in real-time, and
                supercharge your productivity with seamless collaboration.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/60 backdrop-blur-lg rounded-3xl p-6 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-semibold mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 text-sm">
                  Work together seamlessly with real-time updates and shared
                  workspaces
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50/60 via-transparent to-blue-50/60 backdrop-blur-lg rounded-3xl p-6 border border-cyan-200/30 hover:border-cyan-300/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-semibold mb-2">
                  Progress Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor task completion with intuitive dashboards and
                  analytics
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/60 via-transparent to-green-50/60 backdrop-blur-lg rounded-3xl p-6 border border-emerald-200/30 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-gray-800 font-semibold mb-2">
                  Boost Productivity
                </h3>
                <p className="text-gray-600 text-sm">
                  Streamline workflows and eliminate bottlenecks with smart
                  automation
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                onClick={handleLinkClick}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href="/auth/login"
                onClick={handleLinkClick}
                className="group px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border border-gray-200/50 hover:bg-white hover:border-gray-300 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center">
                  Sign In
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16">
              <p className="text-gray-500 text-sm mb-6">
                Trusted by teams worldwide
              </p>
              <div className="flex justify-center items-center space-x-8 opacity-70">
                <div className="text-gray-600 font-semibold">10K+ Teams</div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="text-gray-600 font-semibold">99.9% Uptime</div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="text-gray-600 font-semibold">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}