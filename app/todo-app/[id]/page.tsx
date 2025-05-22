'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { todoAppApi, taskApi } from '@/lib/api';
import { TodoApp, Task, Collaborator } from '@/lib/types';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { TaskList } from '@/components/todo-app/TaskList';
import { CollaboratorManagement } from '@/components/todo-app/CollaboratorManagement';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircleIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import io from 'socket.io-client';

export default function TodoAppPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuth();
  const router = useRouter();
  const [todoApp, setTodoApp] = useState<TodoApp | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEST_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: { token: localStorage.getItem('token') },
    });

    const fetchTodoApp = async () => {
      try {
        setLoading(true);
        console.log(id);
        const todoAppData = await todoAppApi.getById(id);
        console.log(todoAppData);
        setTodoApp(todoAppData);

        if (todoAppData.ownerId === user?.id) {
          setUserRole('owner');
        } else {
          const collaborator = todoAppData.collaborators.find(
            (collab: Collaborator) => collab.userId === user?.id
          );
          setUserRole(collaborator?.role || null);
        }

        const tasksData = await taskApi.getAllByTodoApp(id);
        setTasks(tasksData);
      } catch (err: any) {
        setError(err.message || 'Failed to load Todo app');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTodoApp();
    }

    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskCreated', (newTask: Task) => {
      if (newTask.todoAppId === id) {
        setTasks((prev) => [...prev, newTask]);
      }
    });

    socket.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on('collaboratorUpdated', (updatedTodoApp: TodoApp) => {
      if (updatedTodoApp._id === id) {
        setTodoApp(updatedTodoApp);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, user]);

  const handleDeleteTodoApp = async () => {
    if (!todoApp || userRole !== 'owner') return;
    try {
      await todoAppApi.delete(todoApp._id);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete Todo app');
    }
  };
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Spinner className="relative h-16 w-16 text-blue-600" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">Loading todo app...</p>
        </div>
      </div>
    );
  }

  if (error || !todoApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center border border-red-200/50">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-6">{error || 'Todo app not found'}</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
    

      <div className="relative">
        <DashboardHeader
          title={todoApp.name}
          actionLabel={userRole !== 'viewer' ? 'New Task' : undefined}
          actionHref={userRole !== 'viewer' ? `/todo-app/${id}/task/new` : undefined}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-3xl font-bold text-purple-600">{completionPercentage}%</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{todoApp.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Created {new Date(todoApp.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userRole === 'owner' ? 'bg-blue-100 text-blue-800' :
                            userRole === 'editor' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {userRole === 'owner' ? '👑 Owner' : 
                             userRole === 'editor' ? '✏️ Editor' : 
                             '👀 Viewer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {todoApp.description && (
                    <p className="text-gray-600 leading-relaxed">{todoApp.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Tasks</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {completedTasks} of {totalTasks} completed
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <TaskList
                    tasks={tasks}
                    setTasks={setTasks}
                    todoAppId={id}
                    userRole={userRole}
                  />
                </CardBody>
              </Card>
            </div>

            {userRole === 'owner' && (
              <div className="space-y-8">

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/30">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Collaborators</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CollaboratorManagement todoAppId={todoApp._id} />
                  </CardBody>
                </Card>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-red-200/50">
                  <CardHeader className="bg-gradient-to-r from-red-50/50 to-pink-50/30">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                        <h4 className="font-semibold text-red-800 mb-2">Delete Todo App</h4>
                        <p className="text-sm text-red-600 mb-4">
                          This action cannot be undone. This will permanently delete the todo app and all its tasks.
                        </p>
                        <Button
                          variant="danger"
                          onClick={handleDeleteTodoApp}
                          disabled={userRole !== 'owner'}
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                          Delete Todo App
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}