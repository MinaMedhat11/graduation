import React from 'react';
import styles from './CalendarCard.module.css';

export default function CalendarCard({ events }) {
    return (
        <div className={styles.calendarCard}>
            <div className={styles.header}>
                <h5 className={styles.title}>Upcoming Events</h5>
                <button className={`btn btn-outline-primary ${styles.viewAllButton}`}>View All</button>
            </div>
            
            <div className={styles.eventsList}>
                {events.map((event, index) => (
                    <div 
                        key={index} 
                        className={`${styles.eventItem} ${index !== events.length - 1 ? styles.eventItemWithBorder : ''}`}
                    >
                        {/* Date Box */}
                        <div className={styles.dateBox}>
                            <div className={styles.month}>{event.month}</div>
                            <div className={styles.day}>{event.day}</div>
                        </div>
                        
                        {/* Event Details */}
                        <div className={styles.eventDetails}>
                            <h6 className={styles.eventTitle}>{event.title}</h6>
                            <p className={styles.eventTime}>
                                <i className={`fa-regular fa-clock ${styles.clockIcon}`}></i>
                                {event.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 