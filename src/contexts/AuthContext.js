import React, {useState, useEffect} from "react";
import app from "../utils/base";

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [auth, setAuth] = useState(true);
    // useEffect(() => {
    //     app.auth().onAuthStateChanged(user => {
    //         setCurrentUser(user);
    //         setLoading(false);
    //     });
    // }, []);
    return <AuthContext.Provider value={{currentUser, auth,setAuth}}>{children}</AuthContext.Provider>;
};
