'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskApi } from '@/lib/api';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/lib/types';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface TaskFormProps {
  todoAppId: string;
  task?: Task;
}

export function TaskForm({ todoAppId, task }: TaskFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    status: task?.status || 'stale',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
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
      if (task) {
        const payload: UpdateTaskPayload = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority as Task['priority'],
          dueDate: formData.dueDate || undefined,
        };
        await taskApi.update(task._id, payload);
      } else {
        const payload: CreateTaskPayload = {
          title: formData.title,
          description: formData.description,
          todoAppId,
          status: formData.status as Task['status'],
          priority: formData.priority as Task['priority'],
          dueDate: formData.dueDate || undefined,
        };
        await taskApi.create(payload);
      }
      router.push(`/todo-app/${todoAppId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'stale': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <CardHeader className="relative overflow-hidden">
          {/* Header Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-white text-2xl font-bold transform -rotate-3">
                {task ? '✏️' : '✨'}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {task ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-gray-600 font-medium">
                {task ? 'Update your task details below' : 'Bring your ideas to life'}
              </p>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-8 p-8">
            {error && (
              <div className="relative p-5 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 shadow-lg">
                <div className="absolute inset-0 bg-red-100/30 rounded-2xl blur-xl"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">!</div>
                  <span className="text-red-700 font-semibold text-lg">{error}</span>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-gray-800 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">T</div>
                <span>Task Title</span>
                <span className="text-red-500 text-xl">*</span>
              </label>
              <div className="relative">
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your task title..."
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-lg placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 shadow-sm hover:shadow-md"
                  required
                />
                {formErrors.title && (
                  <div className="absolute -bottom-8 left-0 flex items-center space-x-2 text-red-600 font-medium">
                    <span className="text-lg">❌</span>
                    <span>{formErrors.title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-gray-800 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">D</div>
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add some details about your task..."
                rows={4}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-lg placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-gray-300 shadow-sm hover:shadow-md resize-none"
              />
            </div>

            {/* Priority Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-gray-800 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">P</div>
                <span>Priority Level</span>
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 hover:border-gray-300 shadow-sm hover:shadow-md appearance-none cursor-pointer font-medium"
                >
                  <option value="low" className="py-3">🟢 Low Priority</option>
                  <option value="medium" className="py-3">🟡 Medium Priority</option>
                  <option value="high" className="py-3">🔴 High Priority</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {/* Priority indicator */}
                <div className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                  formData.priority === 'high' ? 'bg-red-500' : 
                  formData.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                } shadow-sm`}></div>
              </div>
            </div>

            {/* Due Date Field */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-gray-800 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">📅</div>
                <span>Due Date</span>
              </label>
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 hover:border-gray-300 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Status Field (only for new tasks) */}
            {!task && (
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-gray-800 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">S</div>
                  <span>Initial Status</span>
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-300 shadow-sm hover:shadow-md appearance-none cursor-pointer font-medium"
                  >
                    <option value="stale" className="py-3">📋 Stale</option>
                    <option value="in-progress" className="py-3">⚡ In Progress</option>
                    <option value="completed" className="py-3">✅ Completed</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {/* Status indicator */}
                  <div className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                    formData.status === 'completed' ? 'bg-emerald-500' : 
                    formData.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-400'
                  } shadow-sm`}></div>
                </div>
              </div>
            )}
          </CardBody>

          <CardFooter className="bg-gradient-to-r from-gray-50/80 via-blue-50/40 to-purple-50/30 p-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                type="button"
                onClick={() => router.push(`/todo-app/${todoAppId}`)}
                className="flex-1 sm:flex-none px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 rounded-2xl text-gray-700 font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  <span>Cancel</span>
                </span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">{task ? '✏️' : '✨'}</span>
                      <span>{task ? 'Update Task' : 'Create Task'}</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Status Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-gray-700 font-medium">
            {task ? 'Editing existing task' : 'Creating new task'}
          </span>
        </div>
      </div>
    </div>
  );
}