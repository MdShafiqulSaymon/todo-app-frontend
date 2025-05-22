'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';
import { Task } from '@/lib/types';
import { TaskForm } from '@/components/todo-app/TaskForm';
import { Spinner } from '@/components/ui/Spinner';

export default function EditTaskPage({
  params,
}: {
  params: { id: string; taskId: string };
}) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await taskApi.getById(params.taskId);
        setTask(taskData);
      } catch (err: any) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [params.taskId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Task not found'}</p>
      </div>
    );
  }

  return <TaskForm todoAppId={params.id} task={task} />;
}