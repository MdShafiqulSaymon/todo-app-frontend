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
import { PlusIcon } from '@heroicons/react/24/outline';

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
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Your Todo Apps" actionLabel="New Todo App" actionHref="/todo-app/new" />
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todoApps.map((todoApp) => (
            <Link key={todoApp._id} href={`/todo-app/${todoApp._id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <h3 className="text-lg font-semibold">{todoApp.name}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-500">{todoApp.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Created: {new Date(todoApp.createdAt).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}