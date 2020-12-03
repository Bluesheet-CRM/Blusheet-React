import React from 'react';
import { Navigate, BrowserRouter as Router,Route } from 'react-router-dom';
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import Pipeline from "./Components/Pipelines";
import Homepage from "./Components/Homepage/Homepage";
import Notes from "./Components/Notes/Notes";
import Tasks from "./Components/Tasks/Tasks";
import Products from "./Components/Products/Products";
import Mail from "./Components/Mails/Mail";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Home from "./Components/Home/Home";
import NotFoundView from "./Components/errors/NotFoundView";
import Redirect from "./Components/Auth/Redirect";

const routes = [
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { path: '/pipelines', element: <Pipeline /> },
      { path: '/notes', element: <Notes /> },
      { path: '/tasks', element: <Tasks /> },
      { path: '/products', element: <Products /> },
      { path: '/email', element:<Mail />},
      { path: '*', element: <Navigate to="/404" /> },
      { path: '404', element: <NotFoundView /> }
    ]
  },
  {
    path:"/",
    element: <MainLayout />,
    children:[
      { path: '/', element: <Home /> },
      {path: '/auth/callback', element: <Redirect />},
      { path: '/home', element: <Homepage /> },
      {path : '/login',element: <Login/> },
      {path : '/signup',element: <Signup /> },
      { path: '*', element: <Navigate to="/404" /> },
      { path: '404', element: <NotFoundView /> }
    ]
  },
  
];



export default routes;
