import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

export default function Calendar() {
  // Sample data for events
  const allEvents = [
    {
      id: 1,
      title: 'Web Development Workshop',
      date: '2023-03-15',
      time: '10:00 AM - 12:00 PM',
      location: 'Online',
      description: 'Learn the latest web development techniques and tools.',
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Data Science Webinar',
      date: '2023-03-18',
      time: '2:00 PM - 4:00 PM',
      location: 'Online',
      description: 'Explore data science fundamentals and applications.',
      category: 'Webinar'
    },
    {
      id: 3,
      title: 'UI/UX Design Meetup',
      date: '2023-03-22',
      time: '6:00 PM - 8:00 PM',
      location: 'Design Hub',
      description: 'Connect with fellow designers and share insights.',
      category: 'Meetup'
    },
    {
      id: 4,
      title: 'JavaScript Advanced Concepts',
      date: '2023-03-25',
      time: '1:00 PM - 3:00 PM',
      location: 'Online',
      description: 'Deep dive into advanced JavaScript concepts and patterns.',
      category: 'Workshop'
    },
    {
      id: 5,
      title: 'Mobile App Development Hackathon',
      date: '2023-03-28',
      time: '9:00 AM - 5:00 PM',
      location: 'Tech Campus',
      description: 'Build innovative mobile applications in a day-long hackathon.',
      category: 'Hackathon'
    },
    {
      id: 6,
      title: 'Career in Tech Panel Discussion',
      date: '2023-03-30',
      time: '4:00 PM - 6:00 PM',
      location: 'Online',
      description: 'Industry experts discuss career paths and opportunities in tech.',
      category: 'Panel'
    }
  ];

  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Function to get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Function to navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Function to check if a day has events
  const hasEvents = (day) => {
    if (!day) return false;
    
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.some(event => event.date === dateString);
  };
  
  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(event => event.date === dateString);
  };
  
  // State for selected day
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Calendar days
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="calendar-container">
      <Sidebar />
      
      <div className="main-content" style={{ marginLeft: '250px' }}>
        <Header />
        
        <div className="calendar-content p-4">
          {/* Page Title */}
          <div className="page-title mb-4">
            <h2 className="fw-bold">Calendar</h2>
            <p className="text-muted">View and manage your upcoming events and deadlines.</p>
          </div>
          
          <div className="row">
            {/* Calendar */}
            <div className="col-lg-8">
              <div className="calendar-card bg-white rounded-3 shadow-sm p-4 mb-4">
                {/* Calendar Header */}
                <div className="calendar-header d-flex justify-content-between align-items-center mb-4">
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={goToPreviousMonth}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <h4 className="mb-0">{monthNames[currentMonth]} {currentYear}</h4>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={goToNextMonth}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                
                {/* Calendar Grid */}
                <div className="calendar-grid">
                  {/* Weekday Headers */}
                  <div className="row mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div key={index} className="col text-center">
                        <div className="weekday-header fw-bold">{day}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="calendar-days">
                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rowIndex) => (
                      <div key={rowIndex} className="row mb-3">
                        {calendarDays.slice(rowIndex * 7, (rowIndex + 1) * 7).map((day, colIndex) => (
                          <div key={colIndex} className="col">
                            {day && (
                              <div 
                                className={`calendar-day d-flex flex-column align-items-center justify-content-center p-2 rounded-3 ${
                                  selectedDay === day ? 'bg-primary text-white' : 
                                  hasEvents(day) ? 'bg-light' : ''
                                }`}
                                style={{ 
                                  height: '80px', 
                                  cursor: 'pointer',
                                  border: selectedDay === day ? 'none' : '1px solid #e9ecef'
                                }}
                                onClick={() => setSelectedDay(day)}
                              >
                                <span className="day-number">{day}</span>
                                {hasEvents(day) && (
                                  <div className="event-indicator mt-1">
                                    <span 
                                      className={`badge rounded-pill ${selectedDay === day ? 'bg-light text-primary' : 'bg-primary'}`}
                                    >
                                      {getEventsForDay(day).length}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Events List */}
            <div className="col-lg-4">
              <div className="events-card bg-white rounded-3 shadow-sm p-4">
                <h4 className="mb-4">
                  {selectedDay 
                    ? `Events for ${monthNames[currentMonth]} ${selectedDay}, ${currentYear}` 
                    : 'Upcoming Events'
                  }
                </h4>
                
                {selectedDay ? (
                  <>
                    {getEventsForDay(selectedDay).length > 0 ? (
                      <div className="selected-day-events">
                        {getEventsForDay(selectedDay).map(event => (
                          <div key={event.id} className="event-item mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="mb-0">{event.title}</h5>
                              <span className="badge bg-primary">{event.category}</span>
                            </div>
                            <p className="text-muted mb-2">
                              <i className="fa-regular fa-clock me-2"></i>
                              {event.time}
                            </p>
                            <p className="text-muted mb-2">
                              <i className="fa-solid fa-location-dot me-2"></i>
                              {event.location}
                            </p>
                            <p className="mb-0">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-events text-center py-4">
                        <i className="fa-regular fa-calendar-xmark fs-1 text-muted mb-3"></i>
                        <h5>No Events</h5>
                        <p className="text-muted">There are no events scheduled for this day.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="upcoming-events">
                    {allEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="event-item mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="mb-0">{event.title}</h5>
                          <span className="badge bg-primary">{event.category}</span>
                        </div>
                        <p className="text-muted mb-2">
                          <i className="fa-regular fa-calendar me-2"></i>
                          {event.date.split('-')[2]} {monthNames[parseInt(event.date.split('-')[1]) - 1]}
                        </p>
                        <p className="text-muted mb-2">
                          <i className="fa-regular fa-clock me-2"></i>
                          {event.time}
                        </p>
                        <p className="text-muted mb-0">
                          <i className="fa-solid fa-location-dot me-2"></i>
                          {event.location}
                        </p>
                      </div>
                    ))}
                    <button className="btn btn-outline-primary w-100">View All Events</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 