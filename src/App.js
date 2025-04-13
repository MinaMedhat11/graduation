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

// Import MUI Theme components and the custom theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import the theme

// Import the main user Layout component
import Layout from './Components/Layout/Layout';

// Import the Chat component
import Chat from './Components/Chat/Chat';
// Import the QuizView component
import QuizView from './Components/Quiz/QuizView';
// Import the AssignmentSubmission component
import AssignmentSubmission from './Components/Assignments/AssignmentSubmission';

// Import Admin Layout
import AdminLayout from './Components/Admin/Layout/AdminLayout';
// Import Admin Dashboard
import AdminDashboard from './Components/Admin/Dashboard/AdminDashboard';
// Import Admin Courses
import AdminCourses from './Components/Admin/Courses/AdminCourses';
// Import Admin Users
import AdminUsers from './Components/Admin/Users/AdminUsers';
// Import Course Editor
import CourseEditor from './Components/CourseEditor/CourseEditor';
// Import Assignment Grading
import AssignmentGrading from './Components/Admin/Grading/AssignmentGrading';
// Import Admin Assignment Submissions
import AdminAssignmentSubmissions from './Components/Admin/Assignments/AdminAssignmentSubmissions';

const App = () => {
  const router = createBrowserRouter([
    // Routes outside the main layout
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/home', element: <Home /> },
    // Routes using the main Layout
    {
      element: <Layout />, // Use the imported Layout component
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
        // Add the new Chat route
        { path: '/chat', element: <Chat /> },
        // Add the new Quiz route
        { path: '/quiz/:quizId', element: <QuizView /> },
        // Add routes for Enrollments and Students/Instructors if components exist
        // { path: '/enrollments', element: <Enrollments /> },
        // { path: '/users', element: <Users /> },
      ]
    },

    // Routes using the Admin Layout
    {
      element: <AdminLayout />, // Use the AdminLayout component
      // TODO: Add route protection based on user role
      children: [
        { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> }, // Redirect /admin to dashboard
        { path: '/admin/dashboard', element: <AdminDashboard /> },
        { path: '/admin/courses', element: <AdminCourses /> },
        { path: '/admin/users', element: <AdminUsers /> },
        // Add Course Editor routes
        { path: '/admin/course/create', element: <CourseEditor /> },
        { path: '/admin/course/edit/:courseId', element: <CourseEditor /> },
        // Add Assignment Grading route
        { path: '/admin/grading/assignment/:submissionId', element: <AssignmentGrading /> },
        // Add Admin Assignment Submissions route
        { path: '/admin/assignments', element: <AdminAssignmentSubmissions /> },
      ]
    },

    // { path: '*', element: <NotFound /> } // Optional: 404 page
  ]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Apply baseline styles and background */}
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;