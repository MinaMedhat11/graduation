import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge'; // For online status

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddCommentIcon from '@mui/icons-material/AddComment'; // Compose
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood'; // Emoji placeholder
import AttachFileIcon from '@mui/icons-material/AttachFile'; // Attachment placeholder

// Mock Data
const mockContacts = [
    { id: 1, name: 'Jane Cooper', lastMessage: 'Yeah sure, tell me zafor', time: 'just now', online: true, avatar: '/static/images/avatar/1.jpg' },
    { id: 2, name: 'Jenny Wilson', lastMessage: 'Thank you so much, sir', time: '2 d', online: false, avatar: '/static/images/avatar/2.jpg' },
    { id: 3, name: 'Marvin McKinney', lastMessage: 'You\'re Welcome', time: '1 m', online: false, avatar: '/static/images/avatar/3.jpg' },
    { id: 4, name: 'Eleanor Pena', lastMessage: 'Thank you so much, sir', time: '1 m', online: false, avatar: '/static/images/avatar/4.jpg' },
    { id: 5, name: 'Ronald Richards', lastMessage: 'Sorry, I can\'t help you', time: '2 m', online: false, avatar: '/static/images/avatar/5.jpg' },
    { id: 6, name: 'Kathryn Murphy', lastMessage: 'new message', time: '2 m', online: false, avatar: '/static/images/avatar/6.jpg' },
    { id: 7, name: 'Jacob Jones', lastMessage: 'Thank you so much, sir', time: '6 m', online: false, avatar: '/static/images/avatar/7.jpg' },
    { id: 8, name: 'Cameron Williamson', lastMessage: 'It\'s okay, no problem brother, I will fix everythin...', time: '6 m', online: false, avatar: '/static/images/avatar/1.jpg' }, // Reused avatar
    { id: 9, name: 'Arlene McCoy', lastMessage: 'Thank you so much, sir', time: '9 m', online: false, avatar: '/static/images/avatar/2.jpg' },
    { id: 10, name: 'Dianne Russell', lastMessage: 'You\'re Welcome', time: '9 m', online: false, avatar: '/static/images/avatar/3.jpg' },
];

const mockMessages = {
    1: [
        { id: 'm1', sender: 'other', text: 'Hello and thanks for signing up to the course. If you have any questions about the course or Adobe XD, feel free to get in touch and I\'ll be happy to help 😊', time: 'Time' }, // Using unicode emoji
        { id: 'm2', sender: 'me', text: 'Hello, Good Evening.', time: 'Time' },
        { id: 'm3', sender: 'me', text: 'I\'m Zafor', time: 'Time' },
        { id: 'm4', sender: 'me', text: 'I only have a small doubt about your lecture, can you give me some time for this?', time: 'Time' },
        { id: 'm5', sender: 'other', text: 'Yeah sure, tell me zafor', time: 'Time' },
    ],
    2: [
         { id: 'm6', sender: 'other', text: 'Thank you so much, sir', time: '2 d' },
    ],
    // Add more messages for other contacts if needed
};

export default function Chat() {
    const [selectedChatId, setSelectedChatId] = useState(1); // Default to Jane Cooper
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const messageEndRef = useRef(null); // To scroll to bottom

    const selectedContact = mockContacts.find(c => c.id === selectedChatId);
    const currentMessages = mockMessages[selectedChatId] || [];

     // Scroll to bottom when messages change or chat is selected
     useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages, selectedChatId]);

    const handleSelectChat = (id) => {
        setSelectedChatId(id);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            console.log(`Sending message to ${selectedContact?.name}:`, messageInput);
            // Add logic to append message to state/send via API
            // Example (won't persist):
            // const newMessage = { id: `m${Date.now()}`, sender: 'me', text: messageInput, time: 'now' };
            // mockMessages[selectedChatId] = [...(mockMessages[selectedChatId] || []), newMessage];
            setMessageInput('');
        }
    };

    const handleInputChange = (event) => {
        setMessageInput(event.target.value);
    };

     const handleInputKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
             event.preventDefault(); // Prevent new line on Enter
             handleSendMessage();
         }
     };

    const filteredContacts = mockContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Paper elevation={0} sx={{ height: 'calc(100vh - 64px - 48px)', display: 'flex', borderRadius: '12px', overflow: 'hidden' }}> {/* Adjust height based on header/padding */}
            {/* Left Pane: Contacts List */}
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

            {/* Right Pane: Chat Area */}
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
                                <IconButton sx={{color: '#555'}}><MoreVertIcon /></IconButton>
                            </Toolbar>
                        </AppBar>

                        {/* Messages Area */}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                            {/* Group messages by date - simple placeholder */}
                            <Typography variant="caption" align="center" display="block" color="text.secondary" sx={{ mb: 2 }}>Today</Typography>

                             <Stack spacing={2}>
                                {currentMessages.map((msg) => (
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
                                            {/* Add timestamp below message */}
                                            {/* <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', fontSize: '0.65rem', mt: 0.5, opacity: 0.7 }}>{msg.time}</Typography> */}
                                        </Paper>
                                    </Box>
                                ))}
                            </Stack>
                             <div ref={messageEndRef} /> {/* Element to scroll to */}
                        </Box>

                        {/* Message Input Area */}
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
                                sx={{ '& .MuiOutlinedInput-root': { p: '0px 5px 0px 14px' } }} // Adjust padding
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