import React, { lazy, Suspense } from "react";
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
import Enrollments from "./Components/Enrollments/Enrollments";
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ThemeProviderr } from './context/ThemeContext';
import './styles/darkMode.css'
// Layout
import Layout from './Components/Layout/Layout';

// Other Components
import Chat from './Components/Chat/Chat';
import QuizView from './Components/Quiz/QuizView';
import AssignmentSubmission from './Components/Assignments/AssignmentSubmission';
import Checkout from './Components/Checkout/Checkout';
import OrderConfirmation from './Components/OrderConfirmation/OrderConfirmation';
import Settings from './Components/Settings/Settings';

// Admin
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import AdminDashboard from './Components/Admin/Dashboard/AdminDashboard';
import AdminCourses from './Components/Admin/Courses/AdminCourses';
import AdminUsers from './Components/Admin/Users/AdminUsers';
import CourseEditor from './Components/CourseEditor/CourseEditor';
import AssignmentGrading from './Components/Admin/Grading/AssignmentGrading';
import AdminAssignmentSubmissions from './Components/Admin/Assignments/AdminAssignmentSubmissions';
import AdminPayments from './Components/Admin/Payments/AdminPayments';
import AdminEnrollments from './Components/Admin/Enrollments/AdminEnrollments';
import Majors from './Components/Majors/Majors';
import InstructorProgress from './Components/Admin/InstructorProgress/InstructorProgress';
import CourseProgress from './Components/Admin/CourseProgress/CourseProgress';
import QuizCreateForm from './Components/Admin/Quiz/QuizCreateForm';

// Protected Route by role
import RoleProtectedRoute from './Components/RoleProtectedRoute';
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import ChatBot from "Components/ChatBot/ChatBot";

//Instructor
import InstructorLayout from './Components/InstructorLayout/AdminLayout';

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
            { path: '/courses', element: <Courses /> }, { path: '/course/:id', element: <CourseDetail /> },
            { path: '/course/:courseId/lecture/:lectureId', element: <Suspense fallback={<div>Loading...</div>}>{React.createElement(lazy(() => import('./Components/VideoPlayer/VideoPlayer')))}</Suspense> },
            { path: '/payments', element: <Payments /> },
            { path: '/assignments', element: <Assignments /> },
            { path: '/assignment/submit/:assignmentId', element: <AssignmentSubmission /> }, { path: '/lectures', element: <Lectures /> },
            { path: '/enrollments', element: <Enrollments /> }, { path: '/profile', element: <Profile /> },
            { path: '/settings', element: <Settings /> },
            { path: '/chat', element: <Chat /> },
            { path: '/chatbot', element: <ChatBot /> },
            { path: '/quiz/:quizId', element: <QuizView /> },
            { path: '/checkout', element: <Checkout /> },
            { path: '/order-confirmation', element: <OrderConfirmation /> },
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
            { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> }, { path: '/admin/dashboard', element: <AdminDashboard /> },
            { path: '/admin/courses', element: <AdminCourses /> },
            { path: '/admin/users', element: <AdminUsers /> },
            { path: '/admin/course/create', element: <CourseEditor /> },
            { path: '/admin/course/edit/:courseId', element: <CourseEditor /> },
            { path: '/admin/grading/assignment/:submissionId', element: <AssignmentGrading /> },
            { path: '/admin/assignments', element: <AdminAssignmentSubmissions /> }, { path: '/admin/payments', element: <AdminPayments /> },
            { path: '/admin/enrollments', element: <AdminEnrollments /> },
            { path: '/admin/lectures', element: <Lectures /> },
            { path: '/admin/profile', element: <Profile /> },
            { path: '/admin/majors', element: <Majors /> },
            { path: '/admin/settings', element: <Settings /> },
            { path: '/admin/video-player', element: <VideoPlayer /> },
            { path: '/admin/chat', element: <Chat /> },
            { path: "/admin/instructor-progress", element: <InstructorProgress /> },
            { path: "/admin/course-progress", element: <CourseProgress /> },
            { path: "/admin/quiz-create", element: <QuizCreateForm /> }
          ]
        }
      ]
    },
    {
      element: <RoleProtectedRoute allowedGuard="instructor" />,
      children: [
        {
          element: <InstructorLayout />,
          children: [
            { path: '/instructor', element: <Navigate to="/instructor/dashboard" replace /> }, { path: '/instructor/dashboard', element: <AdminDashboard /> },
            { path: '/instructor/courses', element: <AdminCourses /> },
            { path: '/instructor/course/create', element: <CourseEditor /> },
            { path: '/instructor/course/edit/:courseId', element: <CourseEditor /> },
            { path: '/instructor/grading/assignment/:submissionId', element: <AssignmentGrading /> },
            { path: '/instructor/assignments', element: <AdminAssignmentSubmissions /> },
            { path: '/instructor/lectures', element: <Lectures /> },
            { path: '/instructor/profile', element: <Profile /> },
            { path: '/instructor/majors', element: <Majors /> },
            { path: '/instructor/settings', element: <Settings /> },
            { path: '/instructor/video-player', element: <VideoPlayer /> },
            { path: '/instructor/chat', element: <Chat /> },
            { path: "/instructor/course-progress", element: <CourseProgress /> },
            { path: "/instructor/quiz-create", element: <QuizCreateForm /> }
          ]
        }
      ]
    }



    // Optional: 404 route
    // { path: '*', element: <NotFound /> }
  ]);

  return (
    <ThemeProviderr>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </ThemeProvider>
      </AuthProvider>
    </ThemeProviderr>
  );
}

export default App;
