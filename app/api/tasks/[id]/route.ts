import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const tasksFile = path.join(process.cwd(), 'app/data/tasks.json');

// Función para leer tareas
async function getTasks() {
  const data = await fs.readFile(tasksFile, 'utf8');
  return JSON.parse(data);
}

// Función para guardar tareas
async function saveTasks(tasks: any) {
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
}

// PUT /api/tasks/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // IMPORTANTE: En Next.js 15, params es una Promise
  const { id } = await params;
  const taskId = parseInt(id);
  
  console.log('PUT - ID recibido:', taskId); // Para debugging
  
  const tasks = await getTasks();
  
  const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  }

  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  await saveTasks(tasks);
  
  return NextResponse.json(tasks[taskIndex]);
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // IMPORTANTE: En Next.js 15, params es una Promise
  const { id } = await params;
  const taskId = parseInt(id);
  
  console.log('DELETE - ID recibido:', taskId); // Para debugging
  
  const tasks = await getTasks();
  
  const newTasks = tasks.filter((t: any) => t.id !== taskId);
  
  if (newTasks.length === tasks.length) {
    return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  }
  
  await saveTasks(newTasks);
  return new NextResponse(null, { status: 204 });
}