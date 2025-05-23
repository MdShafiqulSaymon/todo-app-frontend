"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { todoAppApi } from "@/lib/api";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function NewTodoAppPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newTodoApp = await todoAppApi.create(formData);
      router.push(`/todo-app/${newTodoApp._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create todo app");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Static Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50 text-purple-700 text-sm font-medium mb-6">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Workspace
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Build Your Todo App
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set up your collaborative workspace and start organizing tasks with
            your team. Choose a memorable name and describe your project goals.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Workspace Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Configure your new todo application
                  </p>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardBody className="space-y-6">
                {error && (
                  <div className="relative p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Workspace Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        placeholder="e.g. Marketing Team Tasks, Product Roadmap..."
                        className="pl-12 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                      <span className="text-gray-400 font-normal ml-1">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what this workspace will be used for..."
                        className="pl-12 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Preview */}
                <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-xl p-6 border border-gray-200/50">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
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
                    What you'll get:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Real-time collaboration
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Task assignment & tracking
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Progress visualization
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Team notifications
                    </div>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Dashboard
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-5 w-5 mr-2" />
                      Creating Workspace...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Todo App
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Need help getting started?
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <a
                href="#"
                className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Quick Start Guide
              </a>
              <a
                href="#"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
