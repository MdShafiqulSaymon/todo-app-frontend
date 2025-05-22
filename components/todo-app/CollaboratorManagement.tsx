'use client';

import { useState, useEffect } from 'react';
import { todoAppApi, authApi } from '@/lib/api';
import { TodoApp, Collaborator, User } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);

  const fetchUserById = async (userId: string): Promise<User | null> => {
    try {
      console.log('Fetching user with ID:', userId);
      const user = await authApi.getUserById(userId);
      console.log('Successfully fetched user:', user);
      return user;
    } catch (error) {
      console.error(`Failed to fetch user with ID ${userId}:`, error);

      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return null;
    }
  };

  useEffect(() => {
    console.log('TodoAppId:', todoAppId);
    const fetchTodoAppAndUsers = async () => {
      try {
        setIsLoadingCollaborators(true);
        setError(null); 
        console.log('Fetching todo app:', todoAppId);
        
        const todoAppData = await todoAppApi.getById(todoAppId);
        console.log('Todo app data:', todoAppData);
        setTodoApp(todoAppData);


        if (!todoAppData.collaborators || todoAppData.collaborators.length === 0) {
          console.log('No collaborators found in todo app');
          setCollaboratorsWithUsers([]);
          return;
        }

        console.log('Found collaborators:', todoAppData.collaborators);

        const collaboratorsWithUsers = await Promise.all(
          todoAppData.collaborators.map(async (collaborator: Collaborator) => {
            const user = await fetchUserById(collaborator.userId);
            return { ...collaborator, user };
          })
        );
        
        console.log('Final collaborators with users:', collaboratorsWithUsers);
        setCollaboratorsWithUsers(collaboratorsWithUsers);
      } catch (err: any) {
        console.error('Error fetching collaborators:', err);
        setError(err.message || 'Failed to load collaborators');
      } finally {
        setIsLoadingCollaborators(false);
      }
    };
    
    if (todoAppId) {
      fetchTodoAppAndUsers();
    }
  }, [todoAppId]);

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const updatedTodoApp = await todoAppApi.addCollaborator(todoAppId, { email, role });
      console.log('Updated todo app after adding collaborator:', updatedTodoApp);
      setTodoApp(updatedTodoApp);

      const collaboratorsWithUsers = await Promise.all(
        updatedTodoApp.collaborators.map(async (collaborator: Collaborator) => {
          const user = await fetchUserById(collaborator.userId);
          return { ...collaborator, user };
        })
      );
      
      setCollaboratorsWithUsers(collaboratorsWithUsers);
      console.log('Updated collaborators list:', collaboratorsWithUsers);
      setEmail('');
      setRole('editor');
    } catch (err: any) {
      console.error('Error adding collaborator:', err);
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
      console.error('Error removing collaborator:', err);
      setError(err.message || 'Failed to remove collaborator');
    }
  };

  if (isLoadingCollaborators) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-6 w-6 mr-2" />
        <span className="text-gray-600">Loading collaborators...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleAddCollaborator} className="space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Collaborator Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            Invite
          </Button>
        </div>
      </form>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
          Collaborators ({collaboratorsWithUsers.length})
        </h4>
        
        {collaboratorsWithUsers.length > 0 ? (
          <div className="space-y-3">
            {collaboratorsWithUsers.map((collaborator) => (
              <div
                key={collaborator._id}
                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {collaborator.user 
                      ? `${collaborator.user.firstName[0]}${collaborator.user.lastName[0]}`
                      : '?'
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {collaborator.user
                        ? `${collaborator.user.firstName} ${collaborator.user.lastName}`
                        : `Unknown User (ID: ${collaborator.userId})`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collaborator.user?.email || `User ID: ${collaborator.userId}`}
                    </p>
                  </div>
                  <Badge 
                    className={`${
                      collaborator.role === 'editor' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {collaborator.role}
                  </Badge>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveCollaborator(collaborator._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No collaborators added yet</p>
            <p className="text-gray-500 text-sm mt-1">Invite team members to collaborate on this todo app</p>
          </div>
        )}
      </div>
    </div>
  );
}