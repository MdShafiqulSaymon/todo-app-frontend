'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { todoAppApi } from '@/lib/api';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function NewTodoAppPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
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
      const newTodoApp = await todoAppApi.create(formData);
      router.push(`/todo-app/${newTodoApp._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create todo app');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Todo App</h2>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">New Todo App</h3>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </CardBody>
          <CardFooter>
            <Button
              variant="secondary"
              onClick={() => router.push('/dashboard')}
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
              Create Todo App
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}