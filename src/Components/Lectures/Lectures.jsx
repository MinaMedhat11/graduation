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

// Mock data for testing
const mockLectures = [
  {
    id: 1,
    title: 'Introduction to React',
    date: '2024-04-15',
    time: '10:00 AM',
    duration: '2 hours',
    instructor: 'John Doe',
    status: 'upcoming',
    course: 'Advanced Course In Networks',
    instructorImage: '/images/instructor1.jpg'
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    date: '2024-04-16',
    time: '02:00 PM',
    duration: '3 hours',
    instructor: 'Jane Smith',
    status: 'upcoming',
    course: 'Advanced Course In Networks',
    instructorImage: '/images/instructor2.jpg'
  }
];

const courses = ['Advanced Course In Networks', 'Advanced C++ Course', 'Flutter Basics'];

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
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturesPerPage] = useState(5);
  const [currentSchedule, setCurrentSchedule] = useState('April 2024');
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks');
  const [currentMonth, setCurrentMonth] = useState('12/2024'); // Example state for the month

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await axios.get('/api/lectures');
        // setLectures(response.data);
        setLectures(mockLectures);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleCheckLecture = () => {
    console.log('Check Online Lecture');
    // Add logic to check for live lecture
  };

  const filteredLectures = lectures.filter(l => l.course === selectedCourse);
  const currentLectures = filteredLectures.slice(
    (currentPage - 1) * lecturesPerPage,
    currentPage * lecturesPerPage
  );

  if (loading) {
    return <Loading />;
  }

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
                  <h4 className={styles.lectureCourse}>{selectedCourse}</h4>
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
                <button 
                  className={styles.checkButton}
                  onClick={handleCheckLecture}
                >
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
                {courses.map((course, index) => (
                  <div key={index} className={styles.courseItem}>
                    <img 
                      src={`/images/course${index + 1}.jpg`}
                      alt={course}
                      className={styles.courseImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/80x60?text=${course.split(' ')[0]}`;
                      }}
                    />
                    <div className={styles.courseDetails}>
                      <h4 className={styles.courseName}>{course}</h4>
                      <p className={styles.courseProgress}>Progress: {Math.floor(Math.random() * 100)}%</p>
                    </div>
                  </div>
                ))}
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
                  {currentPage} / {Math.ceil(filteredLectures.length / lecturesPerPage)}
                </span>
                <button 
                  className={styles.controlButton}
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(filteredLectures.length / lecturesPerPage)}
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
                  className={`${styles.tableRow} ${styles[lecture.status]}`}
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
                  <div className={styles.tableCell}>{lecture.id}</div>
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