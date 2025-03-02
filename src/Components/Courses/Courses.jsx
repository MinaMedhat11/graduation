import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Courses.module.css';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for my courses
  const myCourses = [
    {
      id: 1,
      title: 'Back-End Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/backend.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 29.0,
      free: true
    },
    {
      id: 2,
      title: 'Network Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/networking.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 35.0,
      free: true
    },
    {
      id: 3,
      title: 'AI Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/ai.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 35.0,
      free: true
    }
  ];
  
  // Sample data for all courses
  const allCourses = [
    {
      id: 4,
      title: 'data science Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/datascience.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 29.0,
      free: false
    },
    {
      id: 5,
      title: 'Flutter Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/flutter.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 29.0,
      free: false
    },
    {
      id: 6,
      title: 'Cyber Security Course',
      subtitle: "Beginner's Guide To Becoming A Professional Backend Developer",
      image: '/images/cybersecurity.jpg',
      rating: 4.6,
      lessons: 10,
      duration: '19h 30m',
      students: 32,
      price: 29.0,
      free: false
    }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.coursesContent}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search ..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton}>
              <i className="fa-solid fa-search"></i>
            </button>
            <button className={styles.filterButton}>
              <i className="fa-solid fa-filter"></i>
            </button>
          </div>
          
          {/* My Courses Section */}
          <section className={styles.coursesSection}>
            <h2 className={styles.sectionTitle}>My Courses</h2>
            
            <div className={styles.coursesGrid}>
              {myCourses.map(course => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseImage}>
                    <img src={course.image} alt={course.title} />
                  </div>
                  
                  <div className={styles.courseContent}>
                    <div className={styles.courseRating}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                      <span>({course.rating})</span>
                    </div>
                    
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseSubtitle}>{course.subtitle}</p>
                    
                    <div className={styles.courseDetails}>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-book"></i>
                        <span>Lesson {course.lessons}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-regular fa-clock"></i>
                        <span>{course.duration}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-user"></i>
                        <span>Students {course.students}</span>
                      </div>
                    </div>
                    
                    <div className={styles.courseFooter}>
                      <div className={styles.coursePrice}>
                        {course.free ? (
                          <>
                            <span className={styles.originalPrice}>${course.price.toFixed(0)}</span>
                            <span className={styles.freeLabel}>Free</span>
                          </>
                        ) : (
                          <span className={styles.priceLabel}>${course.price.toFixed(0)}</span>
                        )}
                      </div>
                      <Link to={`/course/${course.id}`} className={styles.viewMoreButton}>View More</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* All Courses Section */}
          <section className={styles.coursesSection}>
            <h2 className={styles.sectionTitle}>All Courses</h2>
            
            <div className={styles.coursesGrid}>
              {allCourses.map(course => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseImage}>
                    <img src={course.image} alt={course.title} />
                  </div>
                  
                  <div className={styles.courseContent}>
                    <div className={styles.courseRating}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                      <span>({course.rating})</span>
                    </div>
                    
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseSubtitle}>{course.subtitle}</p>
                    
                    <div className={styles.courseDetails}>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-book"></i>
                        <span>Lesson {course.lessons}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-regular fa-clock"></i>
                        <span>{course.duration}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-user"></i>
                        <span>Students {course.students}</span>
                      </div>
                    </div>
                    
                    <div className={styles.courseFooter}>
                      <div className={styles.coursePrice}>
                        {course.free ? (
                          <>
                            <span className={styles.originalPrice}>${course.price.toFixed(0)}</span>
                            <span className={styles.freeLabel}>Free</span>
                          </>
                        ) : (
                          <span className={styles.priceLabel}>${course.price.toFixed(0)}</span>
                        )}
                      </div>
                      <Link to={`/course/${course.id}`} className={styles.viewMoreButton}>View More</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 