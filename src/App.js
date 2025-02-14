import { Component } from "react";
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home/Home";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './Components/Shared/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
  state = {}

  render() {
    const router = createBrowserRouter([
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/', element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ) }
    ]);

    return (
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthProvider>
    );
  }
}