import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { useTaskContext } from '../../context/TaskContext';
import styles from './TaskForm.module.css';

export function TaskForm({ status, onClose }){
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: status
  });
  const handleChange = useCallback((e)=>{
    const{ name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleSubmit = useCallback(async (e)=>{
    e.preventDefault();
    if (!formData.title.trim()) return;
    try{
      await addTask({
        ...formData,
        createdAt: new Date().toISOString()
      });
      onClose?.();
    } catch (error){
      console.error('Failed to add task:', error);
    }
  }, [formData, addTask, onClose]);
  return(
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        className={styles.form}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>Новая задача</h2>

        <div className={styles.field}>
          <label>Название *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название задачи"
            required
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Расскажите о вашей задаче"
            rows={3}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Приоритет</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, config])=>(
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Срок</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Отмена
          </button>
          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Создать задачу
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}