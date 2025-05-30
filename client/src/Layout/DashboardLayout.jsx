import React, { createContext, useContext, useState } from "react";
import Wrapper from "../assets/css/wrappers/Dashboard";
import { Outlet, useNavigate } from "react-router-dom";

import { SmallSidebar, LargeSidebar, DashboardNavbar } from "../components";
import Swal from "sweetalert2";

const DashboardContext = createContext();

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
    
        Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "You have been logged out successfully.",
        }).then(() => {
            navigate("/login");
        });
    };

    // passing values
    const values = { handleLogout, showSidebar, setShowSidebar };
    return (
        <DashboardContext.Provider value={values}>
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar />
                    <LargeSidebar />
                    <div className="">
                        <DashboardNavbar />
                        <div className="dashboard-page">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
