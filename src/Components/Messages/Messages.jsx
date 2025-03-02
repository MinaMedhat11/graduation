import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

export default function Messages() {
  // Sample data for contacts
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'Instructor',
      lastMessage: 'Hello, how are you doing with the assignment?',
      time: '10:30 AM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: 'Instructor',
      lastMessage: 'The next class will be on Thursday.',
      time: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      role: 'Student',
      lastMessage: 'Can you help me with the project?',
      time: 'Yesterday',
      unread: 1,
      online: true
    },
    {
      id: 4,
      name: 'Emily Chen',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      role: 'Student',
      lastMessage: 'Thanks for your help!',
      time: 'Monday',
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      role: 'Instructor',
      lastMessage: 'Please submit your assignment by Friday.',
      time: 'Monday',
      unread: 0,
      online: true
    }
  ];

  // Sample data for messages
  const messageHistory = {
    1: [
      {
        id: 1,
        sender: 1,
        receiver: 'me',
        message: 'Hello, how are you doing with the assignment?',
        time: '10:30 AM',
        read: true
      },
      {
        id: 2,
        sender: 'me',
        receiver: 1,
        message: 'Hi! I\'m working on it. Should be done by tomorrow.',
        time: '10:35 AM',
        read: true
      },
      {
        id: 3,
        sender: 1,
        receiver: 'me',
        message: 'Great! Let me know if you need any help.',
        time: '10:40 AM',
        read: true
      },
      {
        id: 4,
        sender: 1,
        receiver: 'me',
        message: 'Also, don\'t forget to include the references section.',
        time: '10:42 AM',
        read: false
      },
      {
        id: 5,
        sender: 1,
        receiver: 'me',
        message: 'And make sure to follow the formatting guidelines.',
        time: '10:45 AM',
        read: false
      }
    ]
  };

  // State for selected contact
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  
  // State for new message
  const [newMessage, setNewMessage] = useState('');
  
  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
  };
  
  return (
    <div className="messages-container">
      <Sidebar />
      
      <div className="main-content" style={{ marginLeft: '250px' }}>
        <Header />
        
        <div className="messages-content p-4">
          {/* Page Title */}
          <div className="page-title mb-4">
            <h2 className="fw-bold">Messages</h2>
            <p className="text-muted">Communicate with your instructors and fellow students.</p>
          </div>
          
          <div className="messages-wrapper bg-white rounded-3 shadow-sm overflow-hidden">
            <div className="row g-0" style={{ height: '70vh' }}>
              {/* Contacts List */}
              <div className="col-md-4 border-end">
                <div className="contacts-header p-3 border-bottom">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                      className="form-control bg-light border-start-0"
                      type="text"
                      placeholder="Search contacts..."
                      aria-label="Search contacts"
                    />
                  </div>
                </div>
                
                <div className="contacts-list" style={{ height: 'calc(70vh - 62px)', overflowY: 'auto' }}>
                  {contacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className={`contact-item d-flex p-3 border-bottom ${selectedContact.id === contact.id ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="avatar position-relative me-3">
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="rounded-circle"
                          width="50"
                          height="50"
                        />
                        {contact.online && (
                          <span 
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                            style={{ width: '12px', height: '12px', border: '2px solid white' }}
                          ></span>
                        )}
                      </div>
                      <div className="contact-info flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="mb-0">{contact.name}</h6>
                          <small className="text-muted">{contact.time}</small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="text-muted mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                            {contact.lastMessage}
                          </p>
                          {contact.unread > 0 && (
                            <span className="badge bg-primary rounded-pill">{contact.unread}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="col-md-8">
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-header p-3 border-bottom d-flex align-items-center">
                      <div className="avatar position-relative me-3">
                        <img 
                          src={selectedContact.avatar} 
                          alt={selectedContact.name} 
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                        {selectedContact.online && (
                          <span 
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                            style={{ width: '10px', height: '10px', border: '2px solid white' }}
                          ></span>
                        )}
                      </div>
                      <div>
                        <h5 className="mb-0">{selectedContact.name}</h5>
                        <small className="text-muted">{selectedContact.role}</small>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div 
                      className="messages-area p-3" 
                      style={{ 
                        height: 'calc(70vh - 62px - 76px)', 
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {messageHistory[selectedContact.id]?.map(message => (
                        <div 
                          key={message.id} 
                          className={`message-bubble mb-3 ${message.sender === 'me' ? 'ms-auto' : 'me-auto'}`}
                          style={{ maxWidth: '70%' }}
                        >
                          <div 
                            className={`p-3 rounded-3 ${
                              message.sender === 'me' ? 'bg-primary text-white' : 'bg-light'
                            }`}
                          >
                            {message.message}
                          </div>
                          <div className="message-info d-flex justify-content-between align-items-center mt-1">
                            <small className="text-muted">{message.time}</small>
                            {message.sender === 'me' && (
                              <small className="text-muted">
                                {message.read ? (
                                  <i className="fa-solid fa-check-double"></i>
                                ) : (
                                  <i className="fa-solid fa-check"></i>
                                )}
                              </small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="message-input p-3 border-top">
                      <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={newMessage.trim() === ''}
                          >
                            <i className="fa-solid fa-paper-plane"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <i className="fa-regular fa-comment-dots fs-1 text-muted mb-3"></i>
                    <h4>Select a contact</h4>
                    <p className="text-muted">Choose a contact to start messaging</p>
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