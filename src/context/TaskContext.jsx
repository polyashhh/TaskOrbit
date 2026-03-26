import { createContext, useContext, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskContext = createContext(null);
export function TaskProvider({ children }){
  const taskState = useTasks();
  const value = useMemo(()=>taskState, [taskState]);
  return(
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
export function useTaskContext(){
  const context = useContext(TaskContext);
  if (!context){
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}