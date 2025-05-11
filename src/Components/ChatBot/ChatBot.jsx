import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Fab,
  Zoom,
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';

// Sample responses for the educational chatbot
const getBotResponse = (message) => {
  const lowerCaseMessage = message.toLowerCase();
  
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return "Hello! How can I help you with your learning today?";
  } 
  else if (lowerCaseMessage.includes('course')) {
    return "We have many courses available. You can browse our course catalog from the Courses page. Is there a specific subject you're interested in?";
  } 
  else if (lowerCaseMessage.includes('payment') || lowerCaseMessage.includes('pay')) {
    return "We accept various payment methods including credit cards and PayPal. You can view your payment history and pending payments in the Payments section.";
  } 
  else if (lowerCaseMessage.includes('assignment') || lowerCaseMessage.includes('homework')) {
    return "You can view and submit your assignments from the Assignment page. If you're having trouble with a specific assignment, please contact your instructor directly.";
  }
  else if (lowerCaseMessage.includes('deadline') || lowerCaseMessage.includes('due date')) {
    return "All assignment deadlines are listed on the Assignment page. You can also check the course syllabus for a comprehensive schedule.";
  }
  else if (lowerCaseMessage.includes('enroll') || lowerCaseMessage.includes('register')) {
    return "To enroll in a course, browse the course catalog, select your desired course, and click the Enroll button. Payment will be required to complete enrollment.";
  } 
  else if (lowerCaseMessage.includes('certificate') || lowerCaseMessage.includes('completion')) {
    return "Certificates of completion are issued automatically when you complete all course requirements. You can download them from your Profile page.";
  }
  else if (lowerCaseMessage.includes('instructor') || lowerCaseMessage.includes('teacher')) {
    return "You can view instructor profiles on the course detail page. If you need to contact an instructor, use the messaging feature in the course.";
  }
  else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('support')) {
    return "For technical support, please email support@education.com. For academic questions, please contact your instructor through the course messaging system.";
  }
  else if (lowerCaseMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  else {
    return "I'm sorry, I don't have information about that topic yet. Please try asking another question or contact support for more assistance.";
  }
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', content: 'Hello! How can I help you today?' }
  ]);  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  // Not using auth context currently, but keeping the reference
  const auth = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', content: input }]);
    
    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { sender: 'bot', content: botResponse }]);
    }, 800);

    // Clear input
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}>
        <Zoom in={!open}>
          <Fab 
            color="primary" 
            onClick={() => setOpen(true)} 
            sx={{ 
              bgcolor: '#28A79F',
              '&:hover': { bgcolor: '#1C7A73' },
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <ChatIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Chat Dialog */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 330,
            height: 480,
            maxHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '12px',
            zIndex: 1999,
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#28A79F',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Education Assistant</Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setOpen(false)} 
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1,
                    px: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      maxWidth: '80%',
                    }}
                  >
                    {message.sender === 'bot' ? (
                      <Avatar
                        sx={{ bgcolor: '#28A79F', width: 32, height: 32, mr: 1 }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>                    ) : (
                      <Avatar
                        sx={{ bgcolor: '#28A79F', width: 32, height: 32, ml: 1 }}
                      >
                        <AccountCircleIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,                        borderRadius: '16px',
                        borderTopLeftRadius: message.sender === 'bot' ? '4px' : '16px',
                        borderTopRightRadius: message.sender === 'user' ? '4px' : '16px',
                        backgroundColor: message.sender === 'user' ? '#28A79F' : 'white',
                        color: message.sender === 'user' ? 'white' : 'black',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: 'white',
              display: 'flex',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                sx: { borderRadius: '20px' },
              }}
            />            <IconButton 
              onClick={handleSend} 
              disabled={input.trim() === ''}
              sx={{ 
                ml: 1, 
                color: input.trim() !== '' ? '#28A79F' : 'inherit',
                bgcolor: input.trim() !== '' ? 'rgba(40, 167, 159, 0.1)' : 'inherit'
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot;
