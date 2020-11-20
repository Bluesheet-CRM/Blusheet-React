import React, { useEffect, useState,useContext } from "react";
import { useLocation,Navigate } from "react-router-dom";
import { createBrowserHistory } from 'history';
import axios from "axios";
import cookie from 'react-cookies'
import { OpportunityContext } from "../../contexts/OpportunityContext";


function Redirect(props) {
    const {setSalesforceUser,salesforceUser} = useContext(OpportunityContext);
    let history = createBrowserHistory();
    console.log(setSalesforceUser);
    console.log(history)
    async function fetchData(code) {
        try {
          const result = await axios({
            method: "get",
            url: `${process.env.REACT_APP_BACKEND_URL}/auth/token/${code}`,
          });
          cookie.save('access_token', result.data.payload.data.token, { path: '/' });
          const url = result.data.payload.data.url;
          cookie.save('instance_url',url, { path: '/' });
          setSalesforceUser(true);
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
      { salesforceUser && <Navigate push to="/home"/> }
  </div>;
}

export default Redirect;
