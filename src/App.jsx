import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // ← Оставьте
import { motion } from 'framer-motion';
import { Header } from './components/Header/Header';
import { TaskColumn } from './components/TaskColumn/TaskColumn';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import './index.css';

function AppContent() {
  const { tasks, loading, error } = useTaskContext();
  const getTasksByStatus = useCallback(
    (status) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка задач...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error">
        <p>Не удалось загрузить задачи</p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }
  return (
    <div className="app">
      <Header />
      <motion.main
        className="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="board">
          <TaskColumn status="todo" tasks={getTasksByStatus('todo')} />
          <TaskColumn status="doing" tasks={getTasksByStatus('doing')} />
          <TaskColumn status="done" tasks={getTasksByStatus('done')} />
        </div>
      </motion.main>
    </div>
  );
}
function App(){
  return (
    <HashRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<AppContent />} /> 
        </Routes>
      </TaskProvider>
    </HashRouter>
  );
}
export default App;