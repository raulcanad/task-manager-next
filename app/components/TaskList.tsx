'use client';

import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center py-8">¡Añade tu primera tarea!</p>;
  }

  return (
    <ul className="bg-white rounded-lg shadow overflow-hidden">
      {tasks.map(task => (
        <li
          key={task.id}
          className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            className="w-5 h-5 mr-3 accent-blue-500 cursor-pointer"
          />
          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.title}
          </span>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-500 hover:text-red-700 text-xl font-bold transition"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}