import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './VideoPlayer.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';

export default function VideoPlayer() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourseData(response.data);
        
        // Initialize expanded sections
        const sectionsState = {};
        if (response.data.sections) {
          response.data.sections.forEach((section) => {
            sectionsState[section.id] = false;
          });
          // Expand the section containing the current lecture
          if (lectureId) {
            const sectionWithLecture = response.data.sections.find(section => 
              section.lectures.some(lecture => lecture.id.toString() === lectureId)
            );
            if (sectionWithLecture) {
              sectionsState[sectionWithLecture.id] = true;
              
              // Set current lecture
              const lecture = sectionWithLecture.lectures.find(
                lecture => lecture.id.toString() === lectureId
              );
              setCurrentLecture(lecture);
              setCurrentSection(sectionWithLecture);
            }
          } else if (response.data.sections.length > 0 && 
                     response.data.sections[0].lectures && 
                     response.data.sections[0].lectures.length > 0) {
            // If no specific lecture is selected, start with the first one
            setCurrentSection(response.data.sections[0]);
            setCurrentLecture(response.data.sections[0].lectures[0]);
            sectionsState[response.data.sections[0].id] = true;
          }
        }
        setExpandedSections(sectionsState);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, lectureId]);

  // Handle section toggle
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Handle lecture selection
  const handleLectureSelect = (section, lecture) => {
    setCurrentSection(section);
    setCurrentLecture(lecture);
    // Update URL without reloading the page
    navigate(`/course/${courseId}/lecture/${lecture.id}`, { replace: true });
    
    // Reset video progress
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    
    // Mark lecture as started/in-progress
    updateLectureProgress(lecture.id, 'in-progress');
  };

  // Handle time update to track progress
  const handleTimeUpdate = () => {
    if (videoRef.current && currentLecture) {
      const progress = Math.floor((videoRef.current.currentTime / videoRef.current.duration) * 100);
      setProgress(progress);
      
      // Mark as completed if reached end (95% or more)
      if (progress >= 95) {
        updateLectureProgress(currentLecture.id, 'completed');
      }
    }
  };

  // Update lecture progress in DB or local storage
  const updateLectureProgress = (lectureId, status) => {
    // This would typically be an API call to update progress
    console.log(`Updating lecture ${lectureId} status to ${status}`);
    // For now, we'll just update the UI
    if (status === 'completed' && courseData) {
      const updatedCourseData = {...courseData};
      updatedCourseData.sections = courseData.sections.map(section => ({
        ...section,
        lectures: section.lectures.map(lecture => 
          lecture.id === lectureId 
            ? {...lecture, completed: true} 
            : lecture
        )
      }));
      setCourseData(updatedCourseData);
    }
  };

  // Handle video end
  const handleVideoEnded = () => {
    if (currentLecture) {
      updateLectureProgress(currentLecture.id, 'completed');
      
      // Find the next lecture to play
      const nextLecture = findNextLecture();
      if (nextLecture) {
        handleLectureSelect(nextLecture.section, nextLecture.lecture);
      }
    }
  };
  // Find the next lecture to play
  const findNextLecture = () => {
    if (!courseData || !currentSection || !currentLecture) return null;
    
    const currentSectionIndex = courseData.sections.findIndex(
      section => section.id === currentSection.id
    );
    
    if (currentSectionIndex === -1) return null;
    
    const currentLectureIndex = currentSection.lectures.findIndex(
      lecture => lecture.id === currentLecture.id
    );
    
    // Check if there's another lecture in the current section
    if (currentLectureIndex < currentSection.lectures.length - 1) {
      return {
        section: currentSection,
        lecture: currentSection.lectures[currentLectureIndex + 1]
      };
    }
    
    // Check if there's another section with lectures
    if (currentSectionIndex < courseData.sections.length - 1) {
      const nextSection = courseData.sections[currentSectionIndex + 1];
      if (nextSection.lectures && nextSection.lectures.length > 0) {
        return {
          section: nextSection,
          lecture: nextSection.lectures[0]
        };
      }
    }
    
    return null;
  };
  
  // Find the previous lecture to play
  const findPreviousLecture = () => {
    if (!courseData || !currentSection || !currentLecture) return null;
    
    const currentSectionIndex = courseData.sections.findIndex(
      section => section.id === currentSection.id
    );
    
    if (currentSectionIndex === -1) return null;
    
    const currentLectureIndex = currentSection.lectures.findIndex(
      lecture => lecture.id === currentLecture.id
    );
    
    // Check if there's a previous lecture in the current section
    if (currentLectureIndex > 0) {
      return {
        section: currentSection,
        lecture: currentSection.lectures[currentLectureIndex - 1]
      };
    }
    
    // Check if there's a previous section with lectures
    if (currentSectionIndex > 0) {
      const prevSection = courseData.sections[currentSectionIndex - 1];
      if (prevSection.lectures && prevSection.lectures.length > 0) {
        return {
          section: prevSection,
          lecture: prevSection.lectures[prevSection.lectures.length - 1]
        };
      }
    }
    
    return null;
  };

  // Calculate overall course progress
  const calculateCourseProgress = () => {
    if (!courseData || !courseData.sections) return 0;
    
    const allLectures = courseData.sections.flatMap(section => section.lectures);
    if (allLectures.length === 0) return 0;
    
    const completedLectures = allLectures.filter(lecture => lecture.completed).length;
    return Math.round((completedLectures / allLectures.length) * 100);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.videoPlayerContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>

      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.videoContent}>
          <div className={styles.videoSection}>
            {currentLecture ? (
              <>                <div className={styles.videoWrapper}>
                  <video
                    ref={videoRef}
                    className={styles.videoPlayer}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    src={currentLecture.video_url || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
                    poster={currentLecture.thumbnail || courseData.course_image}
                    controlsList="nodownload"
                  />
                  <div className={styles.playIcon}>
                    <i className="fa-solid fa-play"></i>
                  </div>
                  
                  <div className={styles.videoControls}>
                    <div className={styles.controlLeft}>
                      <div className={styles.previousLecture} onClick={() => {
                        const prevLecture = findPreviousLecture();
                        if (prevLecture) {
                          handleLectureSelect(prevLecture.section, prevLecture.lecture);
                        }
                      }}>
                        <i className="fa-solid fa-backward-step"></i>
                        <span>Previous</span>
                      </div>
                    </div>
                    
                    <div className={styles.controlRight}>
                      <div className={styles.nextLecture} onClick={() => {
                        const nextLecture = findNextLecture();
                        if (nextLecture) {
                          handleLectureSelect(nextLecture.section, nextLecture.lecture);
                        }
                      }}>
                        <span>Next</span>
                        <i className="fa-solid fa-forward-step"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.lectureInfo}>
                  <h2 className={styles.lectureTitle}>{currentLecture.title}</h2>
                  <div className={styles.lectureMetadata}>
                    <span className={styles.lectureSection}>
                      {currentSection ? currentSection.title : 'Section'} | 
                    </span>
                    <span className={styles.lectureDuration}>
                      <i className="fa-regular fa-clock"></i>
                      {currentLecture.duration || '15 minutes'}
                    </span>
                  </div>
                </div>
                  <div className={styles.lectureControls}>
                  <div className={styles.controlTabs}>
                    <button className={`${styles.controlTab} ${styles.activeTab}`}>Description</button>
                    <button className={styles.controlTab}>Notes</button>
                    <button className={styles.controlTab}>Discussion</button>
                  </div>
                  
                  <div className={styles.controlContent}>
                    <div className={styles.lectureDescription}>
                      <h3>Description</h3>
                      <p>{currentLecture.description || "This lecture covers important concepts related to this topic. Follow along with the video and complete any exercises mentioned."}</p>
                      
                      <div className={styles.completionSection}>
                        <h4>Mark Your Progress</h4>
                        <button 
                          className={`${styles.completionButton} ${currentLecture.completed ? styles.completed : ''}`}
                          onClick={() => updateLectureProgress(currentLecture.id, currentLecture.completed ? 'in-progress' : 'completed')}
                        >
                          {currentLecture.completed ? (
                            <>
                              <i className="fa-solid fa-check-circle"></i> Completed
                            </>
                          ) : (
                            <>
                              <i className="fa-regular fa-circle-check"></i> Mark as Complete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {currentLecture.resources && currentLecture.resources.length > 0 && (
                  <div className={styles.lectureResources}>
                    <h3>Resources</h3>
                    <ul>
                      {currentLecture.resources.map((resource, index) => (
                        <li key={index}>
                          <a href={resource.url} target="_blank" rel="noreferrer">
                            <i className="fa-solid fa-file-pdf"></i>
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className={styles.courseNavigation}>
                  <div className={styles.navSection}>
                    <h3>Course Navigation</h3>
                    <div className={styles.navButtons}>
                      <button 
                        className={styles.navButton} 
                        disabled={!findPreviousLecture()}
                        onClick={() => {
                          const prevLecture = findPreviousLecture();
                          if (prevLecture) {
                            handleLectureSelect(prevLecture.section, prevLecture.lecture);
                          }
                        }}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Previous Lecture</span>
                      </button>
                      
                      <button 
                        className={styles.navButton}
                        disabled={!findNextLecture()}
                        onClick={() => {
                          const nextLecture = findNextLecture();
                          if (nextLecture) {
                            handleLectureSelect(nextLecture.section, nextLecture.lecture);
                          }
                        }}
                      >
                        <span>Next Lecture</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (              <div className={styles.noLectureSelected}>
                <i className="fa-solid fa-video-slash"></i>
                <h2>No lecture selected</h2>
                <p>Please select a lecture from the course content sidebar</p>
                <button 
                  className={styles.browseButton}
                  onClick={() => navigate(`/course/${courseId}`)}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  Back to Course
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.contentSidebar}>
            <div className={styles.courseInfo}>
              <h2 className={styles.courseTitle}>{courseData?.name}</h2>
              <div className={styles.progressContainer}>
                <div className={styles.progressInfo}>
                  <span>Your progress</span>
                  <span>{calculateCourseProgress()}% complete</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progress} 
                    style={{ width: `${calculateCourseProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className={styles.contentList}>
              <h3 className={styles.contentHeader}>Course Content</h3>
              
              {courseData?.sections && courseData.sections.map((section) => (
                <div key={section.id} className={styles.contentSection}>
                  <div 
                    className={styles.sectionHeader} 
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className={styles.sectionTitle}>
                      <i className={`fa-solid ${expandedSections[section.id] ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                      <span>{section.title}</span>
                    </div>
                    <div className={styles.sectionMeta}>
                      <span>{section.lectures.length} lectures</span>
                    </div>
                  </div>
                  
                  {expandedSections[section.id] && (
                    <div className={styles.lecturesList}>
                      {section.lectures.map((lecture) => (
                        <div 
                          key={lecture.id} 
                          className={`${styles.lectureItem} ${currentLecture && currentLecture.id === lecture.id ? styles.activeLecture : ''} ${lecture.completed ? styles.completedLecture : ''}`}
                          onClick={() => handleLectureSelect(section, lecture)}
                        >
                          <div className={styles.lectureStatus}>
                            {lecture.completed ? (
                              <i className="fa-solid fa-circle-check"></i>
                            ) : currentLecture && currentLecture.id === lecture.id ? (
                              <i className="fa-solid fa-circle-play"></i>
                            ) : (
                              <i className="fa-regular fa-circle"></i>
                            )}
                          </div>
                          <div className={styles.lectureDetails}>
                            <span className={styles.lectureItemTitle}>{lecture.title}</span>
                            <span className={styles.lectureItemDuration}>
                              <i className="fa-regular fa-clock"></i>
                              {lecture.duration || '15 min'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
