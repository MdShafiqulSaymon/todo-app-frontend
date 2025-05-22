'use client';

import { useState, useEffect } from 'react';
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
import io from 'socket.io-client';

export default function TodoAppPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [todoApp, setTodoApp] = useState<TodoApp | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: { token: localStorage.getItem('token') },
    });

    const fetchTodoApp = async () => {
      try {
        setLoading(true);
        const [todoAppData] = await todoAppApi.getById(params.id);
        setTodoApp(todoAppData);

        if (todoAppData.ownerId === user?.id) {
          setUserRole('owner');
        } else {
          const collaborator = todoAppData.collaborators.find(
            (collab: Collaborator) => collab.userId === user?.id
          );
          setUserRole(collaborator?.role || null);
        }

        const tasksData = await taskApi.getAllByTodoApp(params.id);
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
      if (newTask.todoAppId === params.id) {
        setTasks((prev) => [...prev, newTask]);
      }
    });

    socket.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on('collaboratorUpdated', (updatedTodoApp: TodoApp) => {
      if (updatedTodoApp._id === params.id) {
        setTodoApp(updatedTodoApp);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [params.id, user]);

  const handleDeleteTodoApp = async () => {
    if (!todoApp || userRole !== 'owner') return;
    try {
      await todoAppApi.delete(todoApp._id);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete Todo app');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error || !todoApp) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Todo app not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title={todoApp.name}
        actionLabel={userRole !== 'viewer' ? 'New Task' : undefined}
        actionHref={userRole !== 'viewer' ? `/todo-app/${params.id}/task/new` : undefined}
      />
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Tasks</h3>
            </CardHeader>
            <CardBody>
              <TaskList
                tasks={tasks}
                setTasks={setTasks}
                todoAppId={params.id}
                userRole={userRole}
              />
            </CardBody>
          </Card>
        </div>
        {userRole === 'owner' && (
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Collaborators</h3>
              </CardHeader>
              <CardBody>
                <CollaboratorManagement todoAppId={todoApp._id} />
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
              </CardHeader>
              <CardBody>
                <Button
                  variant="danger"
                  onClick={handleDeleteTodoApp}
                  disabled={userRole !== 'owner'}
                >
                  Delete Todo App
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}