import React from "react";
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

// Theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layout
import Layout from './Components/Layout/Layout';

// Other Components
import Chat from './Components/Chat/Chat';
import QuizView from './Components/Quiz/QuizView';
import AssignmentSubmission from './Components/Assignments/AssignmentSubmission';

// Admin
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import AdminDashboard from './Components/Admin/Dashboard/AdminDashboard';
import AdminCourses from './Components/Admin/Courses/AdminCourses';
import AdminUsers from './Components/Admin/Users/AdminUsers';
import CourseEditor from './Components/CourseEditor/CourseEditor';
import AssignmentGrading from './Components/Admin/Grading/AssignmentGrading';
import AdminAssignmentSubmissions from './Components/Admin/Assignments/AdminAssignmentSubmissions';

// Protected Route by role
import RoleProtectedRoute from './Components/RoleProtectedRoute';

const App = () => {
  const router = createBrowserRouter([
    // Public Routes
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/home', element: <Home /> },

    // Protected Routes for "web" users
    {
      element: <RoleProtectedRoute allowedGuard="web" />,
      children: [
        {
          element: <Layout />,
          children: [
            { path: '/', element: <Navigate to="/dashboard" replace /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/courses', element: <Courses /> },
            { path: '/course/:id', element: <CourseDetail /> },
            { path: '/payments', element: <Payments /> },
            { path: '/assignments', element: <Assignments /> },
            { path: '/assignment/submit/:assignmentId', element: <AssignmentSubmission /> },
            { path: '/lectures', element: <Lectures /> },
            { path: '/profile', element: <Profile /> },
            { path: '/chat', element: <Chat /> },
            { path: '/quiz/:quizId', element: <QuizView /> },
          ]
        }
      ]
    },

    // Protected Routes for "admin" users
    {
      element: <RoleProtectedRoute allowedGuard="admin" />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
            { path: '/admin/dashboard', element: <AdminDashboard /> },
            { path: '/admin/courses', element: <AdminCourses /> },
            { path: '/admin/users', element: <AdminUsers /> },
            { path: '/admin/course/create', element: <CourseEditor /> },
            { path: '/admin/course/edit/:courseId', element: <CourseEditor /> },
            { path: '/admin/grading/assignment/:submissionId', element: <AssignmentGrading /> },
            { path: '/admin/assignments', element: <AdminAssignmentSubmissions /> },
            { path: '/admin/profile', element: <Profile /> }, // Added profile route for admin panel
          ]
        }
      ]
    }

    // Optional: 404 route
    // { path: '*', element: <NotFound /> }
  ]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
