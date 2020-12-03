import React, { useEffect, useState,useContext } from "react";
import { useLocation,Navigate } from "react-router-dom";
import { createBrowserHistory } from 'history';
import axios from "axios";
import cookie from 'react-cookies';

function Redirect(props) {
    let history = createBrowserHistory();
    const [load,setLoad] = useState(false);
    async function fetchData(code) {
        try {
          const result = await axios({
            method: "get",
            url: `${process.env.REACT_APP_BACKEND_URL}/auth/token/${code}`,
          });
          cookie.save('auth_token', result.data.payload.data, { path: '/' });
          setLoad(true);
        } catch (err) {
          window.alert(err.message);
        }
      }
    
  let location = useLocation();
  useEffect(() => {
    let code = location.search;
    code = code.substr(6);
    fetchData(code);
    
  }, []);
  return <div>
      { load && <Navigate push to="/home"/> }
  </div>;
}

export default Redirect;
