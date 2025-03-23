import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Courses.module.css';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/courses/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

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

          {/* Courses Section */}
          <section className={styles.coursesSection}>
            <h2 className={styles.sectionTitle}>Available Courses</h2>

            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseImage}>
                    <img src={course.course_image} alt={course.name} />
                  </div>

                  <div className={styles.courseContent}>
                    <div className={styles.courseRating}>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={
                            i < Math.floor(course.rating)
                              ? 'fa-solid fa-star'
                              : 'fa-regular fa-star'
                          }
                        ></i>
                      ))}
                      <span>({course.rating})</span>
                    </div>

                    <h3 className={styles.courseTitle}>{course.name}</h3>
                    <p className={styles.courseSubtitle}>{course.description}</p>

                    <div className={styles.courseDetails}>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-book"></i>
                        <span>Lessons {course.lessons_number}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-regular fa-clock"></i>
                        <span>{course.course_hours} Hours</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-user"></i>
                        <span>Students: {course.students || 0}</span>
                      </div>
                    </div>

                    <div className={styles.courseFooter}>
                      <div className={styles.coursePrice}>
                        {course.discount > 0 ? (
                          <>
                            <span className={styles.originalPrice}>
                              ${course.price.toFixed(0)}
                            </span>
                            <span className={styles.discountedPrice}>
                              ${(
                                course.price -
                                (course.price * course.discount) / 100
                              ).toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <span className={styles.priceLabel}>
                            ${course.price.toFixed(0)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/course/${course.id}`}
                        className={styles.viewMoreButton}
                      >
                        View More
                      </Link>
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
