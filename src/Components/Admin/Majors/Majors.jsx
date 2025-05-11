import React from 'react';
import './Majors.module.css';

const Majors = () => {
  return (
    <div className="majors-page">
      <h1>Majors</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search by Major Name..." />
        <button className="filter-button">Filter</button>
        <button className="add-button">Add Major</button>
      </div>
      <table className="majors-table">
        <thead>
          <tr>
            <th>Major Name</th>
            <th>Description</th>
            <th>Courses</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Back-End</td>
            <td>This course is your best way to learn mobile app development for Android and Apple</td>
            <td>10</td>
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

export default Majors;
