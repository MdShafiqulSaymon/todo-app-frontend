import { ReactNode } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative text-center py-16 px-6">
        {icon && (
          <div className="mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl scale-150"></div>
            <div className="relative h-20 w-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200/50 shadow-lg">
              <div className="h-12 w-12 text-blue-500">
                {icon}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed mb-8">
            {description}
          </p>
        </div>

        {actionLabel && actionHref && (
          <div className="relative">
            <Link
              href={actionHref}
              className="group inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <PlusIcon className="relative -ml-1 mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
              <span className="relative">{actionLabel}</span>
            </Link>

            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        )}

        <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-indigo-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}