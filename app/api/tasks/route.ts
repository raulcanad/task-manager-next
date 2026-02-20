import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const tasksFile = path.join(process.cwd(), 'app/data/tasks.json');

async function getTasks() {
  const data = await fs.readFile(tasksFile, 'utf8');
  return JSON.parse(data);
}

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  const tasks = await getTasks();
  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false
  };
  tasks.push(newTask);
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
  return NextResponse.json(newTask, { status: 201 });
}
