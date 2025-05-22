'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { todoAppApi } from '@/lib/api';
import { TodoApp } from '@/lib/types';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { PlusIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const [todoApps, setTodoApps] = useState<TodoApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodoApps = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await todoAppApi.getAll();
        setTodoApps(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load todo apps');
      } finally {
        setLoading(false);
      }
    };
    fetchTodoApps();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Spinner className="relative h-16 w-16 text-blue-600" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
     
      
      <div className="relative">
        <DashboardHeader title="Your Todo Apps" actionLabel="New Todo App" actionHref="/todo-app/new" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {todoApps.length === 0 ? (
            <EmptyState
              title="No Todo Apps"
              description="Get started by creating a new todo app."
              icon={<PlusIcon className="h-12 w-12" />}
              actionLabel="Create Todo App"
              actionHref="/todo-app/new"
            />
          ) : (
            <>
              <div className="mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Todo Apps</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {todoApps.length}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {todoApps.map((todoApp, index) => (
                  <Link key={todoApp._id} href={`/todo-app/${todoApp._id}`}>
                    <Card 
                      className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <CardHeader className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                        <div className="relative flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                              {todoApp.name}
                            </h3>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Created {new Date(todoApp.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="ml-3 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            <DocumentTextIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="relative">
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {todoApp.description || 'No description provided'}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-medium">Active</span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </CardBody>

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}