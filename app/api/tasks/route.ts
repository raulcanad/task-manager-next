import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '@/app/types';

const tasksFile = path.join(process.cwd(), 'app/data/tasks.json');

// Leer tareas
async function readTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(tasksFile, 'utf8');
    return JSON.parse(data);
  } catch {
    const defaultTasks = [
      { id: 1, title: 'Aprender Next.js', completed: false },
      { id: 2, title: 'Crear API Routes', completed: true },
      { id: 3, title: 'Desplegar en Vercel', completed: false }
    ];
    await fs.writeFile(tasksFile, JSON.stringify(defaultTasks, null, 2));
    return defaultTasks;
  }
}

// GET /api/tasks
export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(request: Request) {
  const { title } = await request.json();
  
  if (!title?.trim()) {
    return NextResponse.json(
      { error: 'El título es requerido' },
      { status: 400 }
    );
  }

  const tasks = await readTasks();
  const newTask = {
    id: tasks.length + 1,
    title: title.trim(),
    completed: false
  };
  
  tasks.push(newTask);
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
  
  return NextResponse.json(newTask, { status: 201 });
}

// PUT /api/tasks/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const tasks = await readTasks();
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return NextResponse.json(
      { error: 'Tarea no encontrada' },
      { status: 404 }
    );
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed
  };
  
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
  return NextResponse.json(tasks[taskIndex]);
}

// DELETE /api/tasks/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const tasks = await readTasks();
  
  const newTasks = tasks.filter(t => t.id !== id);
  
  if (newTasks.length === tasks.length) {
    return NextResponse.json(
      { error: 'Tarea no encontrada' },
      { status: 404 }
    );
  }
  
  await fs.writeFile(tasksFile, JSON.stringify(newTasks, null, 2));
  return new NextResponse(null, { status: 204 });
}