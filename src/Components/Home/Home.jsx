import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import CourseCard from '../CourseCard/CourseCard';
import StatCard from '../StatCard/StatCard';
import styles from './Home.module.css';

export default function Home() {
  // Sample data for courses
  const courses = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      instructor: 'John Smith',
      progress: 75,
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Development',
      duration: '8 weeks'
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 45,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Design',
      duration: '6 weeks'
    },
    {
      id: 3,
      title: 'Data Science Essentials',
      instructor: 'Michael Brown',
      progress: 30,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Data Science',
      duration: '10 weeks'
    },
    {
      id: 4,
      title: 'Mobile App Development',
      instructor: 'Emily Chen',
      progress: 60,
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Development',
      duration: '12 weeks'
    }
  ];

  // Sample data for stats
  const stats = [
    {
      title: 'Courses in Progress',
      value: '4',
      icon: 'fa-solid fa-book',
      color: '#3CB0A5'
    },
    {
      title: 'Completed Courses',
      value: '12',
      icon: 'fa-solid fa-graduation-cap',
      color: '#3a0ca3'
    },
    {
      title: 'Certificates Earned',
      value: '8',
      icon: 'fa-solid fa-certificate',
      color: '#7209b7'
    },
    {
      title: 'Total Hours',
      value: '256',
      icon: 'fa-solid fa-clock',
      color: '#f72585'
    }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="dashboard-content p-4">
          {/* Welcome Section */}
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Welcome back, John!</h2>
            <p className={styles.welcomeSubtitle}>Here's what's happening with your learning journey today.</p>
          </div>
          
          {/* Stats Section */}
          <div className={styles.statsSection}>
            <div className="row g-4">
              {stats.map((stat, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <StatCard 
                    title={stat.title} 
                    value={stat.value} 
                    icon={stat.icon} 
                    color={stat.color} 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Courses Section */}
          <div className={styles.coursesSection}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>My Courses</h4>
              <button className={`btn btn-outline-primary ${styles.viewAllButton}`}>View All</button>
            </div>
            
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course.id} className="col-md-6 col-lg-3">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Learning Progress Widget */}
          <div className="row">
            <div className="col-lg-8">
              <div className={styles.progressWidget}>
                <h5 className={styles.progressTitle}>Learning Progress</h5>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progress} 
                    role="progressbar" 
                    style={{ width: '65%' }} 
                    aria-valuenow="65" 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <p className={styles.progressText}>You're making great progress! Keep going to reach your learning goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
