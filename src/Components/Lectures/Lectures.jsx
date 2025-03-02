import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Lectures.module.css';

export default function Lectures() {
  // Sample data for lecture schedule with instructor information
  const lectureSchedule = [
    {
      id: 1,
      date: '12/13/2024',
      time: '10:00 AM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 39,
      status: 'upcoming',
      instructor: 'Dr. Sarah Johnson',
      instructorImage: '/images/instructor1.jpg'
    },
    {
      id: 2,
      date: '12/11/2024',
      time: '2:00 PM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 38,
      status: 'upcoming',
      instructor: 'Prof. Michael Chen',
      instructorImage: '/images/instructor2.jpg'
    },
    {
      id: 3,
      date: '12/8/2024',
      time: '11:30 AM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 37,
      status: 'missed',
      instructor: 'Dr. Emily Rodriguez',
      instructorImage: '/images/instructor3.jpg'
    },
    {
      id: 4,
      date: '12/6/2024',
      time: '3:00 PM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 36,
      status: 'attended',
      instructor: 'Prof. David Wilson',
      instructorImage: '/images/instructor4.jpg'
    },
    {
      id: 5,
      date: '12/3/2024',
      time: '9:00 AM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 35,
      status: 'missed',
      instructor: 'Dr. Lisa Thompson',
      instructorImage: '/images/instructor5.jpg'
    },
    {
      id: 6,
      date: '12/1/2024',
      time: '1:00 PM',
      duration: '06:00',
      course: 'Advanced Course In Networks',
      number: 34,
      status: 'attended',
      instructor: 'Prof. James Martin',
      instructorImage: '/images/instructor6.jpg'
    }
  ];

  // Current month/year for the schedule
  const currentSchedule = "12/2024";
  
  // State for course selection
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks');
  
  // State for current schedule page
  const [currentPage, setCurrentPage] = useState(1);
  const lecturesPerPage = 4;
  
  // Calculate which lectures to display
  const indexOfLastLecture = currentPage * lecturesPerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturesPerPage;
  const currentLectures = lectureSchedule.slice(indexOfFirstLecture, indexOfLastLecture);
  
  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < Math.ceil(lectureSchedule.length / lecturesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.lecturesContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.lecturesContent}>
          <div className={styles.contentRow}>
            {/* Online Lecture Card */}
            <div className={styles.onlineLectureCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <i className="fa-solid fa-video"></i>
                </div>
                <h3 className={styles.cardTitle}>Join Online Lecture</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.lectureInfo}>
                  <h4 className={styles.lectureCourse}>Advanced Course In Networks</h4>
                  <p className={styles.lectureTime}>Today at 10:00 AM</p>
                  <p className={styles.lectureDuration}>Duration: 6 hours</p>
                  <p className={styles.lectureInstructor}>
                    <img 
                      src="/images/instructor1.jpg" 
                      alt="Dr. Sarah Johnson" 
                      className={styles.instructorImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=4B5EAA&color=fff';
                      }}
                    />
                    Dr. Sarah Johnson
                  </p>
                </div>
                <p className={styles.cardDescription}>
                  Click to check if an online lecture is currently running
                </p>
                <button className={styles.checkButton}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  Check Now
                </button>
              </div>
            </div>
            
            {/* My Courses Card */}
            <div className={styles.myCoursesCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <i className="fa-solid fa-book"></i>
                </div>
                <h3 className={styles.cardTitle}>My Courses</h3>
              </div>
              
              <div className={styles.coursesList}>
                <div className={styles.courseItem}>
                  <img 
                    src="/images/course1.jpg" 
                    alt="Advanced Course In Networks" 
                    className={styles.courseImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x60?text=Networks';
                    }}
                  />
                  <div className={styles.courseDetails}>
                    <h4 className={styles.courseName}>Advanced Course In Networks</h4>
                    <p className={styles.courseProgress}>Progress: 60%</p>
                  </div>
                </div>
                <div className={styles.courseItem}>
                  <img 
                    src="/images/course2.jpg" 
                    alt="Data Structures" 
                    className={styles.courseImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x60?text=Data';
                    }}
                  />
                  <div className={styles.courseDetails}>
                    <h4 className={styles.courseName}>Data Structures</h4>
                    <p className={styles.courseProgress}>Progress: 45%</p>
                  </div>
                </div>
              </div>
              <button className={styles.viewAllButton}>
                View All Courses
              </button>
            </div>
          </div>
          
          {/* Lecture Schedule */}
          <div className={styles.scheduleContainer}>
            <div className={styles.scheduleHeader}>
              <h3 className={styles.scheduleTitle}>
                Lecture Schedule
                <span className={styles.scheduleDate}>{currentSchedule}</span>
              </h3>
              <div className={styles.scheduleControls}>
                <button 
                  className={styles.controlButton}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className={styles.pageIndicator}>
                  {currentPage} / {Math.ceil(lectureSchedule.length / lecturesPerPage)}
                </span>
                <button 
                  className={styles.controlButton}
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(lectureSchedule.length / lecturesPerPage)}
                  aria-label="Next page"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            <div className={styles.scheduleTable}>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Date & Time</div>
                <div className={styles.headerCell}>Duration</div>
                <div className={styles.headerCell}>Course</div>
                <div className={styles.headerCell}>Number</div>
                <div className={styles.headerCell}>Status</div>
              </div>
              
              {currentLectures.map((lecture) => (
                <div 
                  key={lecture.id} 
                  className={`${styles.tableRow}`}
                >
                  <div className={styles.tableCell}>
                    <div className={styles.dateTime}>
                      <div className={styles.date}>{lecture.date}</div>
                      <div className={styles.time}>{lecture.time}</div>
                    </div>
                  </div>
                  <div className={styles.tableCell}>{lecture.duration}</div>
                  <div className={styles.tableCell}>
                    <div className={styles.courseInfo}>
                      <div className={styles.courseName}>{lecture.course}</div>
                      <div className={styles.instructorName}>
                        <img 
                          src={lecture.instructorImage} 
                          alt={lecture.instructor} 
                          className={styles.smallInstructorImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${lecture.instructor.replace(' ', '+')}&background=3CB0A5&color=fff`;
                          }}
                        />
                        {lecture.instructor}
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableCell}>{lecture.number}</div>
                  <div className={styles.tableCell}>
                    <span className={`${styles.status} ${styles[lecture.status]}`}>
                      {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
                    </span>
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