import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_CONFIG } from '../../utils/constants';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskForm } from '../TaskForm/TaskForm';
import { useTaskContext } from '../../context/TaskContext';
import styles from './TaskColumn.module.css';

export function TaskColumn({ status }){
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const config = STATUS_CONFIG[status];

  const columnTasks = useMemo(()=>{
    return tasks.filter((task) => task.status === status);
  }, [tasks, status]);
  const handleAddTask = useCallback(()=>{
    setIsFormOpen(true);
  }, []);
  const handleCloseForm = useCallback(()=>{
    setIsFormOpen(false);
  }, []);
  const handleTaskSubmit = useCallback(async(taskData)=>{
    setIsFormOpen(false);
  }, []);
  const handleStatusChange = useCallback(async(taskId, newStatus)=>{
    await updateTask(taskId, { status: newStatus });
  }, [updateTask]);
  const handleDelete = useCallback(async(taskId)=>{
    await deleteTask(taskId);
  }, [deleteTask]);
  return (
    <motion.div
      className={styles.column}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span className={styles.icon}>{config.icon}</span>
          <h2 style={{ color: config.color }}>{config.label}</h2>
        </div>
        <motion.span
          className={styles.count}
          style={{ backgroundColor: config.color }}
          whileHover={{ scale: 1.1 }}
        >
          {columnTasks.length}
        </motion.span>
      </div>
      <motion.button
        className={styles.addButton}
        onClick={handleAddTask}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Добавить задачу
      </motion.button>
      <AnimatePresence mode="popLayout">
        <div className={styles.taskList}>
          {columnTasks.length === 0 ? (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>Задач пока нет</p>
            </motion.div>
          ) : (
            columnTasks.map((task)=>(
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </AnimatePresence>
      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            status={status}
            onSubmit={handleTaskSubmit}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}