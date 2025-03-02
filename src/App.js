import { Component } from "react";
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./Components/Home/Home";
import Courses from "./Components/Courses/Courses";
import CourseDetail from "./Components/CourseDetail/CourseDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Payments from "./Components/Payments/Payments";
import Assignments from "./Components/Assignments/Assignments";
import Lectures from "./Components/Lectures/Lectures";
import Profile from "./Components/Profile/Profile";
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
  state = {}

  render() {
    const router = createBrowserRouter([
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/home', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/courses', element: <Courses /> },
      { path: '/course/:id', element: <CourseDetail /> },
      { path: '/payments', element: <Payments /> },
      { path: '/assignments', element: <Assignments /> },
      { path: '/lectures', element: <Lectures /> },
      { path: '/profile', element: <Profile /> }
    ]);

    return (
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthProvider>
    );
  }
}