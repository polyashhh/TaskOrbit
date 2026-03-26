import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../services/api';

const STORAGE_KEY = 'taskorbit-tasks';
const isDev = import.meta.env.DEV;
const initialTasks = [/* ... */];

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadTasks = useCallback(async () => {
    if (isDev) {
      try {
        const data = await taskApi.getAll();
        setTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks');
        // Fallback на localStorage если сервер недоступен
        const stored = localStorage.getItem(STORAGE_KEY);
        setTasks(stored ? JSON.parse(stored) : initialTasks);
      }
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      setTasks(stored ? JSON.parse(stored) : initialTasks);
    }
    setLoading(false);
  }, []);
  const saveToStorage = useCallback((tasksToSave) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
  }, []);
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  const addTask = useCallback(async (taskData) => {
    const newTask = {
      ...taskData,
      id: isDev ? undefined : Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    if (isDev) {
      const created = await taskApi.create(newTask);
      setTasks((prev) => [...prev, created]);
      return created;
    } else {
      const taskWithId = { ...newTask, id: Date.now().toString() };
      const updated = [...tasks, taskWithId];
      setTasks(updated);
      saveToStorage(updated);
      return taskWithId;
    }
  }, [tasks, saveToStorage]);

  const updateTask = useCallback(async (id, taskData) => {
    if (isDev) {
      const updated = await taskApi.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } else {
      const updated = tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t));
      setTasks(updated);
      saveToStorage(updated);
      return updated.find((t) => t.id === id);
    }
  }, [tasks, saveToStorage]);
  const deleteTask = useCallback(async (id) => {
    if (isDev) {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      saveToStorage(updated);
    }
  }, [tasks]);
  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetch: loadTasks
  };
}