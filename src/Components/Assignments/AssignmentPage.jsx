import React from 'react';
import './AssignmentPage.module.css';
import styles from './AssignmentPage.module.css';

const AssignmentPage = () => {
  return (
    <div className={styles.assignmentPage}>
      <h1 className={styles.title}>Assignment</h1>
      <div className={styles.lessonSelector}>
        <label htmlFor="lesson">Select Lesson</label>
        <select id="lesson" className={styles.selectBox}>
          <option>Lesson 2 - Loops</option>
          {/* Add more options dynamically */}
        </select>
      </div>
      <table className={styles.assignmentTable}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Submitted Assignment</th>
            <th>Grade</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row, replace with dynamic data */}
          <tr>
            <td>Ahmed Adel</td>
            <td><a href="#">View Assignment</a></td>
            <td><input type="number" defaultValue="10" className={styles.gradeInput} /></td>
            <td><input type="text" placeholder="Write note" className={styles.noteInput} /></td>
            <td><button className={styles.submitButton}>Submit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentPage;
