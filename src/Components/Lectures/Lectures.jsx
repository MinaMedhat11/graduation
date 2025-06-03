import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Lectures.module.css';
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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/lecture', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract enrolled courses
        const enrolled = response.data.data.filter(course => course.pivot);
        setEnrolledCourses(enrolled);
        
        // Set initial selected course
        if (enrolled.length > 0) {
          setSelectedCourse(enrolled[0]);
          transformLectures(enrolled[0]);
        }
        
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLectures();
  }, []);

  const transformLectures = (course) => {
    const transformed = course.contents.map((content, index) => ({
      id: content.id,
      date: new Date(content.created_at).toLocaleDateString('en-US'),
      duration: `${content.duration} min`,
      course: course.name,
      number: index + 1,
      status: content.is_free ? 'attended' : 'upcoming'
    }));
    setLectures(transformed);
  };

  const handleCourseNavigation = (direction) => {
    setCurrentCourseIndex(prev => {
      const newIndex = direction === 'next' 
        ? Math.min(prev + 1, enrolledCourses.length - 1)
        : Math.max(prev - 1, 0);
      
      const selected = enrolledCourses[newIndex];
      setSelectedCourse(selected);
      transformLectures(selected);
      return newIndex;
    });
  };
  const handleCheckLecture = () => {
    console.log('Check Online Lecture');
    // Add logic to check for live lecture
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'attended': return styles.attendedRow;
      case 'missed': return styles.missedRow;
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'attended': return <CheckCircleIcon className={styles.attendedIcon} />;
      case 'missed': return <CancelIcon className={styles.missedIcon} />;
      default: return <AccessTimeIcon className={styles.upcomingIcon} />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!enrolledCourses.length) return <div>No enrolled courses found</div>;

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
          <button 
            className={styles.navButton} 
            onClick={() => handleCourseNavigation('prev')}
            disabled={currentCourseIndex === 0}
          >
            <ChevronLeftIcon />
          </button>
          
          <div className={styles.courseInfo}>
            <h3 className={styles.courseName}>
              {selectedCourse?.name || 'Select Course'}
            </h3>
            <p className={styles.courseLabel}>
              {currentCourseIndex + 1} of {enrolledCourses.length} courses
            </p>
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={() => handleCourseNavigation('next')}
            disabled={currentCourseIndex === enrolledCourses.length - 1}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div className={styles.scheduleSection}>
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleTitle}>
            <h3>Lecture Schedule</h3>
            <p>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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
            {lectures.map((lecture) => (
              <tr key={lecture.id} className={getStatusClass(lecture.status)}>
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