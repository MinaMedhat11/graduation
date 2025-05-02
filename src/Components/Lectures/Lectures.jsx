import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import styles from './Lectures.module.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

// Icons
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; // Upcoming
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Attended/Done
import CancelIcon from '@mui/icons-material/Cancel'; // Missed/Cancelled
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SchoolIcon from '@mui/icons-material/School';
import LaunchIcon from '@mui/icons-material/Launch';

// Mock Data
const lectureSchedule = [
  { id: 1, date: '12/13/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 39, status: 'upcoming' },
  { id: 2, date: '12/11/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 38, status: 'upcoming' },
  { id: 3, date: '12/8/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 37, status: 'missed' },
  { id: 4, date: '12/6/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 36, status: 'attended' },
  { id: 5, date: '12/3/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 35, status: 'missed' },
  { id: 6, date: '12/1/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 34, status: 'attended' },
];

const courses = ['Advanced Course In Networks', 'Advanced C++ Course', 'Flutter Basics']; // Mock course list

// Helper to get status icon and row style
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return { icon: <AccessTimeFilledIcon color="action" />, style: {} };
    case 'attended':
      return { icon: <CheckCircleIcon color="success" />, style: { backgroundColor: '#E8F5E9' } }; // Light green background
    case 'missed':
      return { icon: <CancelIcon color="error" />, style: { backgroundColor: '#FFEBEE' } }; // Light red background
    default:
      return { icon: null, style: {} };
  }
};

export default function Lectures() {
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks');
  const [currentMonth, setCurrentMonth] = useState('12/2024'); // Example state for the month

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    // Add logic to fetch/filter lectures for the selected course if needed
  };

   const handlePrevMonth = () => {
     console.log('Previous Month');
     // Add logic to change month and fetch/filter data
   };

   const handleNextMonth = () => {
       console.log('Next Month');
       // Add logic to change month and fetch/filter data
   };

   const handleCheckLecture = () => {
     console.log('Check Online Lecture');
     // Add logic to check for live lecture
   };

   // Filter lectures based on selected course (if needed, mock data is already filtered)
   const filteredLectures = lectureSchedule.filter(l => l.course === selectedCourse);

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
                      /*  e.target.src = 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=4B5EAA&color=fff';*/
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
                      /* e.target.src = 'https://via.placeholder.com/80x60?text=Networks';*/ 
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
               /*       e.target.src = 'https://via.placeholder.com/80x60?text=Data';*/
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