import React, { useContext, useState } from "react";

const userContext = React.createContext();

const UserContext = ({ children }) => {
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState({ status: false, message: "" });
    const [user, setUser] = useState(null);

    // Function to set user after login/register
    const setCurrentUser = (userData) => {
        setUser(userData);
        // Optionally store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to clear user on logout
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check localStorage on initial load
    useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const passing = { 
        userLoading, 
        userError, 
        user, 
        setCurrentUser, 
        clearUser 
    };

    return (
        <userContext.Provider value={passing}>{children}</userContext.Provider>
    );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };