import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Loading from '../Loading/Loading';
import styles from './Courses.module.css';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myCoursesPage, setMyCoursesPage] = useState(1);
  const [hasMoreMyCourses, setHasMoreMyCourses] = useState(false);
  const [myCoursesTotalPages, setMyCoursesTotalPages] = useState(1);

  // Function to fetch courses including pagination
  const fetchCourses = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/all-courses?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Extract course data
      const allCoursesData = response.data.data.allCourses.data;
      const myCoursesData = response.data.data.myCourses.data;
      
      // Set pagination info for My Courses
      setMyCoursesTotalPages(response.data.data.myCourses.last_page);
      setHasMoreMyCourses(response.data.data.myCourses.current_page < response.data.data.myCourses.last_page);
      
      if (page === 1) {
        // First page - set the data directly
        setAllCourses(allCoursesData);
        setMyCourses(myCoursesData);
   
        
      } else {
        // Additional pages - append to existing data
        setMyCourses(prev => [...prev, ...myCoursesData]);
      }
      
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Load more my courses when the page changes
  useEffect(() => {
    if (myCoursesPage > 1) {
      fetchCourses(myCoursesPage);
    }
  }, [myCoursesPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMoreMyCourses = () => {
    if (hasMoreMyCourses) {
      setMyCoursesPage(prev => prev + 1);
    }
  };

  const renderCoursesSection = (courses, title, showLoadMore = false) => (
    <section className={styles.coursesSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {courses.length === 0 ? (
        <div className={styles.noCourses}>
          <p>No courses available in this section.</p>
        </div>
      ) : (
        <>
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
                      <span>Students: {course.students_count || 0}</span>
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
                      state={{ isEnrolled: title === 'My Courses' }}
                    >
                      View More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {showLoadMore && hasMoreMyCourses && (
            <div className={styles.loadMoreContainer}>
              <button onClick={loadMoreMyCourses} className={styles.loadMoreButton}>
                Load More Courses
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
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
          
          {/* My Courses Section - always render this section */}
          {renderCoursesSection(myCourses, 'My Courses', true)}
          
          {/* All Courses Section - always render this section */}
          {renderCoursesSection(allCourses, 'All Courses')}
        </div>
      </div>
    </div>
  );
}