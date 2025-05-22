'use client';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function DashboardHeader({ title, actionLabel, actionHref }: DashboardHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {title}
        </h2>
      </div>
      {actionLabel && actionHref && (
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href={actionHref}
            className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}