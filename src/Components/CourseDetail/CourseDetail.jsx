import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import styles from './CourseDetail.module.css';


export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedSections, setExpandedSections] = useState({});
  const [courseData, setCourseData] = useState(null);
  const [courseProgress, setCourseProgress] = useState(15); // Default 15% progress for mock
  const [isEnrolled, setIsEnrolled] = useState(false); // Track if user is enrolled in course
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Check if user is enrolled in this course
        // In a real application, this would be determined by API response
        setIsEnrolled(response.data.enrolled || false);
        
        // Add mock sections and lectures if they don't exist
        const courseWithSections = {
          ...response.data,
          sections: response.data.sections || [
            {
              id: 1,
              title: "Introduction to the Course",
              lectures: [
                { id: 101, title: "Course Overview", duration: "10 min", completed: true },
                { id: 102, title: "Setting Up Your Environment", duration: "15 min", completed: true }
              ]
            },
            {
              id: 2,
              title: "Core Concepts",
              lectures: [
                { id: 201, title: "Understanding the Basics", duration: "20 min", completed: false },
                { id: 202, title: "First Practice Exercise", duration: "25 min", completed: false },
                { id: 203, title: "Advanced Techniques", duration: "18 min", completed: false }
              ]
            },
            {
              id: 3,
              title: "Practical Applications",
              lectures: [
                { id: 301, title: "Real-world Example", duration: "22 min", completed: false },
                { id: 302, title: "Building Your First Project", duration: "30 min", completed: false },
                { id: 303, title: "Troubleshooting Common Issues", duration: "15 min", completed: false }
              ]
            }
          ]
        };
        
        setCourseData(courseWithSections);
        
        // Initialize expanded sections
        const sectionsObj = {};
        if (courseWithSections.sections) {
          courseWithSections.sections.forEach(section => {
            sectionsObj[section.id] = false;
          });
          // Expand the first section by default
          if (courseWithSections.sections.length > 0) {
            sectionsObj[courseWithSections.sections[0].id] = true;
          }
        }
        setExpandedSections(sectionsObj);
        
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [id]);

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
      // Navigate to the first lecture
      const firstLecture = courseData.sections[0].lectures[0];
      navigate(`/course/${id}/lecture/${firstLecture.id}`);
    } else {
      console.error('No lectures available to start the course');
    }
  };
  
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

  if (!courseData) {
    return <Loading />;
  }
  return (
    <div className={styles.courseDetailContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>

      <div className={styles.mainContent}>
        <Header />

        <div className={styles.courseDetailContent}>          {/* Course Banner */}
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
                      <i key={i} className={`fa-solid fa-star ${i < 4 ? styles.starFilled : ''}`}></i>
                    ))}
                    <span className={styles.ratingText}>4.8</span>
                    <span className={styles.reviewCount}>(120 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.instructorBadge}>
                <img 
                  src={courseData.instructor?.image || "https://via.placeholder.com/40x40?text=Instructor"}
                  alt={courseData.instructor?.name || "Instructor"}
                  className={styles.instructorAvatar}
                />
                <span>{courseData.instructor?.name || 'John Doe'}</span>
              </div>
              
              <p className={styles.courseDescription}>{courseData.description}</p>              {/* Progress bar - only show if enrolled */}
              {isEnrolled && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressInfo}>
                    <span>Your progress</span>
                    <span>{courseProgress}% complete</span>
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
                /* Continue button if enrolled */
                <button 
                  className={styles.continueButton}
                  onClick={courseProgress > 0 ? continueCourse : startCourse}
                >
                  <span>{courseProgress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                /* Enroll button if not enrolled */
                <button 
                  className={`${styles.continueButton} ${styles.enrollButton}`}
                  onClick={() => navigate('/checkout')}
                >
                  <span>Enroll Now</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>          {/* Course Stats */}
          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-book"></i>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{getTotalLectures()}</div>
                <div className={styles.statLabel}>Lectures</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-clock"></i>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{getTotalDuration()}</div>
                <div className={styles.statLabel}>Total Duration</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-signal"></i>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{courseData.course_level || 'Beginner'}</div>
                <div className={styles.statLabel}>Course Level</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-tag"></i>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{courseData.price} EGP</div>
                <div className={styles.statLabel}>Course Price</div>
              </div>
            </div>
          </div>{/* Course Tabs */}
          <div className={styles.courseTabs}>
            {['overview', 'content', 'instructor', 'reviews', 'certificates'].map((tab) => (
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
                
                <div className={styles.whatYouLearn}>
                  <h3>What You Will Learn</h3>
                  <ul className={styles.outcomeList}>
                    {(courseData.outcomes || [
                      { id: 1, outcome: "Build professional mobile applications using Flutter" },
                      { id: 2, outcome: "Create responsive user interfaces with Flutter widgets" },
                      { id: 3, outcome: "Implement navigation and routing in Flutter apps" },
                      { id: 4, outcome: "Connect your app to databases and APIs" }
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
                    {(courseData.requirements || [
                      "Basic programming knowledge in any language",
                      "A computer that can run Android Studio or Xcode",
                      "No prior Flutter experience required"
                    ]).map((req, index) => (
                      <li key={index} className={styles.requirementItem}>
                        <i className="fa-solid fa-circle-dot"></i> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className={styles.contentTabContent}>
                <div className={styles.contentHeader}>
                  <h3>Course Content</h3>
                  <div className={styles.contentSummary}>
                    <span>{getTotalLectures()} lectures</span>
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
                            onClick={() => navigate(`/course/${id}/lecture/${lecture.id}`)}
                          >
                            <div className={styles.lectureInfo}>
                              <div className={styles.lectureStatus}>
                                {lecture.completed ? (
                                  <i className="fa-solid fa-circle-check"></i>
                                ) : (
                                  <i className="fa-regular fa-circle-play"></i>
                                )}
                              </div>
                              <div>
                                <h5 className={styles.lectureTitle}>{lecture.title}</h5>
                                <span className={styles.lectureDuration}>
                                  <i className="fa-regular fa-clock"></i> {lecture.duration}
                                </span>
                              </div>
                            </div>
                            <button className={styles.lectureButton}>
                              {lecture.completed ? 'Replay' : 'Start'}
                            </button>
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
                    <h4 className={styles.instructorName}>{courseData.instructor?.name || "John Doe"}</h4>
                    <p className={styles.instructorTitle}>{courseData.instructor?.title || "Senior Developer & Educator"}</p>
                    
                    <div className={styles.instructorStats}>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-star"></i>
                        <span>4.8 Instructor Rating</span>
                      </div>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-certificate"></i>
                        <span>12 Courses</span>
                      </div>
                      <div className={styles.instructorStat}>
                        <i className="fa-solid fa-users"></i>
                        <span>1,205 Students</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.instructorBio}>
                  <p>{courseData.instructor?.bio || "An experienced educator with extensive knowledge in the field. Has been teaching and developing courses for over 5 years with excellent student feedback."}</p>
                </div>
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsContent}>
                <h3>Student Reviews</h3>
                <div className={styles.reviewsSummary}>
                  <div className={styles.overallRating}>
                    <div className={styles.ratingNumber}>4.8</div>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fa-solid fa-star ${i < 4 ? styles.starFilled : ''}`}
                        ></i>
                      ))}
                    </div>
                    <div className={styles.ratingCount}>125 ratings</div>
                  </div>
                  
                  <div className={styles.ratingBars}>
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className={styles.ratingBar}>
                        <span>{stars}</span>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.bar} 
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%` }}
                          ></div>
                        </div>
                        <span>{stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.reviewsList}>
                  {[
                    { id: 1, name: "Sarah Johnson", date: "2 weeks ago", rating: 5, comment: "This course exceeded my expectations! The content is well organized and the instructor explains complex concepts clearly." },
                    { id: 2, name: "Michael Rodriguez", date: "1 month ago", rating: 4, comment: "Great course overall. Very informative and practical examples, but some parts could be more in-depth." }
                  ].map(review => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAuthor}>
                          <div className={styles.authorInitial}>{review.name[0]}</div>
                          <div>
                            <div className={styles.authorName}>{review.name}</div>
                            <div className={styles.reviewDate}>{review.date}</div>
                          </div>
                        </div>
                        <div className={styles.reviewRating}>
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${i < review.rating ? styles.starFilled : ''}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className={styles.reviewComment}>{review.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className={styles.certificatesContent}>
                <h3>Course Certificate</h3>
                <div className={styles.certificateInfo}>
                  <img 
                    src="/images/certificate-sample.jpg" 
                    alt="Sample Certificate"
                    className={styles.certificateImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Certificate+Sample';
                    }}
                  />
                  <div className={styles.certificateDescription}>
                    <p>Upon successful completion of all course modules and assignments, you will receive a certificate of completion. This certificate can be added to your LinkedIn profile or resume.</p>
                    <div className={styles.certificateRequirements}>
                      <h4>Requirements for Certificate:</h4>
                      <ul>
                        <li>Complete 100% of course lectures</li>
                        <li>Submit all required assignments</li>
                        <li>Pass the final assessment with a score of 70% or higher</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
