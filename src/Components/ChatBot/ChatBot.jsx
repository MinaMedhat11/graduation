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
  Collapse,
  CircularProgress // لاستخدامه كمؤشر تحميل
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// const { useAuth } = '../../context/AuthContext'; // إذا كنت ستستخدمه لاحقًا

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    // يمكنك اختيار إبقاء رسالة ترحيب أولية أو جعلها تأتي من الـ API عند أول تفاعل
    { sender: 'bot', content: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // حالات جديدة
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const auth = useAuth(); // إذا كنت ستستخدمه لاحقًا للحصول على userId

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addMessageToState = (content, sender) => {
    setMessages(prev => [...prev, { sender, content }]);
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (userMessage === '' || isLoading) return;

    addMessageToState(userMessage, 'user');
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        message: userMessage,
        sessionId: sessionId // سيكون null في الطلب الأول
      };

      // ملاحظة: الـ userId هنا ثابت. قد تحتاج لتغييره بناءً على المستخدم المسجل دخوله
      const response = await fetch('http://chatnabot.runasp.net/api/Chatbot/send?userId=react-test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // محاولة قراءة رسالة الخطأ من الـ API إذا كانت JSON
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            // تجاهل إذا لم تكن الاستجابة JSON
        }
        const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
        // console.log("Session ID updated:", data.sessionId); // لعرض معرف الجلسة إذا لزم الأمر
      }
      if (data.message) {
        addMessageToState(data.message, 'bot');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      addMessageToState(`Sorry, something went wrong: ${error.message}`, 'bot');
    } finally {
      setIsLoading(false);
    }
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
            id="chat-messages-container-react" // معرف مختلف لتجنب التعارض إذا كان الكود القديم لا يزال في الصفحة
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
                        sx={{ bgcolor: '#28A79F', width: 32, height: 32, mr: 1, alignSelf: 'flex-start' }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{ bgcolor: '#4A90E2', width: 32, height: 32, ml: 1, alignSelf: 'flex-start' }} // لون مختلف للمستخدم
                      >
                        <AccountCircleIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: '16px',
                        borderTopLeftRadius: message.sender === 'bot' ? '4px' : '16px',
                        borderTopRightRadius: message.sender === 'user' ? '4px' : '16px',
                        backgroundColor: message.sender === 'user' ? '#4A90E2' : 'white', // لون مختلف للمستخدم
                        color: message.sender === 'user' ? 'white' : 'black',
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
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
              alignItems: 'center',
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
              disabled={isLoading} // تعطيل الإدخال أثناء التحميل
              InputProps={{
                sx: { borderRadius: '20px' },
              }}
            />
            <IconButton 
              onClick={handleSend} 
              disabled={input.trim() === '' || isLoading}
              sx={{ 
                ml: 1, 
                color: (input.trim() !== '' && !isLoading) ? '#28A79F' : 'grey.500',
                bgcolor: (input.trim() !== '' && !isLoading) ? 'rgba(40, 167, 159, 0.1)' : 'transparent'
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{color: '#28A79F'}} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot;