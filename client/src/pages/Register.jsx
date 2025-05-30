import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";

const Register = () => {
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
    const { FullName, email, password, confirmPassword, role } = data;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    setIsLoading(true);
    const user = { FullName, email, password, role };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        user
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response?.data?.message,
      });
      if (response.data.status) {
        setCurrentUser(response.data.result);
        navigate("/login");
    }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Registration failed",
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
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* FullName field */}
          <div className="row">
            <label htmlFor="FullName">FullName</label>
            <input
              type="text"
              {...register("FullName", {
                required: "FullName is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters",
                },
              })}
              placeholder="Enter FullName"
            />
            {errors.FullName && (
              <span className="error">{errors.FullName.message}</span>
            )}
          </div>

          {/* Email field */}
          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          {/* Role field */}
          <div className="row">
            <label htmlFor="role">Select Role</label>
            <select
              {...register("role", {
                required: "Please select a role",
              })}
              className="select-input"
            >
              <option value="">Select role</option>
              <option value="user">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
            {errors.role && (
              <span className="error">{errors.role.message}</span>
            )}
          </div>
          {/* Password field */}
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              placeholder="Enter password"
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="row">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm password",
              })}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          Already have an account?
          <Link className="link" to="/login">
            {" "}
            Login
          </Link>
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
    font-size: calc(1rem + 0.3vw);
    font-weight: 600;
    color: var(--color-primary);
  }
  form {
    margin-top: calc(0.8rem + 0.7vw);
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
.row select {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #d6d8e6;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease-out;
        background-color: var(--color-white);
    }

    .row select:focus {
        outline: none;
        box-shadow: inset 2px 2px 5px 0 rgba(42, 45, 48, 0.12);
    }
  button {
    width: 50%;
    min-width: 100px;
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

export default Register;
