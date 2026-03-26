import { motion } from 'framer-motion';
import { DEFAULT_PRIORITY, PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/constants';
import styles from './TaskCard.module.css';

const getPriorityConfig = (priority) =>{
  return PRIORITY_CONFIG[priority] || DEFAULT_PRIORITY; 
};
export function TaskCard({ task, onStatusChange, onDelete }){
  const priorityConfig = getPriorityConfig(task?.priority);
  const handleMove = (newStatus)=>{
    onStatusChange?.(task.id, newStatus);
  };
  return(
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{task?.title || 'Без названия'}</h3>
        <button
          className={styles.deleteButton}
          onClick={() => onDelete?.(task?.id)}
          aria-label="Delete task"
        >
          x
        </button>
      </div>
      {task?.description && (
        <p className={styles.description}>{task.description}</p>
      )}
      <div className={styles.cardFooter}>
        <span
          className={styles.priority}
          style={{ color: priorityConfig.color }}
        >
          ● {priorityConfig.label}
        </span>
        {task?.dueDate && (
          <span className={styles.date}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className={styles.actions}>
        {task?.status !== 'todo' && (
          <button
            className={styles.actionButton}
            onClick={() => handleMove('todo')}
          >
            ← В задачи
          </button>
        )}
        {task?.status !== 'doing' && (
          <button
            className={styles.actionButton}
            onClick={() => handleMove('doing')}
          >
            ⚒️ В процессе
          </button>
        )}
        {task?.status !== 'done' && (
          <button
            className={styles.actionButton}
            onClick={() => handleMove('done')}
          >
            ✅ Готово
          </button>
        )}
      </div>
    </motion.div>
  );
}