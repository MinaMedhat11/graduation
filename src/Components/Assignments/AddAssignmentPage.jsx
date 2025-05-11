import React from 'react';
import './AddAssignmentPage.module.css';

const AddAssignmentPage = () => {
  return (
    <div className="add-assignment-page">
      <h1>Add Assignment</h1>
      <form className="assignment-form">
        <div className="form-group">
          <label>Select Course</label>
          <select>
            <option>Flutter Basics</option>
            {/* Add more options dynamically */}
          </select>
        </div>
        <div className="form-group">
          <label>Assignment Title</label>
          <input type="text" placeholder="Enter assignment title" />
        </div>
        <div className="form-group">
          <label>Select Content</label>
          <select>
            <option>Lesson 1: Introduction</option>
            {/* Add more options dynamically */}
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Enter description"></textarea>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Attach File</label>
          <input type="file" />
        </div>
        <button type="submit" className="submit-button">Add Assignment</button>
      </form>
    </div>
  );
};

export default AddAssignmentPage;
