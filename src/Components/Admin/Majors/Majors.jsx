import React, { useEffect, useState } from 'react';
import axios from 'axios'; // تأكد من تثبيت axios أولاً
import './Majors.module.css';
import Loading from './../../Loading/Loading';

const Majors = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/major/index', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setMajors(response.data.major.data);
        setLoading(false);
      } catch (err) {
        setError('فشل في جلب البيانات');
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>;

  return (
    <div className="majors-page">
      <h1>Majorssssssssss</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search by Major Name..." />
        <button className="filter-button">Filter</button>
        <button className="add-button">Add Major</button>
      </div>
      <table className="majors-table">
        <thead>
          <tr>
            <th>Major Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {majors.map((major) => (
            <tr key={major.id}>
              <td>{major.title}</td>
              <td>
                <button className="edit-button">Edittttttttt</button>
                <button className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Majors;