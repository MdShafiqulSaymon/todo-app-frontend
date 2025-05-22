'use client';

import { TaskForm } from '@/components/todo-app/TaskForm';

export default function NewTaskPage({ params }: { params: { id: string } }) {
  return <TaskForm todoAppId={params.id} />;
}