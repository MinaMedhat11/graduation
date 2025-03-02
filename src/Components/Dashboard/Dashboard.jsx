import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  
  // Sample data for task progress
  const taskProgress = [
    {
      id: 1,
      title: 'Web Programming',
      progress: 50,
      completed: 5,
      total: 10
    },
    {
      id: 2,
      title: 'Data and Structures',
      progress: 27,
      completed: 4,
      total: 15
    },
    {
      id: 3,
      title: 'Artificial Intelligence',
      progress: 10,
      completed: 2,
      total: 20
    }
  ];
  
  // Sample data for courses
  const courses = [
    {
      id: 1,
      title: 'Dart & Flutter',
      icon: 'fa-solid fa-mobile-screen',
      iconBg: '#3CB0A5',
      image: '/images/flutter-course.jpg',
      lessons: 76,
      assignments: 12,
      students: 36
    },
    {
      id: 2,
      title: 'Data Science',
      icon: 'fa-solid fa-chart-line',
      iconBg: '#4B5EAA',
      image: '/images/data-science.jpg',
      lessons: 101,
      assignments: 20,
      students: 9
    },
    {
      id: 3,
      title: 'UI/UX',
      icon: 'fa-solid fa-palette',
      iconBg: '#3CB0A5',
      image: '/images/uiux-course.jpg',
      lessons: 22,
      assignments: 15,
      students: 16
    }
  ];
  
  // Sample data for continue watching
  const continueWatching = [
    {
      id: 1,
      title: 'Advanced Course In Networks That Makes You Highly Capable',
      image: '/images/networking.jpg',
      category: 'Network',
      progress: 75
    },
    {
      id: 2,
      title: 'Beginner\'s Guide To Becoming A Professional Backend Developer',
      image: '/images/backend.jpg',
      category: 'Back-End',
      progress: 45
    },
    {
      id: 3,
      title: 'Beginner\'s Guide To Becoming A Professional Flutter Developer',
      image: '/images/flutter.jpg',
      category: 'Flutter',
      progress: 30
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.dashboardContent}>
          {/* Main Dashboard Cards */}
          <div className={styles.dashboardCards}>
            {/* Assignment Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Assignment</h3>
              <div className={styles.taskProgressContainer}>
                <h4 className={styles.sectionTitle}>Task Progress</h4>
                
                {taskProgress.map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskCompletion}>{task.completed}/{task.total}</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div 
                        className={styles.progressBar} 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Performance Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Performance</h3>
              <div className={styles.performanceContainer}>
                <div className={styles.performanceHeader}>
                  <div className={styles.pointType}>
                    <span className={styles.pointIndicator}></span>
                    <span>Point Progress</span>
                  </div>
                  <div className={styles.periodSelector}>
                    <select 
                      value={selectedPeriod} 
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className={styles.periodSelect}
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.gaugeContainer}>
                  <div className={styles.gauge}>
                    <div className={styles.gaugeBody}>
                      <div className={styles.gaugeIndicator}></div>
                      <div className={styles.gaugeValue}>
                        <div className={styles.pointValue}>
                          <span>Your Point:</span>
                          <span className={styles.pointNumber}>8,966</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pending Invoices Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Pending invoices</h3>
              <div className={styles.pendingInvoicesContainer}>
                <div className={styles.checkIcon}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <p className={styles.noInvoicesText}>
                  You don't have any pending invoices. If any to be issued later you would find them here.
                </p>
              </div>
            </div>
          </div>
          
          {/* Courses Section */}
          <div className={styles.coursesSection}>
            <h3 className={styles.sectionTitle}>Courses</h3>
            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div 
                    className={styles.courseIcon} 
                    style={{ backgroundColor: course.iconBg }}
                  >
                    <i className={course.icon}></i>
                  </div>
                  <div className={styles.courseContent}>
                    <h4 className={styles.courseTitle}>{course.title}</h4>
                    <div className={styles.courseStats}>
                      <div className={styles.statItem}>
                        <i className="fa-solid fa-book"></i>
                        <span>{course.lessons}</span>
                      </div>
                      <div className={styles.statItem}>
                        <i className="fa-solid fa-clipboard-list"></i>
                        <span>{course.assignments}</span>
                      </div>
                      <div className={styles.statItem}>
                        <i className="fa-solid fa-users"></i>
                        <span>{course.students}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Continue Watching Section */}
          <div className={styles.continueWatchingSection}>
            <h3 className={styles.sectionTitle}>Continue Watching</h3>
            <div className={styles.watchingGrid}>
              {continueWatching.map((course) => (
                <div key={course.id} className={styles.watchingCard}>
                  <div className={styles.watchingThumbnail}>
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className={styles.thumbnailImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/300x150?text=${course.category.replace(' ', '+')}`;
                      }}
                    />
                    <div className={styles.categoryBadge}>{course.category}</div>
                    <div className={styles.thumbnailOverlay}>
                      <div className={styles.playButton}>
                        <i className="fa-solid fa-play"></i>
                      </div>
                    </div>
                  </div>
                  <div className={styles.watchingInfo}>
                    <h4 className={styles.watchingTitle}>{course.title}</h4>
                    <div className={styles.watchingProgress}>
                      <div 
                        className={styles.progressIndicator}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 