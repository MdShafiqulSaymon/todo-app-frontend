import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Collaborative ToDo Application
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg">
          Manage your tasks collaboratively with your team. Create todo lists, assign tasks, 
          track progress, and boost productivity together.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center">
          <div className="rounded-md shadow">
            <Link href="/auth/register">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}