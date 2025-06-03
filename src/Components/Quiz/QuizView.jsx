import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Clock icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Submit icon

// Mock Quiz Data
const mockQuizData = {
    title: 'Introduction to React Quiz',
    timeLimitMinutes: 30, // Example time limit
    questions: [
        {
            id: 'q1',
            text: 'What is React primarily used for?',
            options: [
                { id: 'o1', text: 'Building user interfaces' },
                { id: 'o2', text: 'Server-side logic' },
                { id: 'o3', text: 'Database management' },
                { id: 'o4', text: 'API creation' },
            ],
        },
        {
            id: 'q2',
            text: 'What is JSX?',
            options: [
                { id: 'o5', text: 'A JavaScript library' },
                { id: 'o6', text: 'A syntax extension to JavaScript' },
                { id: 'o7', text: 'A CSS preprocessor' },
                { id: 'o8', text: 'A database query language' },
            ],
        },
        {
            id: 'q3',
            text: 'Which hook is used to manage state in a functional component?',
            options: [
                { id: 'o9', text: 'useEffect' },
                { id: 'o10', text: 'useContext' },
                { id: 'o11', text: 'useState' },
                { id: 'o12', text: 'useReducer' },
            ],
        },
        // Add more questions as needed...
    ],
};

export default function QuizView() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { q1: 'o1', q2: 'o6' }
    const [timeLeft, setTimeLeft] = useState(mockQuizData.timeLimitMinutes * 60); // Time in seconds
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const totalQuestions = mockQuizData.questions.length;
    const currentQuestion = mockQuizData.questions[currentQuestionIndex];

    // Timer Logic (simple countdown)
    useEffect(() => {
        if (timeLeft <= 0 || quizSubmitted) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId); // Cleanup timer on component unmount or submission
    }, [timeLeft, quizSubmitted]);

    const handleAnswerChange = (event) => {
        setUserAnswers({
            ...userAnswers,
            [currentQuestion.id]: event.target.value,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Quiz Submitted! Answers:", userAnswers);
        setQuizSubmitted(true);
        setTimeLeft(0); // Stop timer visually
        // Add logic to calculate score and show results
    };

    // Format time remaining MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    if (quizSubmitted) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>Quiz Submitted!</Typography>
                    <Typography variant="body1">Your answers have been recorded.</Typography>
                    {/* Add score display or link to results here */}
                     <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.history.back()}> {/* Simple back navigation */} 
                         Back to Course
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (timeLeft <= 0 && !quizSubmitted) {
         // Optionally auto-submit or show a timeout message
         handleSubmit(); // Auto-submit when time runs out
         return (
             <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                 <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                     <AccessTimeIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                     <Typography variant="h5" gutterBottom>Time's Up!</Typography>

                     <Typography variant="body1">The quiz was automatically submitted.</Typography>
                     <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.history.back()}>\n                         Back to Course
                    </Button>
                 </Paper>
             </Container>
         );
     }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{mockQuizData.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">Time Left: {formatTime(timeLeft)}</Typography>
                    </Box>
                </Box>

                 {/* Progress */}
                <Box sx={{ mb: 3 }}>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                {/* Question and Answers */}
                <Box>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {currentQuestion.text}
                        </FormLabel>
                        <RadioGroup
                            aria-label={`Question ${currentQuestionIndex + 1}`}
                            name={`question_${currentQuestion.id}`}
                            value={userAnswers[currentQuestion.id] || ''}
                            onChange={handleAnswerChange}
                        >
                            <Stack spacing={1}>
                                {currentQuestion.options.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={option.id}
                                        control={<Radio />}
                                        label={option.text}
                                        sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 1, m: 0, '&:hover': { bgcolor: '#f5f5f5' } }}
                                    />
                                ))}
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Box>

                {/* Navigation Buttons */}
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<CheckCircleOutlineIcon />}
                            onClick={handleSubmit}
                            disabled={!userAnswers[currentQuestion.id]} // Disable if current question unanswered
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleNext}
                            disabled={!userAnswers[currentQuestion.id]} // Disable if current question unanswered
                        >
                            Next
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
} 