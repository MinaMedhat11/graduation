import React, { useState, useEffect } from 'react';
import './BasicInfoForm.module.css';
import axios from 'axios';

export default function BasicInfoForm({ initialData, onNext }) {
    const [instructors, setInstructors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price || '',
        major_id: initialData?.major_id || '',
        description: initialData?.description || '',
        bio: initialData?.bio || '',
        lessons_number: initialData?.lessons_number || '',
        course_hours: initialData?.course_hours || '',
        instructor_id: initialData?.instructor_id || '',
        course_image: null,
        requirements: Array.isArray(initialData?.requirements) ? initialData.requirements : [],
        outcomes: Array.isArray(initialData?.outcomes) ? initialData.outcomes : [],
        discount:"0"
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/instructor/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const instructorsMap = new Map();
                response.data.data.forEach(item => {
                    instructorsMap.set(item.instructor_id, {
                        id: item.instructor_id,
                        name: item.instructor_name
                    });
                });
                setInstructors(Array.from(instructorsMap.values()));
            } catch (error) {
                setError('Failed to load instructors');
            }
        };
        fetchInstructors();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/major/index', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.major?.data) {
                    setCategories(response.data.major.data);
                }
            } catch (error) {
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        setFormData(prev => ({
            ...prev,
            course_image: event.target.files[0]
        }));
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('price', formData.price);
            fd.append('major_id', formData.major_id);
            fd.append('description', formData.description);
            fd.append('bio', formData.bio);
            fd.append('lessons_number', formData.lessons_number);
            fd.append('course_hours', formData.course_hours);
            fd.append('instructor_id', formData.instructor_id);
            fd.append('discount', formData.discount || "0");
            if (formData.course_image) {
                fd.append('course_image', formData.course_image);
            }
            fd.append('requirements', JSON.stringify(formData.requirements));
            fd.append('outcomes', JSON.stringify(formData.outcomes));

            const response = await fetch('http://127.0.0.1:8000/api/courses/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: fd
            });

            const text = await response.text();
            console.log("Raw response text:", text);
            if (!response.ok) {
                throw new Error('Failed to create course');
            }
            let data;
            try {
                data = JSON.parse(text);
            } catch(e) {
                throw new Error('API did not return JSON: ' + text);
            }
            // في الخطوة اللي بعدها هنحتاج الـ courseId فقط، نبعت id مباشر
            onNext(data.course.id);

        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="form-container">
            <h2>Basic Information</h2>
            <form onSubmit={handleFormSubmit}>
                {/* باقي الأكواد كما هو */}
                <div className="form-row d-flex">
                    <div className="form-group w-50 p-2">
                        <label>Title</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group w-50 p-2">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row d-flex">
                    <div className="form-group w-50 p-2">
                        <label>Category</label>
                        <select
                            name="major_id"
                            value={formData.major_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group w-50 p-2">
                        <label>Instructor</label>
                        <select
                            name="instructor_id"
                            value={formData.instructor_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            {instructors.map(instructor => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Requirements (one per line)</label>
                    <textarea
                        value={formData.requirements.join('\n')}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                requirements: e.target.value.split('\n').filter(v => v)
                            }))
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Outcomes (one per line)</label>
                    <textarea
                        value={formData.outcomes.join('\n')}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                outcomes: e.target.value.split('\n').filter(v => v)
                            }))
                        }
                        required
                    />
                </div>
                <div className="form-row d-flex">
                    <div className="form-group w-50 p-2">
                        <label>Lessons</label>
                        <input
                            type="number"
                            name="lessons_number"
                            value={formData.lessons_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group w-50 p-2">
                        <label>Hours</label>
                        <input
                            type="number"
                            name="course_hours"
                            value={formData.course_hours}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Course Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="button-group p-2">
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}