import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
    const { id, title, instructor, progress, image, category, duration } = course;
    
    return (
        <div className={styles.courseCard}>
            {/* Course Image */}
            <div className={styles.imageContainer}>
                <img 
                    src={image} 
                    alt={title} 
                    className={styles.courseImage}
                />
                <div className={styles.category}>
                    {category}
                </div>
            </div>
            
            {/* Course Content */}
            <div className={styles.courseContent}>
                <h5 className={styles.courseTitle}>{title}</h5>
                <p className={styles.instructor}>
                    <i className={`fa-solid fa-user-tie ${styles.icon}`}></i>
                    {instructor}
                </p>
                <p className={styles.duration}>
                    <i className={`fa-regular fa-clock ${styles.icon}`}></i>
                    {duration}
                </p>
                
                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progress} 
                            role="progressbar" 
                            style={{ width: `${progress}%` }} 
                            aria-valuenow={progress} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className={styles.progressInfo}>
                        <span className={styles.progressText}>{progress}% Complete</span>
                        <Link to={`/course/${id}`} className={`btn btn-outline-primary ${styles.continueButton}`}>
                            Continue
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 