import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './CourseDetail.module.css';

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedLecture, setExpandedLecture] = useState('introduction');
  
  // Course data
  const courseData = {
    title: "Flutter Course:",
    subtitle: "This Course Is Your Best Way To Learn Mobile App Development For Android And Apple Using Flutter.",
    rating: 4.9,
    ratingCount: "(3.9)",
    lessons: 10,
    duration: "19h 30m",
    students: "20+",
    level: "Beginner",
    price: "$49.9",
    image: "/images/flutter-course.jpg"
  };
  
  // Course content data
  const courseContent = [
    {
      id: 'introduction',
      title: 'Introduction',
      lectures: 3,
      duration: '56min',
      lessons: [
        { id: 'setup', title: 'Setup', duration: '6min' },
        { id: 'firstApp1', title: 'First App', duration: '16min' },
        { id: 'firstApp2', title: 'First App', duration: '16min' }
      ]
    },
    {
      id: 'lecture2-1',
      title: 'Lecture 2',
      lectures: 3,
      duration: '56min',
      lessons: []
    },
    {
      id: 'lecture2-2',
      title: 'Lecture 2',
      lectures: 3,
      duration: '56min',
      lessons: []
    },
    {
      id: 'lecture2-3',
      title: 'Lecture 2',
      lectures: 3,
      duration: '56min',
      lessons: []
    }
  ];
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const toggleLecture = (lectureId) => {
    if (expandedLecture === lectureId) {
      setExpandedLecture(null);
    } else {
      setExpandedLecture(lectureId);
    }
  };

  return (
    <div className={styles.courseDetailContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.courseDetailContent}>
          {/* Course Banner */}
          <div className={styles.courseBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.courseImage}>
                <img 
                  src={courseData.image} 
                  alt={courseData.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x300?text=Flutter+Course';
                  }}
                />
                <div className={styles.courseLabel}>
                  <span className={styles.bestCourses}>BEST COURSES</span>
                  <h2 className={styles.courseTitle}>Flutter & Dart</h2>
                  <div className={styles.courseProvider}>
                    <img src="/images/class-central.png" alt="Class Central" className={styles.providerLogo} />
                    class central
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.bannerRight}>
              <h1 className={styles.courseHeading}>{courseData.title}</h1>
              <p className={styles.courseDescription}>{courseData.subtitle}</p>
              
              <button className={styles.enrollButton}>
                Get The Course
              </button>
            </div>
          </div>
          
          {/* Course Rating */}
          <div className={styles.courseRating}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className="fa-solid fa-star"></i>
              ))}
              <span className={styles.ratingCount}>{courseData.ratingCount}</span>
            </div>
          </div>
          
          {/* Course Stats */}
          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <i className="fa-solid fa-book"></i>
              <span>Lesson {courseData.lessons}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-clock"></i>
              <span>{courseData.duration}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-users"></i>
              <span>Students {courseData.students}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-signal"></i>
              <span>{courseData.level}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-tag"></i>
              <span>{courseData.price}</span>
            </div>
          </div>
          
          {/* Course Tabs */}
          <div className={styles.courseTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'certificates' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('certificates')}
            >
              Certificates
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'instructor' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('instructor')}
            >
              Instructor
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'content' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('content')}
            >
              Content
            </button>
          </div>
          
          {/* Course Content */}
          <div className={styles.courseContentContainer}>
            {courseContent.map((lecture) => (
              <div key={lecture.id} className={styles.lectureSection}>
                <div 
                  className={styles.lectureHeader}
                  onClick={() => toggleLecture(lecture.id)}
                >
                  <div className={styles.lectureInfo}>
                    <h3 className={styles.lectureTitle}>{lecture.title}</h3>
                    <div className={styles.lectureDetails}>
                      <span>{lecture.lectures} Lecture</span>
                      <span className={styles.lectureDuration}>{lecture.duration}</span>
                    </div>
                  </div>
                  <button 
                    className={styles.expandButton}
                    aria-label={expandedLecture === lecture.id ? "Collapse lecture" : "Expand lecture"}
                  >
                    <i className={`fa-solid fa-chevron-${expandedLecture === lecture.id ? 'up' : 'down'}`}></i>
                  </button>
                </div>
                
                {expandedLecture === lecture.id && lecture.lessons.length > 0 && (
                  <div className={styles.lessonsList}>
                    {lecture.lessons.map((lesson) => (
                      <div key={lesson.id} className={styles.lessonItem}>
                        <div className={styles.lessonInfo}>
                          <span className={styles.lessonTitle}>{lesson.title}</span>
                        </div>
                        <span className={styles.lessonDuration}>{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 