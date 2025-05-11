import React from 'react';
import './InstructorsPage.module.css';

const InstructorsPage = () => {
  return (
    <div className="instructors-page">
      <h1>Instructors / Students</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search by Student Name..." />
        <button className="filter-button">Filter</button>
        <button className="add-button">Add</button>
      </div>
      <table className="instructors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Courses Assigned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr>
            <td>Kristin Watson</td>
            <td>kristin.watson@example.com</td>
            <td>Network / Figma UI</td>
            <td>
              <button className="edit-button">Edit</button>
              <button className="delete-button">Delete</button>
            </td>
          </tr>
          {/* Add more rows dynamically */}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorsPage;
