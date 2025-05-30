import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";

const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useUserContext();
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/login",
                data,
            );
    
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: response?.data?.message,
            });
    
            if (response.data.status) {
                const user = response.data.result;
                setCurrentUser(user);
    
                // Redirect based on role
                if (user.role === "admin") {
                    navigate("/dashboard");
                } else if (user.role === "recruiter") {
                    navigate("/dashboard/my-jobs");
                } else {
                    navigate("/dashboard/my-jobs");
                }
                reset();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.message || "Login failed",
            });
        }
        setIsLoading(false);
    };
    

    return (
        <Wrapper>
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    {/* Email field */}
                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Enter email"
                        />
                        {errors.email && (
                            <span className="error">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="row">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required"
                            })}
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <span className="error">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    Do not have an account?
                    <Link className="link" to="/register"> Register</Link>
                </p>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: #f9faff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .container {
        background: var(--color-white);
        max-width: 360px;
        width: 100%;
        padding: 58px 44px;
        border: 1px solid #e1e2f0;
        border-radius: 4px;
        box-shadow: 0 0 5px 0 rgba(42, 45, 48, 0.12);
        transition: all 0.3s ease;
    }
    h1 {
        margin-top: 20px;
        text-align: center;
        text-transform: capitalize;
        font-size: calc(1rem + 0.5vw);
        font-weight: 600;
        color: var(--color-primary);
    }
    form {
        margin-top: calc(1rem + 0.9vw);
    }

    .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .row label {
        font-size: 12px;
        color: var(--color-black);
        font-weight: 400;
        margin-bottom: 2px;
    }

    .row input {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #d6d8e6;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease-out;
    }

    .row input:focus {
        outline: none;
        box-shadow: inset 2px 2px 5px 0 rgba(42, 45, 48, 0.12);
    }

    .row input::placeholder {
        color: var(--color-black);
        opacity: 0.7;
    }

    button {
        width: 50%;
        min-width: 90px;
        padding: 8px;
        font-size: 16px;
        letter-spacing: 1px;
        background: var(--color-accent);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin: 15px auto 0;
        transition: background 0.2s ease-out;
    }

    button:hover {
        background: var(--color-primary);
    }
    button:disabled {
        background: var(--color-gray);
        color: var(--color-black);
        cursor: not-allowed;
    }

    @media (max-width: 458px) {
        .container {
            width: 90%;
            padding: 30px 0;
        }
        form {
            padding: 0 20px;
        }
    }
    p .link {
        text-transform: capitalize;
        color: var(--color-primary);
    }
    p .link:hover {
        text-decoration: underline;
    }
`;

export default Login;
