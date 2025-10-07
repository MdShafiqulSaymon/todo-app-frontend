'use client';

import { useState } from 'react';
import Link from 'next/link';
import { taskApi } from '@/lib/api';
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  todoAppId: string;
  userRole: 'owner' | 'editor' | 'viewer' | null;
}

export function TaskList({ tasks, setTasks, todoAppId, userRole }: TaskListProps) {
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | ''>('');
  console.log(tasks);
  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = await taskApi.updateStatus(taskId, { status });
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  const sortedTasks = sortBy
    ? [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        } else if (sortBy === 'dueDate') {
          return (
            (new Date(a.dueDate || '').getTime() || Infinity) -
            (new Date(b.dueDate || '').getTime() || Infinity)
          );
        }
        return 0;
      })
    : filteredTasks;

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="mb-4 flex space-x-4">
        <div className='text-black'>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="stale">Stale</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className='text-black'>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate' | '')}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">None</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>
      {sortedTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-black">{task.title}</h4>
                  <p className="text-sm text-black">{task.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <Badge
                      variant={
                        task.status === 'completed'
                          ? 'success'
                          : task.status === 'in-progress'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {task.status}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'danger'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <Badge>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
                {userRole === 'owner' || userRole === 'editor' ? (
                  <div className="flex space-x-2 text-black">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value as Task['status'])
                      }
                      className="border rounded-md p-1 text-sm"
                    >
                      <option value="stale">Stale</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Link href={`/todo-app/${todoAppId}/task/${task._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}