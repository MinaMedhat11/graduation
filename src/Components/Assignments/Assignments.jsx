import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Assignments.module.css';

export default function Assignments() {
  // Sample data for assignments
  const allAssignments = [
    {
      id: 1,
      title: 'Create LAN Network',
      course: 'Advanced Course In Networks',
      dueDate: '12/1/2024',
      status: 'Progress',
      icon: 'fa-regular fa-clock'
    },
    {
      id: 2,
      title: 'oop training',
      course: 'Advanced Course In Networks',
      dueDate: '11/28/2024',
      status: 'Progress',
      icon: 'fa-regular fa-clock'
    },
    {
      id: 3,
      title: 'Create App',
      course: 'Advanced Course In Networks',
      dueDate: '12/19/2024',
      status: 'Pending',
      icon: 'fa-solid fa-exclamation-circle'
    },
    {
      id: 4,
      title: 'Create Local Network',
      course: 'Advanced Course In Networks',
      dueDate: '12/6/2024',
      status: 'Pending',
      icon: 'fa-solid fa-exclamation-circle'
    },
    {
      id: 5,
      title: 'IP address training',
      course: 'Advanced Course In Networks',
      dueDate: '12/4/2024',
      status: 'Done',
      icon: 'fa-solid fa-check-circle'
    },
    {
      id: 6,
      title: 'Data Types',
      course: 'Advanced Course In Networks',
      dueDate: '12/1/2024',
      status: 'Done',
      icon: 'fa-solid fa-check-circle'
    },
    {
      id: 7,
      title: 'Network Layers',
      course: 'Advanced Course In Networks',
      dueDate: '11/27/2024',
      status: 'Done',
      icon: 'fa-solid fa-check-circle'
    }
  ];

  // Sample data for quizzes
  const allQuizzes = [
    {
      id: 1,
      title: 'Create LAN Network',
      course: 'Advanced Course In Networks',
      dueDate: '12/1/2024',
      degree: '8/10'
    },
    {
      id: 2,
      title: 'IP address training',
      course: 'Advanced Course In Networks',
      dueDate: '11/28/2024',
      degree: '9/10'
    },
    {
      id: 3,
      title: 'IP address training',
      course: 'Advanced Course In Networks',
      dueDate: '12/19/2024',
      degree: '2/10'
    },
    {
      id: 4,
      title: 'Create Local Network',
      course: 'Advanced Course In Networks',
      dueDate: '12/6/2024',
      degree: '10/10'
    },
    {
      id: 5,
      title: 'IP address training',
      course: 'Advanced Course In Networks',
      dueDate: '12/4/2024',
      degree: '8/10'
    },
    {
      id: 6,
      title: 'Data Types',
      course: 'Advanced Course In Networks',
      dueDate: '12/1/2024',
      degree: '5/10'
    },
    {
      id: 7,
      title: 'Network Layers',
      course: 'Advanced Course In Networks',
      dueDate: '11/27/2024',
      degree: '4/10'
    }
  ];

  // State for filtering
  const [filter, setFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks');
  const [activeTab, setActiveTab] = useState('assignment');
  
  // Filter assignments based on selected filter
  const filteredAssignments = filter === 'all' 
    ? allAssignments 
    : allAssignments.filter(assignment => 
        filter === 'pending' 
          ? assignment.status === 'Pending' 
          : assignment.status === 'Completed'
      );

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    // Handle file drop logic here
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.assignmentsContainer}>
      <Sidebar />
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.assignmentsContent}>
          {/* My Courses Section */}
          <div className={styles.coursesSection}>
            <div className={styles.courseHeader}>
              <i className="fa-solid fa-book"></i>
              <h3>My Courses</h3>
            </div>
            
            <div className={styles.courseNavigation}>
              <button className={styles.navButton}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span>{selectedCourse}</span>
              <button className={styles.navButton}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            
            <div className={styles.courseSelector}>
              <span>Select Your Course</span>
            </div>
          </div>
          
          {/* Drop Assignment Section */}
          <div className={styles.dropSection}>
            <div 
              className={styles.dropZone}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className={styles.dropIcon}>
                <i className="fa-solid fa-clipboard-list"></i>
              </div>
              <h3>Please Drop Assignment Here</h3>
              <p>Or Click on the "Add" Button</p>
              
              <button className={styles.addButton}>ADD</button>
            </div>
          </div>
          
          {/* Assignment Section */}
          <div className={styles.assignmentSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <i className="fa-solid fa-clipboard-list"></i>
                <h2>{activeTab === 'quiz' ? 'Quiz' : 'Assignment'}</h2>
              </div>
            </div>
            
            {/* Assignment Tabs */}
            <div className={styles.assignmentTabs}>
              <div className={styles.tabsHeader}>
                <div 
                  className={activeTab === 'assignment' ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab('assignment')}
                >
                  Assignment
                </div>
                <div 
                  className={activeTab === 'quiz' ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab('quiz')}
                >
                  Quiz
                </div>
              </div>
              
              <div className={styles.tabNavigation}>
                <button className={styles.navButton}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className={styles.navButton}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'assignment' ? (
              /* Assignments Table */
              <div className={styles.tableContainer}>
                <table className={styles.assignmentsTable}>
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAssignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className={styles.assignmentCell}>
                          <i className={`${assignment.icon} ${styles.assignmentIcon}`}></i>
                          <span>{assignment.title}</span>
                        </td>
                        <td>{assignment.dueDate}</td>
                        <td>{assignment.course}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[`status${assignment.status}`]}`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Quiz Table */
              <div className={styles.tableContainer}>
                <table className={styles.assignmentsTable}>
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Degree</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allQuizzes.map((quiz) => (
                      <tr key={quiz.id}>
                        <td className={styles.assignmentCell}>
                          <span>{quiz.title}</span>
                        </td>
                        <td>{quiz.dueDate}</td>
                        <td>{quiz.course}</td>
                        <td>{quiz.degree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 