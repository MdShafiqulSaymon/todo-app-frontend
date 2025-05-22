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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
          {!task && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md w-full"
              >
                <option value="stale">Stale</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <Button
            variant="secondary"
            onClick={() => router.push(`/todo-app/${todoAppId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="ml-2"
          >
            {isSubmitting ? <Spinner className="h-5 w-5 mr-2" /> : null}
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}