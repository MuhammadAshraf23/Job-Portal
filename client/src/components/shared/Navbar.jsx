/* eslint-disable react/prop-types */

import styled from "styled-components";
import Logo from "../Logo";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ navbarRef }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user from local storage
        const user = localStorage.getItem("user");
        if (user) {
            try {
                setUser(JSON.parse(user));
            } catch (error) {
                console.error("Error parsing user from local storage:", error);
                setUser(null);
            }
        }
    }, []);
    return (
        <Wrapper ref={navbarRef}>
            <div className="container">
                <Logo />
                <div className="flex justify-end items-center">
                    <NavLink className="nav-item" to="/all-jobs">
                        Jobs
                    </NavLink>
                    <NavLink className="nav-item hidden sm:block" to="/dashboard">
                        Dashboard
                    </NavLink>
                    {user ? (
                        <span className="nav-item FullName">
                            {user.FullName}
                        </span>
                    ) : (
                        <NavLink className="nav-item" to="/login">
                            <span className="bg-[#247BF7] text-white px-6 py-2 rounded">Login</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 5px 5px var(--shadow-light);
    .container {
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .container .nav-item {
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
        margin-left: 20px;
        color: var(--color-black);
    }
    .container .nav-item.active {
        color: var(--color-primary);
    }
    .container .FullName {
        font-size: 16px;
        font-weight: 500;
        color: var(--color-black);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        background: var(--color-light);
    }
    @media screen and (max-width: 1200px) {
        padding: 1rem 2rem;
    }
    @media screen and (max-width: 600px) {
        padding: 1.2rem 1rem;
        .container {
            display: flex;
            /* justify-content: center; */
        }
    }
`;

export default Navbar;