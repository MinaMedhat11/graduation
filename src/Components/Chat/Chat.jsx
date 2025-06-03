import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Stack,
  Badge
} from '@mui/material';

import {
  Search as SearchIcon,
  AddComment as AddCommentIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Mood as MoodIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';

// Mock Data
const mockContacts = [
  { id: 1, name: 'Jane Cooper', lastMessage: 'Yeah sure, tell me zafor', time: 'just now', online: true, avatar: '/static/images/avatar/1.jpg' },
  { id: 2, name: 'Jenny Wilson', lastMessage: 'Thank you so much, sir', time: '2 d', online: false, avatar: '/static/images/avatar/2.jpg' },
];

const mockMessages = {
  1: [
    { id: 'm1', sender: 'other', text: 'Hello and thanks for signing up to the course. 😊', time: 'Time' },
    { id: 'm2', sender: 'me', text: 'Hello, Good Evening.', time: 'Time' },
    { id: 'm3', sender: 'me', text: 'I\'m Zafor', time: 'Time' },
    { id: 'm4', sender: 'me', text: 'I only have a small doubt about your lecture, can you give me some time for this?', time: 'Time' },
    { id: 'm5', sender: 'other', text: 'Yeah sure, tell me zafor', time: 'Time' },
  ],
  2: [
    { id: 'm6', sender: 'other', text: 'Thank you so much, sir', time: '2 d' },
  ],
};

export default function Chat() {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(mockMessages[selectedChatId] || []);
  const messageEndRef = useRef(null);

  const selectedContact = mockContacts.find(c => c.id === selectedChatId);

  useEffect(() => {
    setMessages(mockMessages[selectedChatId] || []);
  }, [selectedChatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: `m${Date.now()}`,
        sender: 'me',
        text: messageInput,
        time: 'now',
      };
      setMessages(prev => [...prev, newMessage]);

      // Optionally update the mockMessages storage for development purposes only
      if (mockMessages[selectedChatId]) {
        mockMessages[selectedChatId].push(newMessage);
      } else {
        mockMessages[selectedChatId] = [newMessage];
      }

      setMessageInput('');
    }
  };

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Paper elevation={0} sx={{ height: 'calc(100vh - 64px - 48px)', display: 'flex', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Left Pane */}
      <Box sx={{ width: 320, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', bgcolor: '#F8F9FA' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Chat</Typography>
          <Button variant="contained" size="small" startIcon={<AddCommentIcon />} sx={{ textTransform: 'none', bgcolor: '#E8EAF6', color: '#3F51B5', '&:hover': { bgcolor: '#D1D9FF' } }}>
            Compose
          </Button>
        </Toolbar>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '8px', backgroundColor: '#FFF' }
            }}
          />
        </Box>
        <List sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
          {filteredContacts.map((contact) => (
            <ListItemButton
              key={contact.id}
              selected={selectedChatId === contact.id}
              onClick={() => handleSelectChat(contact.id)}
              sx={{ borderBottom: '1px solid #eee', bgcolor: selectedChatId === contact.id ? '#DCEDFF' : 'inherit' }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{ '& .MuiBadge-dot': { backgroundColor: contact.online ? '#44b700' : '#ccc' } }}
                >
                  <Avatar alt={contact.name} src={contact.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={contact.name}
                secondary={contact.lastMessage}
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ noWrap: true, fontSize: '0.8rem' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-start', pt: 0.5 }}>
                {contact.time}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#FFF' }}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: '#F8F9FA', borderBottom: '1px solid #e0e0e0' }}>
              <Toolbar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{ mr: 1.5, '& .MuiBadge-dot': { backgroundColor: selectedContact.online ? '#44b700' : '#ccc' } }}
                >
                  <Avatar alt={selectedContact.name} src={selectedContact.avatar} />
                </Badge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#000' }}>{selectedContact.name}</Typography>
                  <Typography variant="caption" sx={{ color: selectedContact.online ? '#44b700' : 'text.secondary' }}>
                    {selectedContact.online ? 'Active Now' : 'Offline'}
                  </Typography>
                </Box>
                <IconButton sx={{ color: '#555' }}>
                  <MoreVertIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              <Typography variant="caption" align="center" display="block" color="text.secondary" sx={{ mb: 2 }}>Today</Typography>
              <Stack spacing={2}>
                {messages.map((msg) => (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: msg.sender === 'me' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                        bgcolor: msg.sender === 'me' ? '#25cf9d' : '#F0F0F0',
                        color: msg.sender === 'me' ? '#fff' : '#000',
                        maxWidth: '70%',
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Stack>
              <div ref={messageEndRef} />
            </Box>

            {/* Chat Input */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#F8F9FA' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder="Type your message"
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small"><MoodIcon /></IconButton>
                      <IconButton size="small"><AttachFileIcon /></IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSendMessage}
                        endIcon={<SendIcon />}
                        disabled={!messageInput.trim()}
                        sx={{ borderRadius: '8px', bgcolor: '#25cf9d', '&:hover': { bgcolor: '#1da884' } }}
                      >
                        Send
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px', backgroundColor: '#FFF', p: '5px' }
                }}
                sx={{ '& .MuiOutlinedInput-root': { p: '0px 5px 0px 14px' } }}
              />
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Select a chat to start messaging</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}