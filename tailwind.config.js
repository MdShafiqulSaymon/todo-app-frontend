/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'blue-600': '#2563eb',
          'blue-700': '#1d4ed8',
          'gray-50': '#f9fafb',
          'gray-200': '#e5e7eb',
          'gray-300': '#d1d5db',
          'gray-500': '#6b7280',
          'gray-700': '#374151',
          'gray-900': '#111827',
          'red-50': '#fef2f2',
          'red-600': '#dc2626',
          'red-700': '#b91c1c',
          'green-100': '#dcfce7',
          'green-600': '#16a34a',
          'yellow-100': '#fef9c3',
          'yellow-800': '#854d0e',
        },
      },
    },
    plugins: [],
  };