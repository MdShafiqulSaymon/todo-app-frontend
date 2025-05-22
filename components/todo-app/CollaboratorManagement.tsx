'use client';

import { useState, useEffect } from 'react';
import { todoAppApi, authApi } from '@/lib/api';
import { TodoApp, Collaborator, User } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CollaboratorManagementProps {
  todoAppId: string;
}

interface CollaboratorWithUser extends Collaborator {
  user: User | null;
}

export function CollaboratorManagement({ todoAppId }: CollaboratorManagementProps) {
  const [todoApp, setTodoApp] = useState<TodoApp | null>(null);
  const [collaboratorsWithUsers, setCollaboratorsWithUsers] = useState<
    CollaboratorWithUser[]
  >([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('editor');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodoAppAndUsers = async () => {
      try {
        const [todoAppData] = await todoAppApi.getById(todoAppId);
        setTodoApp(todoAppData);

        const collaboratorsWithUsers = await Promise.all(
          todoAppData.collaborators.map(async (collaborator: Collaborator) => {
            try {
              const user = await authApi.getUserById(collaborator.userId);
              return { ...collaborator, user };
            } catch {
              return { ...collaborator, user: null };
            }
          })
        );
        setCollaboratorsWithUsers(collaboratorsWithUsers);
      } catch (err: any) {
        setError(err.message || 'Failed to load collaborators');
      }
    };
    fetchTodoAppAndUsers();
  }, [todoAppId]);

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const updatedTodoApp = await todoAppApi.addCollaborator(todoAppId, { email, role });
      setTodoApp(updatedTodoApp);
      const collaboratorsWithUsers = await Promise.all(
        updatedTodoApp.collaborators.map(async (collaborator: Collaborator) => {
          try {
            const user = await authApi.getUserById(collaborator.userId);
            return { ...collaborator, user };
          } catch {
            return { ...collaborator, user: null };
          }
        })
      );
      setCollaboratorsWithUsers(collaboratorsWithUsers);
      setEmail('');
      setRole('editor');
    } catch (err: any) {
      setError(err.message || 'Failed to add collaborator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const updatedTodoApp = await todoAppApi.removeCollaborator(todoAppId, collaboratorId);
      setTodoApp(updatedTodoApp);
      setCollaboratorsWithUsers((prev) =>
        prev.filter((collab) => collab._id !== collaboratorId)
      );
    } catch (err: any) {
      setError(err.message || 'Failed to remove collaborator');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleAddCollaborator} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Collaborator Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? <Spinner className="h-5 w-5 mr-2" /> : null}
              Invite
            </Button>
          </div>
        </div>
      </form>
      {collaboratorsWithUsers.length ? (
        <div className="space-y-2">
          {collaboratorsWithUsers.map((collaborator) => (
            <div
              key={collaborator._id}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <span className="text-sm">
                  {collaborator.user
                    ? `${collaborator.user.firstName} ${collaborator.user.lastName} (${collaborator.user.email})`
                    : 'Unknown User'}
                </span>
                <Badge className="ml-2">{collaborator.role}</Badge>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveCollaborator(collaborator._id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No collaborators added.</p>
      )}
    </div>
  );
}