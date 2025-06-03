import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './VideoPlayer.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import quizImg from '../../../src/Images/quiz-time.avif'

const YouTubePlayer = ({ videoUrl, onTimeUpdate, onVideoEnded }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (playerContainerRef.current && !playerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1
          },
          events: {
            onReady: (event) => {
              console.log('YouTube player is ready');
              setIsPlayerReady(true);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                startTracking();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                if (onVideoEnded && typeof onVideoEnded === 'function') {
                  onVideoEnded();
                }
                stopTracking();
              } else {
                stopTracking();
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      stopTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const startTracking = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (playerRef.current && isPlayerReady && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0) {
            const percent = Math.floor((currentTime / duration) * 100);
            if (onTimeUpdate && typeof onTimeUpdate === 'function') {
              onTimeUpdate(percent);
            }
          }
        } catch (error) {
          console.error('Error tracking video progress:', error);
        }
      }
    }, 5000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (!videoId) {
    return (
      <iframe
        src={videoUrl}
        title="Lecture Video"
        className={styles.videoPlayer}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <div
      ref={playerContainerRef}
      className={styles.videoPlayer}
    />
  );
};

export default function VideoPlayer() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [progress, setProgress] = useState(0);
  const [progressSent80, setProgressSent80] = useState(false);
  const [progressSent100, setProgressSent100] = useState(false);
  const videoRef = useRef(null);

  // Fetch base course info
  useEffect(() => {
    const fetchBaseCourse = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseData(res.data);
      } catch (err) {
        console.error('Error fetching course info:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBaseCourse();
  }, [courseId]);

  // Fetch course content
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://127.0.0.1:8000/api/course-content/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        const sectionMap = {};

        data.forEach(item => {
          const sectionId = item.section.id;
          if (!sectionMap[sectionId]) {
            sectionMap[sectionId] = {
              id: sectionId,
              title: item.section.title,
              order: item.section.order ?? 0,
              lectures: []
            };
          }
          sectionMap[sectionId].lectures.push({
            id: item.id,
            title: item.title,
            duration: `${item.duration} min`,
            completed: false,
            type: item.type,
            video_url: item.video_url,
            quiz_data: item.quiz_data,
            order: item.order
          });
        });

        const finalSections = Object.values(sectionMap)
          .sort((a, b) => a.order - b.order)
          .map(section => ({
            ...section,
            lectures: section.lectures.sort((a, b) => a.order - b.order)
          }));

        setCourseContent(finalSections);

        // Set expanded initially
        const expanded = {};
        finalSections.forEach(sec => {
          expanded[sec.id] = false;
        });
        if (finalSections.length > 0) {
          expanded[finalSections[0].id] = true;
        }
        setExpandedSections(expanded);

        // Select current lecture if ID provided
        if (lectureId) {
          for (const section of finalSections) {
            const foundLecture = section.lectures.find(l => l.id === parseInt(lectureId));
            if (foundLecture) {
              setCurrentSection(section);
              setCurrentLecture(foundLecture);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course content:', err);
      }
    };
    fetchCourseContent();
  }, [courseId, lectureId]);

  // Fetch lecture details
  useEffect(() => {
    const fetchLectureDetails = async () => {
      if (!lectureId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/course-content/${lectureId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Lecture Details:', response.data);
      } catch (error) {
        console.error('Error fetching lecture details:', error);
      }
    };
    fetchLectureDetails();
  }, [lectureId]);

  // Reset progress flags when lecture changes
  useEffect(() => {
    setProgressSent80(false);
    setProgressSent100(false);
  }, [currentLecture?.id]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLectureSelect = (section, lecture) => {
    setCurrentSection(section);
    setCurrentLecture(lecture);

    // التحقق من نوع المحتوى
    if (lecture.type === 'quiz') {
      // التوجيه لصفحة الكويز
      navigate(`/quiz/${lecture.id}`);
    } else {
      // التوجيه لصفحة الفيديو (السلوك الافتراضي)
      navigate(`/course/${courseId}/lecture/${lecture.id}`, { replace: true });

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }

      // Reset progress flags for new lecture
      setProgressSent80(false);
      setProgressSent100(false);
    }
  };

  const updateLectureProgress = async (lectureId, progressPercent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/lecture/create-progress',
        {
          course_content_id: lectureId,
          progress: progressPercent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Progress updated: ${progressPercent}% for lecture ${lectureId}`);
      console.log('API Response:', response.data);

      // Update local state if progress is 100%
      if (progressPercent === 100) {
        const updated = courseContent.map(section => ({
          ...section,
          lectures: section.lectures.map(lec =>
            lec.id === lectureId ? { ...lec, completed: true } : lec
          )
        }));
        setCourseContent(updated);
      }
    } catch (error) {
      console.error('Error updating lecture progress:', error);
    }
  };

  const handleTimeUpdate = (percent) => {
    setProgress(percent);

    if (currentLecture) {
      // Send progress at 75% as 80% (only once per lecture)
      if (percent >= 75 && !progressSent80) {
        updateLectureProgress(currentLecture.id, 80);
        setProgressSent80(true);
      }

      // Send progress at 90% as 100% (only once per lecture)
      if (percent >= 90 && !progressSent100) {
        updateLectureProgress(currentLecture.id, 100);
        setProgressSent100(true);
      }
    }
  };

  const handleVideoEnded = () => {
    if (currentLecture && !progressSent100) {
      updateLectureProgress(currentLecture.id, 100);
      setProgressSent100(true);
    }
  };

  const calculateCourseProgress = () => {
    const allLectures = courseContent.flatMap(sec => sec.lectures);
    const completed = allLectures.filter(l => l.completed).length;
    return allLectures.length ? Math.round((completed / allLectures.length) * 100) : 0;
  };

  if (isLoading) return <Loading />;

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
              <>
                <div className={styles.videoWrapper}>
                  {currentLecture.type === 'quiz' ? (
                    // عرض صورة للكويز
                    <div className={styles.quizPreview}>
                      <img
                        src={courseData?.course_image || quizImg}
                        alt="Quiz Preview"
                        className={styles.quizImage}
                      />
                      <div className={styles.quizOverlay}>
                        <div className={styles.quizIcon}>
                          <i className="fa-solid fa-clipboard-question"></i>
                        </div>
                        <h3>Quiz: {currentLecture.title}</h3>
                        <p>Duration: {currentLecture.duration}</p>
                        <button
                          className={styles.startQuizBtn}
                          onClick={() => navigate(`/quiz/${currentLecture.id}`)}
                        >
                          <i className="fa-solid fa-play"></i>
                          Start Quiz
                        </button>
                      </div>
                    </div>
                  ) : currentLecture.type === 'video' ? (
                    // عرض الفيديو العادي
                    currentLecture.video_url.includes('youtube') ? (
                      <YouTubePlayer
                        videoUrl={currentLecture.video_url}
                        onTimeUpdate={handleTimeUpdate}
                        onVideoEnded={handleVideoEnded}
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        className={styles.videoPlayer}
                        controls
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnded}
                        src={currentLecture.video_url}
                        poster={courseData?.course_image}
                      />
                    )
                  ) : (
                    // محتوى آخر
                    <div className={styles.contentPreview}>
                      <img
                        src={courseData?.course_image || ''}
                        alt="Content Preview"
                        className={styles.contentImage}
                      />
                      <div className={styles.contentOverlay}>
                        <h3>{currentLecture.title}</h3>
                        <p>Type: {currentLecture.type}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.lectureInfo}>
                  <h2>{currentLecture.title}</h2>
                  {currentLecture.type === 'quiz' && (
                    <div className={styles.quizInfo}>
                      <span className={styles.quizBadge}>
                        <i className="fa-solid fa-clipboard-question"></i>
                        Quiz
                      </span>
                      <span className={styles.quizDuration}>
                        <i className="fa-regular fa-clock"></i>
                        {currentLecture.duration}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.lectureControls}>
                  <div className={styles.controlTabs}>
                    <button className={`${styles.controlTab} ${styles.activeTab}`}>
                      {currentLecture.type === 'quiz' ? 'Quiz Details' : 'Description'}
                    </button>
                  </div>
                  <div className={styles.controlContent}>
                    <div className={styles.lectureDescription}>
                      <h3>{currentLecture.type === 'quiz' ? 'Quiz Information' : 'Description'}</h3>
                      {currentLecture.type === 'quiz' ? (
                        <div className={styles.quizDetails}>
                          <p><strong>Quiz Title:</strong> {currentLecture.title}</p>
                          <p><strong>Duration:</strong> {currentLecture.duration}</p>
                          <p><strong>Type:</strong> Interactive Quiz</p>
                          <div className={styles.quizActions}>
                            <button
                              className={styles.primaryButton}
                              onClick={() => navigate(`/quiz/${currentLecture.id}`)}
                            >
                              <i className="fa-solid fa-play"></i>
                              Take Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p>{currentLecture.description || 'No description available.'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <h3 style={{ padding: '2rem' }}>Please select a lecture</h3>
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
              <h3>Course Content</h3>
              {courseContent.map(section => (
                <div key={section.id} className={styles.contentSection}>
                  <div className={styles.sectionHeader} onClick={() => toggleSection(section.id)}>
                    <span>
                      <i className={`fa-solid ${expandedSections[section.id] ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                      {section.title}
                    </span>
                  </div>
                  {expandedSections[section.id] && (
                    <div className={styles.lecturesList}>
                      {section.lectures.map(lecture => (
                        <div
                          key={lecture.id}
                          className={`${styles.lectureItem} ${currentLecture?.id === lecture.id ? styles.activeLecture : ''
                            } ${lecture.completed ? styles.completedLecture : ''} ${lecture.type === 'quiz' ? styles.quizItem : ''
                            }`}
                          onClick={() => handleLectureSelect(section, lecture)}
                        >
                          <div className={styles.lectureStatus}>
                            {lecture.completed ? (
                              <i className="fa-solid fa-circle-check"></i>
                            ) : lecture.type === 'quiz' ? (
                              <i className="fa-solid fa-question-circle"></i>
                            ) : (
                              <i className="fa-regular fa-circle-play"></i>
                            )}
                          </div>
                          <div className={styles.lectureDetails}>
                            <span>
                              {lecture.type === 'quiz' && (
                                <span className={styles.quizBadge}>Quiz: </span>
                              )}
                              {lecture.title}
                            </span>
                            <span>
                              <i className="fa-regular fa-clock"></i> {lecture.duration}
                              {lecture.type === 'quiz' && (
                                <span className={styles.quizLabel}> • Quiz</span>
                              )}
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