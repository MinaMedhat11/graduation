import { Component } from "react";
import { render } from '@testing-library/react';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home/Home";

export default class App extends Component{
state={}



render(){
  const router = createBrowserRouter([{path:'/login' , element: <Login/>},
{path:'/signup', element:<SignUp/>},
{path: '/', element: <Home/>}

  ])
    return <>
      <RouterProvider router={router}/>

    </>
  

}


}