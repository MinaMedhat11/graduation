import React, { useState, useEffect } from 'react';
import './BasicInfoForm.module.css';
import axios from 'axios';

export default function QuizCreateForm({ onNext }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        course_id: '',
        section_name: '',
        quiz_order: '',
        quiz_data: [
            {
                question: '',
                choices: ['', '', '', ''],
                correct: 0
            }
        ]
    });

    // Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            setCoursesLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/courses/', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.data && response.data.data) {
                    const coursesData = response.data.data.map(course => ({
                        id: course.id,
                        name: course.name,
                        instructor_name: course.instructor?.name || 'Unknown'
                    }));
                    setCourses(coursesData);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to load courses');
            } finally {
                setCoursesLoading(false);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (questionIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            quiz_data: prev.quiz_data.map((question, index) => {
                if (index === questionIndex) {
                    if (field === 'question') {
                        return { ...question, question: value };
                    } else if (field === 'correct') {
                        return { ...question, correct: parseInt(value) };
                    }
                }
                return question;
            })
        }));
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        setFormData(prev => ({
            ...prev,
            quiz_data: prev.quiz_data.map((question, qIndex) => {
                if (qIndex === questionIndex) {
                    const newChoices = [...question.choices];
                    newChoices[choiceIndex] = value;
                    return { ...question, choices: newChoices };
                }
                return question;
            })
        }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            quiz_data: [
                ...prev.quiz_data,
                {
                    question: '',
                    choices: ['', '', '', ''],
                    correct: 0
                }
            ]
        }));
    };

    const removeQuestion = (questionIndex) => {
        if (formData.quiz_data.length > 1) {
            setFormData(prev => ({
                ...prev,
                quiz_data: prev.quiz_data.filter((_, index) => index !== questionIndex)
            }));
        }
    };

    const addChoice = (questionIndex) => {
        setFormData(prev => ({
            ...prev,
            quiz_data: prev.quiz_data.map((question, index) => {
                if (index === questionIndex) {
                    return {
                        ...question,
                        choices: [...question.choices, '']
                    };
                }
                return question;
            })
        }));
    };

    const removeChoice = (questionIndex, choiceIndex) => {
        setFormData(prev => ({
            ...prev,
            quiz_data: prev.quiz_data.map((question, qIndex) => {
                if (qIndex === questionIndex && question.choices.length > 2) {
                    const newChoices = question.choices.filter((_, cIndex) => cIndex !== choiceIndex);
                    return {
                        ...question,
                        choices: newChoices,
                        correct: question.correct >= choiceIndex && question.correct > 0 ? question.correct - 1 : question.correct
                    };
                }
                return question;
            })
        }));
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('token');
        
        // التحقق من صحة البيانات
        if (!formData.course_id) {
            throw new Error('Please select a course');
        }

        if (!formData.section_name.trim()) {
            throw new Error('Please enter section name');
        }

        if (!formData.quiz_order || parseInt(formData.quiz_order) < 1) {
            throw new Error('Please enter a valid quiz order (minimum 1)');
        }

        const isValid = formData.quiz_data.every(question => {
            return question.question.trim() !== '' && 
                   question.choices.every(choice => choice.trim() !== '') &&
                   question.correct >= 0 && 
                   question.correct < question.choices.length;
        });

        if (!isValid) {
            throw new Error('Please fill all questions and choices properly');
        }

        // إعداد البيانات حسب API الجديد
        const requestData = {
            course_id: parseInt(formData.course_id),
            section_name: formData.section_name.trim(),
            title: formData.title.trim(),
            type: "quiz", // ثابت
            description: formData.description.trim(),
            order: parseInt(formData.quiz_order),
            duration: parseInt(formData.duration),
            is_free: 0, // ثابت
            video_url: "", // فارغ للكويز
            quiz_data: JSON.stringify(formData.quiz_data) // تحويل إلى JSON string
        };

        console.log('Sending data:', requestData);

        // إرسال الطلب للـ API الجديد
        const response = await axios.post('http://127.0.0.1:8000/api/course-content/', requestData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Quiz created successfully:', response.data);
        
        // التحقق من الاستجابة
        if (response.data.success) {
            alert(`Quiz created successfully! Content ID: ${response.data.data.id}`);
            
            if (onNext && response.data.data?.id) {
                onNext(response.data.data.id);
            } else {
                // إعادة توجيه أو إغلاق النموذج
                window.history.back();
            }
        } else {
            throw new Error(response.data.message || 'Failed to create quiz content');
        }

    } catch (error) {
        console.error('Error creating quiz content:', error);
        
        // معالجة أخطاء مختلفة
        let errorMessage = 'Failed to create quiz content';
        
        if (error.response) {
            // خطأ من الخادم
            errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Server error: ${error.response.status}`;
            
            // إذا كان هناك تفاصيل أخطاء إضافية
            if (error.response.data?.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                errorMessage += ': ' + errors.join(', ');
            }
        } else if (error.request) {
            // مشكلة في الشبكة
            errorMessage = 'Network error. Please check your connection.';
        } else {
            // خطأ آخر
            errorMessage = error.message;
        }
        
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

    if (loading && coursesLoading) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <h2>Create Quiz Content</h2>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeaa7', borderRadius: '4px'}}>{error}</div>}
            
            <form onSubmit={handleFormSubmit}>
                {/* Course Selection */}
                <div className="form-group">
                    <label>Select Course *</label>
                    <select
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        required
                        disabled={coursesLoading}
                    >
                        <option value="">
                            {coursesLoading ? 'Loading courses...' : 'Select a course...'}
                        </option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name} - by {course.instructor_name}
                            </option>
                        ))}
                    </select>
                    {coursesLoading && (
                        <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                            Loading available courses...
                        </small>
                    )}
                </div>

                {/* Section Name and Quiz Order */}
                <div className="form-row d-flex">
                    <div className="form-group w-50 p-2">
                        <label>Section Name *</label>
                        <input
                            type="text"
                            name="section_name"
                            value={formData.section_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter section name..."
                        />
                    </div>
                    <div className="form-group w-50 p-2">
                        <label>Quiz Order *</label>
                        <input
                            type="number"
                            name="quiz_order"
                            value={formData.quiz_order}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="Enter quiz order..."
                        />
                    </div>
                </div>

                {/* Basic Quiz Information */}
                <div className="form-group">
                    <label>Quiz Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter quiz title..."
                    />
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter quiz description..."
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Enter duration in minutes..."
                    />
                </div>

                {/* Static Fields Info */}
                <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: '#1565c0'
                }}>
                    <strong>Note:</strong> This content will be created as a Quiz (type: quiz) and will be a paid content (is_free: 0).
                </div>

                {/* Quiz Questions Section */}
                <div className="quiz-questions-section" style={{marginTop: '30px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h3>Quiz Questions</h3>
                        <button
                            type="button"
                            onClick={addQuestion}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Question
                        </button>
                    </div>

                    {formData.quiz_data.map((question, questionIndex) => (
                        <div 
                            key={questionIndex} 
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '20px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            {/* Question Header */}
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <h4>Question {questionIndex + 1}</h4>
                                {formData.quiz_data.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(questionIndex)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            {/* Question Text */}
                            <div className="form-group">
                                <label>Question Text *</label>
                                <textarea
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                                    required
                                    placeholder="Enter your question..."
                                    rows="2"
                                />
                            </div>

                            {/* Answer Choices */}
                            <div className="form-group">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                    <label>Answer Choices *</label>
                                    <button
                                        type="button"
                                        onClick={() => addChoice(questionIndex)}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Add Choice
                                    </button>
                                </div>

                                {question.choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                        <input
                                            type="radio"
                                            name={`correct_${questionIndex}`}
                                            checked={question.correct === choiceIndex}
                                            onChange={() => handleQuestionChange(questionIndex, 'correct', choiceIndex)}
                                            style={{marginRight: '10px'}}
                                        />
                                        <input
                                            type="text"
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(questionIndex, choiceIndex, e.target.value)}
                                            required
                                            placeholder={`Choice ${choiceIndex + 1}...`}
                                            style={{flexGrow: 1, marginRight: '10px'}}
                                        />
                                        {question.choices.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeChoice(questionIndex, choiceIndex)}
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 8px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <small style={{color: '#666', marginTop: '5px', display: 'block'}}>
                                    Select the radio button next to the correct answer
                                </small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Buttons */}
                <div className="button-group p-2" style={{marginTop: '30px'}}>
                    <button type="button" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading || coursesLoading}>
                        {loading ? 'Creating Quiz Content...' : 'Create Quiz Content'}
                    </button>
                </div>
            </form>
        </div>
    );
}