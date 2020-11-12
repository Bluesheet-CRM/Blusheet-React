import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import Pipeline from "./Components/Pipelines";
import Homepage from "./Components/Homepage/Homepage";
import Notes from "./Components/Notes/Notes";
import Tasks from "./Components/Tasks/Tasks";
import Products from "./Components/Products/Products";
import Mail from "./Components/Mails/Mail";
import NotFoundView from "./Components/errors/NotFoundView";
const routes = [
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <Homepage /> },
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
      { path: '/', element: <Homepage /> },
      { path: '404', element: <NotFoundView /> },
    ]
  }
];

export default routes;
