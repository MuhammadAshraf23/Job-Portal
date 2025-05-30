import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "./UserContext";

const jobContext = React.createContext();

const JobContext = ({ children }) => {
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState({ status: false, message: "" });
    const [jobs, setJobs] = useState({});
    const { user } = useUserContext();

    const handleJobFetch = async (url, params = {}) => {
        setJobLoading(true);
        try {
            // Add recruiterId to params if it exists in user
            if (user?._id && user?.role === "recruiter") {
                params.recruiterId = user._id;
            }
            
            const response = await axios.get(url, { params });
            if (response.data.status) {
                setJobs(response.data);
                setJobError({ status: false, message: "" });
            } else {
                setJobError({ status: true, message: "Failed to fetch jobs" });
                setJobs({ status: false });
            }
        } catch (error) {
            setJobError({ 
                status: true, 
                message: error?.response?.data?.message || "Error fetching jobs" 
            });
            setJobs({ status: false });
        } finally {
            setJobLoading(false);
        }
    };

    useEffect(() => {
        handleJobFetch("http://localhost:3000/api/v1/jobs", { page: 1 });
    }, [user]);

    const value = {
        jobLoading,
        jobError,
        jobs,
        setJobs,
        handleJobFetch,
    };

    return (
        <jobContext.Provider value={value}>
            {children}
        </jobContext.Provider>
    );
};
const useJobContext = () => {
    const context = useContext(jobContext);
    if (!context) {
        throw new Error("useJobContext must be used within a JobContext Provider");
    }
    return context;
};

export { useJobContext, JobContext };