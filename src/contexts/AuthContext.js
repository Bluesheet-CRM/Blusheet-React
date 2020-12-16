import React, {useState, useEffect} from "react";
import app from "../utils/base";

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingAuth,setLoadingAuth] = useState(false);
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        app.auth().onAuthStateChanged(user => {
            setCurrentUser(user);
            setAuth(true);
            setLoadingAuth(true);
        });
    }, []);
    return <AuthContext.Provider value={{currentUser, auth,setAuth,loadingAuth}}>{children}</AuthContext.Provider>;
};
