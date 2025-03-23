import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './CourseDetail.module.css';

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedLecture, setExpandedLecture] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

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
        src={courseData.course_image}
        alt={courseData.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/500x300?text=Course+Image';
        }}
      />
      <div className={styles.courseLabel}>
        <h2 className={styles.courseTitle}>{courseData.name}</h2>
      </div>
    </div>
  </div>

  <div className={styles.bannerRight}>
    <h1 className={styles.courseHeading}>{courseData.name}</h1>
    <p className={styles.courseDescription}>{courseData.description}</p>

    <button className={styles.enrollButton}>Get The Course</button>
  </div>
</div>


          {/* Course Stats */}
          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <i className="fa-solid fa-book"></i>
              <span>Lesson {courseData.lessons_number}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-clock"></i>
              <span>{courseData.course_hours} Hours</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-signal"></i>
              <span>{courseData.course_level}</span>
            </div>
            <div className={styles.statItem}>
              <i className="fa-solid fa-tag"></i>
              <span>{courseData.price} EGP</span>
            </div>
          </div>

          {/* Course Tabs */}
          <div className={styles.courseTabs}>
            {['overview', 'reviews', 'certificates', 'instructor', 'content'].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Instructor Card */}
          {activeTab === 'instructor' && (
            <div className={styles.instructorCard}>
              <h3>Instructor</h3>
              <div className={styles.instructorDetails}>
                <p><strong>Name:</strong> {courseData.instructor.name}</p>
                <p><strong>Bio:</strong> {courseData.instructor.bio}</p>
                <p><strong>Email:</strong> {courseData.instructor.email}</p>
              </div>
            </div>
          )}

          {/* Content (Outcomes Section) */}
          {activeTab === 'content' && (
            <div className={styles.courseContentContainer}>
              <h3>What You Will Learn:</h3>
              <ul className={styles.outcomeList}>
                {courseData.outcomes.map((outcome) => (
                  <li key={outcome.id} className={styles.outcomeItem}>
                    <i className="fa-solid fa-check-circle"></i> {outcome.outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
