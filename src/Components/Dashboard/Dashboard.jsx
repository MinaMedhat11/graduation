import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [courses, setCourses] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [selectedRankingCourse, setSelectedRankingCourse] = useState('Introduction to Programming');

  // Static ranking data
  const rankingCourses = [
    'Introduction to Programming',
    'Database Systems', 
    'Data Structures & Algorithms'
  ];

  const rankingData = {
    'Introduction to Programming': {
      currentUserRank: 1,
      currentUserName: 'You',
      rankings: [
        { rank: 1, name: 'You', points: 2450, badge: 'gold' },
        { rank: 2, name: 'Ahmed Mohamed', points: 2380, badge: 'silver' },
        { rank: 3, name: 'Sara Ali', points: 2290, badge: 'bronze' },
        { rank: 4, name: 'Omar Hassan', points: 2180, badge: null }
      ]
    },
    'Database Systems': {
      currentUserRank: 4,
      currentUserName: 'You',
      rankings: [
        { rank: 1, name: 'Mina Adel', points: 1950, badge: 'gold' },
        { rank: 2, name: 'Youssef Ibrahim', points: 1880, badge: 'silver' },
        { rank: 3, name: 'Nour El-Din', points: 1820, badge: 'bronze' },
        { rank: 4, name: 'You', points: 1750, badge: null }
      ]
    },
    'Data Structures & Algorithms': {
      currentUserRank: 18,
      currentUserName: 'You',
      rankings: [
        { rank: 1, name: 'Khaled Mostafa', points: 3200, badge: 'gold' },
        { rank: 2, name: 'Aya Mahmoud', points: 3150, badge: 'silver' },
        { rank: 3, name: 'Mohamed Farid', points: 3100, badge: 'bronze' },
        { rank: 18, name: 'You', points: 2100, badge: null }
      ]
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://127.0.0.1:8000/api/dashboard-student', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // تأكد من أن البيانات هي مصفوفة. إذا كانت كائنًا، قم بتحويلها إلى مصفوفة
            const coursesArray = Array.isArray(data.data) ? data.data :
              (data.data.courses ? data.data.courses :
                (Object.values(data.data).filter(item => item && typeof item === 'object')));
            setCourses(coursesArray);
            // استخراج overall_percentage إذا كان موجودًا
            if (data.data.overall_percentage !== undefined) {
              setOverallPercentage(data.data.overall_percentage);
            } else if (data.overall_percentage !== undefined) {
              setOverallPercentage(data.overall_percentage);
            }
          }
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, []);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '';
    }
  };

  const getCurrentRankingData = () => {
    return rankingData[selectedRankingCourse] || rankingData['Introduction to Programming'];
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.dashboardContent}>
          {/* Main Dashboard Cards */}
          <div className={styles.dashboardCards}>

 {/* Course Ranking Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Course Ranking</h3>
              <div className={styles.rankingContainer}>
                <div className={styles.rankingHeader}>
                  <div className={styles.rankingType}>
                    <span className={styles.rankingIndicator}>🏆</span>
                    <span>Your Position</span>
                  </div>
                  <div className={styles.courseSelector}>
                    <select
                      value={selectedRankingCourse}
                      onChange={(e) => setSelectedRankingCourse(e.target.value)}
                      className={styles.courseSelect}
                    >
                      {rankingCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.currentRankDisplay}>
                  <div className={styles.userRankBadge}>
                    <span className={styles.rankNumber}>#{getCurrentRankingData().currentUserRank}</span>
                    <span className={styles.rankLabel}>Your Rank</span>
                  </div>
                </div>

                <div className={styles.rankingList}>
                  {getCurrentRankingData().rankings.map((student, index) => (
                    <div 
                      key={index} 
                      className={`${styles.rankingItem} ${student.name === 'You' ? styles.currentUser : ''}`}
                    >
                      <div className={styles.rankInfo}>
                        <span className={styles.rankPosition}>
                          {getBadgeIcon(student.badge)} #{student.rank}
                        </span>
                        <span className={styles.studentName}>{student.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  {getCurrentRankingData().currentUserRank > 4 && (
                    <div className={styles.rankingGap}>
                      <span className={styles.gapIndicator}>...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* Assignment Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Assignment</h3>
              <div className={styles.taskProgressContainer}>
                <h4 className={styles.sectionTitle}>Task Progress</h4>
                {Array.isArray(courses) && courses.map((course) => {
                  if (course && course.total_assignments_count > 0) {
                    const progress = (course.submitted_assignments_count / course.total_assignments_count) * 100;
                    return (
                      <div key={course.course_id} className={styles.taskItem}>
                        <div className={styles.taskInfo}>
                          <span className={styles.taskTitle}>{course.course_name}</span>
                          <span className={styles.taskCompletion}>
                            {course.submitted_assignments_count}/{course.total_assignments_count}
                          </span>
                        </div>
                        <div className={styles.progressBarContainer}>
                          <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
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
                  You don&apos;t have any pending invoices. If any to be issued later you would find them here.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Watching Section */}
          <div className={styles.continueWatchingSection}>
            <h3 className={styles.sectionTitle}>Continue Watching</h3>
            <div className={styles.watchingGrid}>
              {/* تأكد من أن courses هو مصفوفة قبل استخدام map */}
              {Array.isArray(courses) && courses.map((course) => {
                if (course && course.course_id) {
                  return (
                    <div key={course.course_id} className={styles.watchingCard}>
                      <div className={styles.watchingThumbnail}>
                        <img
                          src={course.course_image || '/placeholder-image.jpg'}
                          alt={course.course_name}
                          className={styles.thumbnailImage}
                        />
                      </div>
                      <div className={styles.watchingInfo}>
                        <h4 className={styles.watchingTitle}>{course.course_name}</h4>
                      </div>
                      <Link to={`/course/${course.course_id}`} className={styles.linkButton}>
                        Go to Course
                      </Link>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}