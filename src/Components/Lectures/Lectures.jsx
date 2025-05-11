import React, { useState, useEffect } from 'react';
import styles from './Lectures.module.css';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const selectedCourse = 'Advanced Course In Networks';

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(false); // Set to false immediately for now to show UI
        // Mock data instead of API call
        setLectures([
          { date: '12/13/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 39, status: 'upcoming' },
          { date: '12/11/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 38, status: 'upcoming' },
          { date: '12/8/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 37, status: 'missed' },
          { date: '12/6/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 36, status: 'attended' },
          { date: '12/3/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 35, status: 'missed' },
          { date: '12/1/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 34, status: 'attended' },
        ]);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };

    fetchLectures();
  }, []);

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

  // Helper function to get row class based on status
  const getStatusClass = (status) => {
    switch(status) {
      case 'attended': return styles.attendedRow;
      case 'missed': return styles.missedRow;
      default: return '';
    }
  };
  
  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'attended': return <CheckCircleIcon className={styles.attendedIcon} />;
      case 'missed': return <CancelIcon className={styles.missedIcon} />;
      default: return <AccessTimeIcon className={styles.upcomingIcon} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.lecturesWrapper}>
      <div className={styles.joinLectureSection}>
        <VideocamIcon className={styles.videoIcon} />
        <h2 className={styles.joinLectureTitle}>Join Online Lecture</h2>
        <p className={styles.joinLectureText}>
          Click To Check If An Online Lecture Is Currently Running. Keep The Page Open, And It Will Do This Check Automatically.
        </p>
        <button className={styles.checkButton} onClick={handleCheckLecture}>
          <VideocamIcon className={styles.buttonIcon} />
          Check
        </button>
      </div>
          
      <div className={styles.myCourses}>
        <div className={styles.myCoursesHeader}>
          <MenuBookIcon className={styles.courseIcon} />
          <h2 className={styles.myCoursesTitle}>My Courses</h2>
        </div>
        
        <div className={styles.courseNavigation}>
          <button className={styles.navButton} onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeftIcon />
          </button>
          <div className={styles.courseInfo}>
            <h3 className={styles.courseName}>{selectedCourse}</h3>
            <p className={styles.courseLabel}>Chose Your Course</p>
          </div>
          <button className={styles.navButton} onClick={handleNextPage}>
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div className={styles.scheduleSection}>
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleTitle}>
            <h3>Lecture Schedule</h3>
            <p>12/2024</p>
          </div>
          <div className={styles.scheduleNavigation}>
            <button className={styles.scheduleNavButton}>
              <ArrowBackIcon />
            </button>
            <button className={styles.scheduleNavButton}>
              <ArrowForwardIcon />
            </button>
          </div>
        </div>
        
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration</th>
              <th>Course</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture, index) => (
              <tr key={index} className={getStatusClass(lecture.status)}>
                <td>
                  {getStatusIcon(lecture.status)}
                  <span className={styles.dateText}>{lecture.date}</span>
                </td>
                <td>{lecture.duration}</td>
                <td>{lecture.course}</td>
                <td>{lecture.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}