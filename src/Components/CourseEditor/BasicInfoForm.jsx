import React, { useState } from 'react';
import './BasicInfoForm.module.css';

// Mock Data for dropdowns
const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design'];
const subCategories = {
    'Web Development': ['Front-End', 'Back-End', 'Full-Stack'],
    'Mobile Development': ['iOS', 'Android', 'Cross-Platform'],
    'Data Science': ['Machine Learning', 'Analytics', 'Big Data'],
    'Design': ['UI/UX', 'Graphic Design', 'Illustration'],
};
const languages = ['English', 'Spanish', 'French', 'Arabic'];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];


export default function BasicInfoForm({ initialData, onNext }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        category: initialData?.category || '',
        subCategory: initialData?.subCategory || '',
        topic: initialData?.topic || '',
        language: initialData?.language || '',
        subtitleLanguage: initialData?.subtitleLanguage || '',
        level: initialData?.level || '',
        durationValue: initialData?.durationValue || '',
        durationUnit: initialData?.durationUnit || 'Day',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Reset subcategory if category changes
            if (name === 'category') {
                newState.subCategory = '';
            }
            return newState;
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        onNext(formData); // Pass data to parent
    };

    // Dynamically get subcategories based on selected category
    const currentSubCategories = formData.category ? subCategories[formData.category] || [] : [];

    return (
        <div className="basic-info-form">
            <h2>Basic Information</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Your course title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Subtitle</label>
                    <input
                        type="text"
                        placeholder="Your course subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Course Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Course Sub-category</label>
                    <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        required
                        disabled={!formData.category}
                    >
                        <option value="">Select...</option>
                        {currentSubCategories.map(subCat => <option key={subCat} value={subCat}>{subCat}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Course Topic</label>
                    <input
                        type="text"
                        placeholder="What is primarily taught in your course?"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Course Language</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Subtitle Language (Optional)</label>
                    <select
                        name="subtitleLanguage"
                        value={formData.subtitleLanguage}
                        onChange={handleChange}
                    >
                        <option value="">Select...</option>
                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Course Level</label>
                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Durations</label>
                    <input
                        type="text"
                        placeholder="Course durations"
                        name="durationValue"
                        value={formData.durationValue}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="save-button">Save & Next</button>
            </form>
        </div>
    );
}