'use client';

import { useState, FormEvent } from 'react';

interface TaskFormProps {
  onAddTask: (title: string) => Promise<void>;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    
    if (trimmedTitle && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddTask(trimmedTitle);
        setTitle('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea..."
        disabled={isSubmitting}
        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition-all disabled:bg-gray-100 text-gray-700"
      />
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="px-6 py-3 bg-[#667eea] text-white rounded-lg hover:bg-[#5a67d8] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        {isSubmitting ? 'Añadiendo...' : 'Añadir'}
      </button>
    </form>
  );
}
