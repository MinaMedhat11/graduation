import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [courses, setCourses] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);

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

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.dashboardContent}>
          {/* Main Dashboard Cards */}
          <div className={styles.dashboardCards}>
            {/* Assignment Card */}
            <div className={styles.dashboardCard}>
              <h3 className={styles.cardTitle}>Assignment</h3>
              <div className={styles.taskProgressContainer}>
                <h4 className={styles.sectionTitle}>Task Progress</h4>
                {/* تأكد من أن courses هو مصفوفة قبل استخدام map */}
                {Array.isArray(courses) && courses.map((course) => {
                  // تحقق من أن البيانات المطلوبة موجودة قبل الحساب
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
                  You don't have any pending invoices. If any to be issued later you would find them here.
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