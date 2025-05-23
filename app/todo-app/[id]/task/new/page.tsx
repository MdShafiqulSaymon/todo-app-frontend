'use client';

import { use } from 'react';
import { TaskForm } from '@/components/todo-app/TaskForm';

export default function NewTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  return <TaskForm todoAppId={id} />;
}