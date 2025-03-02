import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logoImage from '../../Images/pngwing.com.png';

export default function Sidebar() {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path || location.pathname === `/${path}`;
    };
    
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                    <Link to="/dashboard">
                        <img src={logoImage} alt="LMS Logo" className={styles.logoImage} />
                    </Link>
                </div>
                
                {/* Navigation Links */}
                <nav className={styles.navigation}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link 
                                to="/dashboard" 
                                className={`${styles.navLink} ${isActive('dashboard') || isActive('') ? styles.active : ''}`}
                            >
                                <i className={`fa-regular fa-clock ${styles.navIcon}`}></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link 
                                to="/courses" 
                                className={`${styles.navLink} ${isActive('courses') ? styles.active : ''}`}
                            >
                                <i className={`fa-solid fa-graduation-cap ${styles.navIcon}`}></i>
                                <span>Courses</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link 
                                to="/assignments" 
                                className={`${styles.navLink} ${isActive('assignments') ? styles.active : ''}`}
                            >
                                <i className={`fa-regular fa-file-lines ${styles.navIcon}`}></i>
                                <span>Assignment</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link 
                                to="/payments" 
                                className={`${styles.navLink} ${isActive('payments') ? styles.active : ''}`}
                            >
                                <i className={`fa-regular fa-credit-card ${styles.navIcon}`}></i>
                                <span>Payments</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link 
                                to="/lectures" 
                                className={`${styles.navLink} ${isActive('lectures') ? styles.active : ''}`}
                            >
                                <i className={`fa-regular fa-calendar ${styles.navIcon}`}></i>
                                <span>Lectures</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                
                {/* Logout at Bottom */}
                <div className={styles.logoutContainer}>
                    <Link to="/logout" className={styles.navLink}>
                        <i className={`fa-solid fa-arrow-right-from-bracket ${styles.navIcon}`}></i>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
