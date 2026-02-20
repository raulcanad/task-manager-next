'use client';

import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (!res.ok) throw new Error('Error al añadir');
      
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      setError('Error al añadir tarea');
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT'
      });
      
      if (!res.ok) throw new Error('Error al actualizar');
      
      const updatedTask = await res.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError('Error al actualizar');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Error al eliminar');
      
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <header className="bg-white shadow-lg py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800">📋 Gestor de Tareas</h1>
          <p className="text-center text-gray-600 mt-2">Next.js + TypeScript + Tailwind</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <span className="text-gray-600">Total</span>
            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-3 text-center">
            <span className="text-green-600">Completadas</span>
            <p className="text-2xl font-bold text-green-700">{tasks.filter(t => t.completed).length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-3 text-center">
            <span className="text-yellow-600">Pendientes</span>
            <p className="text-2xl font-bold text-yellow-700">{tasks.filter(t => !t.completed).length}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
