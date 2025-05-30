import React, { useEffect } from "react";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const EditProfile = () => {
    const { id } = useParams();
    const { user, setCurrentUser } = useUserContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (id && typeof id === 'string') {
            // Check if id has invalid characters and clean it
            if (id.includes('}')) {
               let id = id.replace(/[^a-f0-9]/gi, '');
            }
        }
    }, [id]);
    const userId = (id && id.length === 24) ? id : user?._id;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            FullName: user?.FullName || "",
            email: user?.email || "",
            role: user?.role || "",
            location: user?.location || "",
            resume: user?.resume || "",
            gender: user?.gender || "none"
        }
    });

    // Update user profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await axios.patch(
                `http://localhost:3000/api/v1/users/${id}`,
                userData
            );
            return response.data;
        },
        onSuccess: (data) => {
            // Update user in context
            const updatedUser = { ...user, ...data.result };
            setCurrentUser(updatedUser);
            // Update local storage to persist changes
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Show success message
            Swal.fire({
                icon: "success",
                title: "Done",
                text: "Profile Updated",
            });
            
            // Navigate to dashboard
            navigate("/dashboard");
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.message || error?.message || "Failed to update profile",
            });
        }
    });

    const onSubmit = (data) => {
        const { FullName, location, resume, gender } = data;
        const updateUser = {};
        
        if (FullName && FullName !== user?.FullName) {
            updateUser.FullName = FullName;
        }
        if (location && location !== user?.location) {
            updateUser.location = location;
        }
        if (resume && resume !== user?.resume) {
            updateUser.resume = resume;
        }
        if (gender && gender !== user?.gender && gender !== "none") {
            updateUser.gender = gender;
        }
        
        // Only update if there are changes
        if (Object.keys(updateUser).length > 0) {
            updateProfileMutation.mutate(updateUser);
        } else {
            Swal.fire({
                icon: "info",
                title: "No Changes",
                text: "No changes were made to your profile",
            });
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-red-600 text-xl">
                    You need to be logged in to edit your profile
                </h2>
            </div>
        );
    }

    return (
        <Wrapper>
            <div className="">
                <div className="title-row">
                    Update Profile
                    <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
                </div>
                <div className="content-row">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="profile-form">
                            {/* FullName */}
                            <div className="row">
                                <label htmlFor="FullName">FullName</label>
                                <input
                                    type="text"
                                    id="FullName"
                                    name="FullName"
                                    placeholder="Type Here"
                                    {...register("FullName", {
                                        required: {
                                            value: true,
                                            message: "FullName required",
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: "Too long (max 30char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (min 3char)",
                                        },
                                    })}
                                />
                                {errors?.FullName && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.FullName?.message}
                                    </span>
                                )}
                            </div>

                            {/* email */}
                            <div className="row">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Type Here"
                                    {...register("email")}
                                    readOnly
                                />
                            </div>

                            {/* role */}
                            <div className="row">
                                <label htmlFor="role">Role</label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    placeholder="Type Here"
                                    {...register("role")}
                                    readOnly
                                />
                            </div>

                            {/* Location */}
                            <div className="row">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="Location"
                                    {...register("location", {
                                        maxLength: {
                                            value: 150,
                                            message: "Too long (max 150char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (min 3char)",
                                        },
                                    })}
                                />
                                {errors?.location && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.location?.message}
                                    </span>
                                )}
                            </div>

                            {/* Resume */}
                            <div className="row">
                                <label htmlFor="resume">Resume Link</label>
                                <input
                                    type="text"
                                    id="resume"
                                    name="resume"
                                    placeholder="google drive link"
                                    {...register("resume", {
                                        required: {
                                            value: true,
                                            message: "Resume link is required",
                                        },
                                        maxLength: {
                                            value: 500,
                                            message: "Enter valid link",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (min 3char)",
                                        },
                                    })}
                                />
                                {errors?.resume && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.resume?.message}
                                    </span>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="row">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    {...register("gender", {
                                        validate: {
                                            valueType: (value) => {
                                                return (
                                                    value !== "none" ||
                                                    "Select One"
                                                );
                                            },
                                        },
                                    })}
                                >
                                    <option value="none">Select Gender</option>
                                    <option value="male">male</option>
                                    <option value="female">female</option>
                                    <option value="others">others</option>
                                </select>
                                {errors?.gender && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.gender?.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 w-full flex justify-center">
                            <button
                                type="submit"
                                className="btn p-2 rounded"
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .title-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: calc(0.9rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        position: relative;
    }
    .title-row:before {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: calc(30px + 0.7vw);
        height: calc(2px + 0.1vw);
        background-color: var(--color-primary);
    }
    .content-row {
        width: 100%;
        margin: 0 auto;
        margin-top: calc(2rem + 0.5vw);
        align-items: center;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1),
            -2px -2px 4px rgba(0, 0, 0, 0.1);
        padding: 2rem 2rem;
        border-radius: 6px;
    }
    .profile-form {
        margin-top: calc(30px + 1vw);
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, minmax(auto, 400px));
        justify-content: center;
        align-items: center;
        grid-gap: calc(1rem + 0.5vw);
    }
    @media screen and (max-width: 800px) {
        .profile-form {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media screen and (max-width: 500px) {
        .profile-form {
            grid-template-columns: 1fr;
        }
        .content-row {
            padding: 2rem 1rem;
        }
    }
    .row {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .row label {
        font-size: 11.3px;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--color-black);
        opacity: 0.95;
    }
    input,
    select,
    textarea {
        width: 100%;
        max-width: 500px;
        padding: 8px 14px;
        margin-top: 6px;
        display: inline-block;
        border: 1px solid #0000004a;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: calc(0.8rem + 0.1vw);
        outline: none;
        color: var(--color-black);
    }
    textarea {
        max-width: none;
        min-height: 100px;
    }
    select {
        padding-left: 2px;
        text-transform: capitalize;
    }
    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border: 1px solid #00000086;
    }
    .input-cls {
        max-width: none;
        width: 100%;
        font-size: 13px;
        padding: 5px 10px;
    }
    .tag-cls {
        font-size: 14px;
    }
    /* .rti--container {
        border: 1px solid #00000086;
    } */
    .btn {
        width: 100%;
        max-width: 150px;
        height: 100%;
        display: inline-block;
        background-color: var(--color-black);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s linear;
        text-transform: capitalize;
        font-size: calc(0.9rem + 0.1vw);
    }
    .btn:hover {
        background-color: var(--color-primary);
    }
    @media screen and (max-width: 600px) {
        .btn {
            margin: 0 auto;
            margin-top: -6px;
        }
    }
`;

export default EditProfile;
