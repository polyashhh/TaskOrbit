import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../services/api';

export function useTasks(){
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTasks = useCallback(async()=>{
    try{
      setLoading(true);
      setError(null);
      const data = await taskApi.getAll();
      setTasks(data);
    }catch (err){
      setError('Failed to fetch tasks');
    }finally{
      setLoading(false);
    }
  }, []);
  const addTask = useCallback(async(taskData)=>{
    try{
      const newTask = await taskApi.create(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    }catch (err){
      setError('Failed to add task');
      throw err;
    }
  }, []);
  const updateTask = useCallback(async(id, taskData)=>{
    try{
      const updatedTask = await taskApi.update(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    }catch (err){
      setError('Failed to update task');
      throw err;
    }
  }, []);
  const deleteTask = useCallback(async(id)=>{
    try{
      await taskApi.delete(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }catch (err){
      setError('Failed to delete task');
      throw err;
    }
  }, []);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
}