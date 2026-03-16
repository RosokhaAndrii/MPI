import React from 'react';
import { Link, useLocation } from 'react-router';
import styles from './Header.module.css';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/lab1', label: 'Лабораторна робота №1' },
  { path: '/lab2', label: 'Лабораторна робота №2' },
  { path: '/lab3', label: 'Лабораторна робота №3' },
];

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            🎓 Фізичне моделювання
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${
                location.pathname === item.path ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;