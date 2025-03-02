import React from 'react';
import styles from './StatCard.module.css';

export default function StatCard({ title, value, icon, color }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.content}>
                <div className={styles.textContainer}>
                    <h6 className={styles.title}>{title}</h6>
                    <h3 className={styles.value}>{value}</h3>
                </div>
                <div 
                    className={styles.iconContainer}
                    style={{ backgroundColor: `${color}20` }}
                >
                    <i className={`${icon} ${styles.icon}`} style={{ color }}></i>
                </div>
            </div>
        </div>
    );
} 