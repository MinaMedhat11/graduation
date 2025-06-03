import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import styles from './CourseDetail.module.css';

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('overview'); // Default to 'overview'
  const [expandedSections, setExpandedSections] = useState({});
  const [courseData, setCourseData] = useState(null);
  const [courseProgress, setCourseProgress] = useState(15);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Check enrollment status
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!id) return; // Don't run if id is not available yet
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsEnrolled(false); // If no token, assume not enrolled
          return;
        }
        const response = await axios.get(`http://127.0.0.1:8000/api/all-courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Enrollment check response:', response.data);
        
        if (response.data.success === true) {
          setIsEnrolled(true);
          // If enrolled and activeTab was 'content', keep it. Otherwise, if it was the default and user is enrolled, switch to 'content'.
          // If not enrolled, and activeTab was 'content', switch to 'overview'.
          setActiveTab(prevTab => (prevTab === 'content' ? 'content' : 'overview'));
        } else {
          setIsEnrolled(false);
          // If not enrolled and activeTab is 'content', switch to 'overview'
          setActiveTab(prevTab => (prevTab === 'content' ? 'overview' : prevTab));
        }
      } catch (error) {
        console.error('Error checking enrollment status:', error);
        setIsEnrolled(false);
        setActiveTab(prevTab => (prevTab === 'content' ? 'overview' : prevTab));
      }
    };

    checkEnrollmentStatus();
  }, [id]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      try {
        setLoading(true); // Ensure loading is true at the start of fetch
        const token = localStorage.getItem('token');
        // Fetch course info
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // Send token only if available
        });
        const courseItem = response.data.data.find((course) => course.id === parseInt(id));
        if (!courseItem) {
          console.error('Course not found');
          setCourseData(null); // Set courseData to null if not found
          setLoading(false);
          return;
        }

        // Fetch course content (only if enrolled or if content is needed for public view)
        // For now, we fetch it anyway, but display depends on enrollment
        const contentRes = await axios.get(`http://127.0.0.1:8000/api/course-content/course/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const contentData = contentRes.data.data;

        // Group lectures by section
        const sectionsMap = {};
        if (contentData && Array.isArray(contentData)) {
          contentData.forEach((item) => {
            const sectionId = item.section.id;
            if (!sectionsMap[sectionId]) {
              sectionsMap[sectionId] = {
                id: item.section.id,
                title: item.section.title,
                lectures: [],
                order: item.section.order || 0
              };
            }
            sectionsMap[sectionId].lectures.push({
              id: item.id,
              title: item.title,
              duration: `${item.duration} min`,
              completed: false,
              type: item.type,
              video_url: item.video_url,
              is_free: item.is_free,
              quiz_data: item.quiz_data ? JSON.parse(item.quiz_data) : null,
              order: item.order || 0 // Make sure lectures have order
            });
          });
        }


        // Convert sectionsMap to array and sort by order
        const sections = Object.values(sectionsMap).sort((a, b) => a.order - b.order);

        // Sort lectures inside each section by `order`
        sections.forEach(section => {
          section.lectures.sort((a, b) => a.order - b.order);
        });

        const courseWithSections = { ...courseItem, sections };
        setCourseData(courseWithSections);

        // Initialize sections open state
        const sectionsObj = {};
        if (sections.length > 0) {
          sections.forEach(section => {
            sectionsObj[section.id] = false;
          });
          // Open first section only if sections exist and user is enrolled or if it's a general view.
          // For now, always open first if sections exist.
          if (sections[0]) {
            sectionsObj[sections[0].id] = true; 
          }
        }
        setExpandedSections(sectionsObj);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setCourseData(null); // Set courseData to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);
  
  // Adjust activeTab if 'content' is selected but user is not enrolled
  useEffect(() => {
    if (!isEnrolled && activeTab === 'content') {
      setActiveTab('overview');
    }
    // If user becomes enrolled and active tab was 'overview' (or some default), consider switching to 'content'
    // For now, we let the user click.
  }, [isEnrolled, activeTab]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const startCourse = () => {
    if (courseData && courseData.sections && courseData.sections.length > 0 &&
      courseData.sections[0].lectures && courseData.sections[0].lectures.length > 0) {
      const firstLecture = courseData.sections[0].lectures[0];
      navigate(`/course/${id}/lecture/${firstLecture.id}`);
    } else {
      console.error('No lectures available to start the course');
    }
  };

  // ... (rest of the functions: continueCourse, getTotalLectures, getTotalDuration remain the same)
  const continueCourse = () => {
    // Find first incomplete lecture or the last completed lecture
    if (courseData && courseData.sections) {
      // First try to find an incomplete lecture
      for (const section of courseData.sections) {
        for (const lecture of section.lectures) {
          if (!lecture.completed) {
            navigate(`/course/${id}/lecture/${lecture.id}`);
            return;
          }
        }
      }
      // If all lectures are completed, go to the last one
      if (courseData.sections.length > 0) {
        const lastSection = courseData.sections[courseData.sections.length - 1];
        if (lastSection.lectures && lastSection.lectures.length > 0) {
          const lastLecture = lastSection.lectures[lastSection.lectures.length - 1];
          navigate(`/course/${id}/lecture/${lastLecture.id}`);
        }
      }
    }
  };
  // Calculate total lectures
  const getTotalLectures = () => {
    if (!courseData || !courseData.sections) return 0;
    return courseData.sections.reduce(
      (total, section) => total + (section.lectures ? section.lectures.length : 0),
      0
    );
  };
  // Calculate total duration
  const getTotalDuration = () => {
    if (!courseData || !courseData.sections) return '0h 0m';
    let totalMinutes = 0;
    courseData.sections.forEach(section => {
      if (section.lectures) {
        section.lectures.forEach(lecture => {
          if (lecture.duration) {
            const minutes = parseInt(lecture.duration.split(' ')[0], 10);
            if (!isNaN(minutes)) {
              totalMinutes += minutes;
            }
          }
        });
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };


  if (loading) { // Show loading until all initial data (course & enrollment) is fetched
    return <Loading />;
  }

  if (!courseData) { // If course data fetch failed or course not found
    return (
      <div className={styles.courseDetailContainer}>
        <div className={styles.sidebarWrapper}><Sidebar /></div>
        <div className={styles.mainContent}>
          <Header />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Course Not Found</h2>
            <p>The course you are looking for does not exist or could not be loaded.</p>
            <Link to="/courses" className={styles.continueButton}>Back to Courses</Link>
          </div>
        </div>
      </div>
    );
  }
  
  const availableTabs = ['overview', 'instructor', 'reviews', 'certificates'];
  if (isEnrolled) {
    availableTabs.splice(1, 0, 'content'); // Insert 'content' tab at index 1 if enrolled
  }


  return (
    <div className={styles.courseDetailContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.courseDetailContent}>
          {/* Course Banner */}
          <div className={styles.courseBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.courseCategory}>
                <span>{courseData.category || 'Development'}</span>
              </div>
              <div className={styles.bestCourses}>
                <span>Featured Course</span>
              </div>
              <div className={styles.courseImage}>
                <img
                  src={courseData.course_image}
                  alt={courseData.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x300?text=Course+Image';
                  }}
                />
              </div>
            </div>
            <div className={styles.bannerRight}>
              <div className={styles.courseHeader}>
                <h1 className={styles.courseHeading}>{courseData.name}</h1>
                <div className={styles.courseRatingBlock}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < Math.floor(courseData.rating || 0) ? styles.starFilled : ''}`}></i>
                    ))}
                    <span className={styles.ratingText}>{courseData.rating || 0}</span>
                    <span className={styles.reviewCount}>({courseData.reviews_count || 0} reviews)</span>
                  </div>
                </div>
              </div>
              <div className={styles.instructorBadge}>
                <img
                  src={courseData.instructor?.image || "https://via.placeholder.com/40x40?text=Instructor"}
                  alt={courseData.instructor?.name || "Instructor"}
                  className={styles.instructorAvatar}
                />
                <span>{courseData.instructor?.name || "N/A"}</span>
              </div>
              <p className={styles.courseDescription}>{courseData.description}</p>
              {/* Price display with discount calculation */}
              <div className={styles.coursePrice}>
                {courseData.discount > 0 ? (
                  <>
                    <span className={styles.originalPrice}>{courseData.price} EGP</span>
                    <span className={styles.discountedPrice}>
                      {(courseData.price - (courseData.price * courseData.discount / 100)).toFixed(0)} EGP
                    </span>
                    <span className={styles.discountBadge}>-{courseData.discount}%</span>
                  </>
                ) : (
                  <span className={styles.priceNoDiscount}>{courseData.price} EGP</span>
                )}
              </div>
              {/* Progress bar - only show if enrolled */}
              {isEnrolled && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressInfo}>
                    <span>Your progress</span>
                    <span>{courseProgress}% complete</span> {/* This should come from API later */}
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progress}
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
          
              {isEnrolled ? (
                <button
                  className={styles.continueButton}
                  onClick={startCourse} // Or continueCourse based on actual progress
                >
                  <span>{courseProgress > 0 ? 'Continue Study' : 'Start Study'}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <button
                  className={`${styles.continueButton} ${styles.enrollButton}`}
                  onClick={() => navigate('/checkout', { state: { courseId: parseInt(id) } })}
                >
                  <span>Enroll Now</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
          
          {/* Course Stats */}
          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><i className="fa-solid fa-book"></i></div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{courseData.lessons_number || getTotalLectures()}</div>
                <div className={styles.statLabel}>Lectures</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><i className="fa-solid fa-clock"></i></div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{courseData.course_hours || getTotalDuration()}</div>
                <div className={styles.statLabel}>Total Duration</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><i className="fa-solid fa-signal"></i></div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{courseData.course_level || "N/A"}</div>
                <div className={styles.statLabel}>Course Level</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><i className="fa-solid fa-tag"></i></div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {courseData.discount > 0
                    ? `${(courseData.price - (courseData.price * courseData.discount / 100)).toFixed(0)}`
                    : courseData.price} EGP
                </div>
                <div className={styles.statLabel}>Course Price</div>
              </div>
            </div>
          </div>

          {/* Course Tabs */}
          <div className={styles.courseTabs}>
            {availableTabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content Container */}
          <div className={styles.courseContentContainer}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>
                <h3>Course Overview</h3>
                <p>{courseData.description}</p>
                <p>{courseData.bio}</p> {/* Assuming 'bio' might be additional overview */}
                <div className={styles.whatYouLearn}>
                  <h3>What You Will Learn</h3>
                  <ul className={styles.outcomeList}>
                    {(courseData.outcomes && courseData.outcomes.length > 0 ? courseData.outcomes : [
                      { id: 1, outcome: "Build professional mobile applications using Flutter" },
                      { id: 2, outcome: "Create responsive user interfaces with Flutter widgets" },
                    ]).map((outcome) => (
                      <li key={outcome.id} className={styles.outcomeItem}>
                        <i className="fa-solid fa-check-circle"></i> {outcome.outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.requirements}>
                  <h3>Requirements</h3>
                  <ul className={styles.requirementsList}>
                    {(courseData.requirements && courseData.requirements.length > 0 ? courseData.requirements : [
                      "Basic programming knowledge in any language",
                    ]).map((req, index) => (
                      <li key={index} className={styles.requirementItem}>
                        <i className="fa-solid fa-circle-dot"></i> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Content Tab - Only render if isEnrolled and activeTab is 'content' */}
            {isEnrolled && activeTab === 'content' && (
              <div className={styles.contentTabContent}>
                <div className={styles.contentHeader}>
                  <h3>Course Content</h3>
                  <div className={styles.contentSummary}>
                    <span>{courseData.sections?.reduce((acc, section) => acc + section.lectures.length, 0) || 0} lectures</span>
                    <span>{getTotalDuration()} total length</span>
                  </div>
                </div>
                {courseData.sections && courseData.sections.map((section) => (
                  <div key={section.id} className={styles.lectureSection}>
                    <div
                      className={styles.lectureHeader}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className={styles.headerLeft}>
                        <i className={`fa-solid ${expandedSections[section.id] ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                        <h4>{section.title}</h4>
                      </div>
                      <div className={styles.headerRight}>
                        <span>{section.lectures.length} lectures</span>
                      </div>
                    </div>
                    {expandedSections[section.id] && (
                      <div className={styles.lectureItems}>
                        {section.lectures.map((lecture, index) => (
                          <div
                            key={lecture.id}
                            className={`${styles.lectureItem} ${index % 2 === 1 ? styles.lectureItemEven : ''}`}
                            onClick={() => {
                              if (isEnrolled || lecture.is_free) {
                                navigate(`/course/${id}/lecture/${lecture.id}`);
                              } else {
                                // Optionally, prompt to enroll
                                alert("Please enroll to access this lecture.");
                              }
                            }}
                            style={{ cursor: (isEnrolled || lecture.is_free) ? 'pointer' : 'not-allowed' }}
                          >
                            <div className={styles.lectureInfo}>
                              <div className={styles.lectureStatus}>
                                {lecture.completed ? ( // This should come from user progress API
                                  <i className="fa-solid fa-circle-check"></i>
                                ) : (
                                  <i className={`fa-regular ${ (isEnrolled || lecture.is_free) ? 'fa-circle-play' : 'fa-lock'}`}></i>
                                )}
                              </div>
                              <div>
                                <h5 className={styles.lectureTitle}>{lecture.title}</h5>
                                <span className={styles.lectureDuration}>
                                  <i className="fa-regular fa-clock"></i> {lecture.duration}
                                </span>
                                {lecture.is_free && !isEnrolled && <span className={styles.freePreviewTag}>Free Preview</span>}
                              </div>
                            </div>
                            {(isEnrolled || lecture.is_free) &&
                              <button className={styles.lectureButton}>
                                {lecture.completed ? 'Replay' : 'Start'}
                              </button>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Instructor Tab */}
            {activeTab === 'instructor' && (
              <div className={styles.instructorCard}>
                <h3>Instructor</h3>
                <div className={styles.instructorProfile}>
                  <img
                    src={courseData.instructor?.image || "https://via.placeholder.com/100x100?text=Instructor"}
                    alt={courseData.instructor?.name || "Instructor"}
                    className={styles.instructorImage}
                  />
                  <div className={styles.instructorInfo}>
                    <h4 className={styles.instructorName}>{courseData.instructor?.name || "N/A"}</h4>
                    <p className={styles.instructorTitle}>{courseData.instructor?.role || "Instructor"}</p>
                    <div className={styles.instructorStats}>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-star"></i>
                        <span>{courseData.instructor?.rating || courseData.rating || 0} Instructor Rating</span>
                      </div>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-certificate"></i>
                        <span>{courseData.instructor?.courses_count || "Multiple"} Courses</span>
                      </div>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-users"></i>
                        <span>{courseData.instructor?.students_count || courseData.enrollments_count || 0} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.instructorBio}>
                  <p>{courseData.instructor?.bio || "No bio available."}</p>
                </div>
              </div>
            )}
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              // ... Reviews content (assuming it's mostly static or fetched separately)
              <div className={styles.reviewsContent}>
                <h3>Student Reviews</h3>
                {/* ... rest of reviews JSX ... */}
              </div>
            )}
            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              // ... Certificates content
              <div className={styles.certificatesContent}>
                <h3>Course Certificate</h3>
                {/* ... rest of certificates JSX ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}