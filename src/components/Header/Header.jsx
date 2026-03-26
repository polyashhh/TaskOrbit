import { motion } from 'framer-motion';
import styles from './Header.module.css';

export function Header(){
  return(
    <motion.header
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.logo}>
        <h1 className={styles.title}>TaskOrbit</h1>
      </div>
      <nav className={styles.nav}>
        <motion.button
          className={styles.navButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Настройки
        </motion.button>
      </nav>
    </motion.header>
  );
}