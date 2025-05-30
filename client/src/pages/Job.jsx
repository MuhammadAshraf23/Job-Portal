import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSingleHandler } from "../utils/FetchHandlers";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import { MdAccessTime, MdLocationOn, MdWork } from "react-icons/md";
import { BsCashCoin, BsCalendarCheck } from "react-icons/bs";
import Navbar from "../components/shared/Navbar";

dayjs.extend(advancedFormat);

const Job = () => {
    const { id } = useParams();
    const {
        isLoading,
        isError,
        data: job,
        error,
    } = useQuery({
        queryKey: ["job", id], // Added id to cache key for better caching
        queryFn: () =>
            getSingleHandler(
                `http://localhost:3000/api/v1/jobs/${id}`
            ),
    });

    if (isLoading) {
        return <LoadingComTwo />;
    }
    
    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center p-8 bg-red-50 rounded-lg shadow-md max-w-md">
                    <h2 className="text-xl text-red-600 font-semibold">Error Loading Job</h2>
                    <p className="mt-2 text-gray-700">{error?.message}</p>
                </div>
            </div>
        );
    }

    const date = job?.jobDeadline ? dayjs(job.jobDeadline).format("MMM Do, YYYY") : "No deadline specified";
    const createdDate = job?.createdAt ? dayjs(job.createdAt).format("MMM Do, YYYY") : "";

    console.log("Job Data:", job);
    return (
        <>
            <Navbar />
            <PageWrapper>
                <JobContainer>
                    {/* Job Header */}
                    <div className="job-header">
                        <div className="logo">
                            <span>{job?.company?.[0] || "C"}</span>
                        </div>
                        <div>
                            <h1 className="job-title">{job?.position || "Job Title"}</h1>
                            <h2 className="company-name">{job?.company || "Company Name"}</h2>
                            <div className="job-meta">
                                <span className="job-meta-item">
                                    <MdLocationOn className="icon" />
                                    {job?.jobLocation || "Location"}
                                </span>
                                <span className="job-meta-item">
                                    <MdWork className="icon" />
                                    {job?.jobType || "Job Type"}
                                </span>
                                <span className="job-meta-item">
                                    <BsCashCoin className="icon" />
                                    {job?.salary ? `${job.salary} USD` : "Salary not specified"}
                                </span>
                            </div>
                            <div className="posted-date">
                                <MdAccessTime className="icon" />
                                <span>Posted on {createdDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="job-details">
                        {/* Description */}
                        <section className="detail-section">
                            <h3 className="section-title">Job Description</h3>
                            <div className="section-content">
                                <p>{job?.jobDescription || "No description provided."}</p>
                            </div>
                        </section>

                        {/* Skills Required */}
                        <section className="detail-section">
                            <h3 className="section-title">Skills Required</h3>
                            <div className="section-content">
                                {job?.jobSkills && job.jobSkills.length > 0 ? (
                                    <ul className="skills-list">
                                        {job.jobSkills.map((skill, index) => (
                                            <li key={index} className="skill-item">{skill}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No specific skills mentioned.</p>
                                )}
                            </div>
                        </section>

                        {/* Deadline */}
                        <section className="detail-section">
                            <h3 className="section-title">Application Details</h3>
                            <div className="section-content">
                                <div className="application-meta">
                                    <div className="meta-item">
                                        <BsCalendarCheck className="icon" />
                                        <span><strong>Deadline:</strong> {date}</span>
                                    </div>
                                </div>
                                <div className="application-instructions">
                                    <h4>How to Apply</h4>
                                    <p>Apply through our job portal or send your resume directly.</p>
                                    <button className="apply-button">Apply Now</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </JobContainer>
            </PageWrapper>
        </>
    );
};

const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 2rem 1rem;
    background-color: #f5f5f5;
    min-height: calc(100vh - 60px);
`;

const JobContainer = styled.div`
    max-width: 900px;
    width: 100%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    
    .job-header {
        padding: 2rem;
        background-color: #f9f9f9;
        border-bottom: 1px solid #eaeaea;
        display: flex;
        gap: 1.5rem;
        align-items: center;
        
        .logo {
            width: 70px;
            height: 70px;
            border-radius: 8px;
            background-color: #19b74b;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .job-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .company-name {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 1rem;
        }
        
        .job-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 0.5rem;
            
            .job-meta-item {
                display: flex;
                align-items: center;
                color: #555;
                font-size: 0.9rem;
                
                .icon {
                    margin-right: 0.25rem;
                    font-size: 1rem;
                }
            }
        }
        
        .posted-date {
            display: flex;
            align-items: center;
            color: #777;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            
            .icon {
                margin-right: 0.25rem;
            }
        }
    }
    
    .job-details {
        padding: 2rem;
        
        .detail-section {
            margin-bottom: 2rem;
            
            .section-title {
                font-size: 1.3rem;
                color: #333;
                font-weight: 600;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #19b74b;
                display: inline-block;
            }
            
            .section-content {
                color: #555;
                line-height: 1.6;
                
                p {
                    margin-bottom: 1rem;
                }
                
                .skills-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    
                    .skill-item {
                        background-color: #f0f8f3;
                        padding: 0.4rem 0.8rem;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        color: #19b74b;
                        border: 1px solid #d0e8d9;
                    }
                }
                
                .application-meta {
                    margin-bottom: 1rem;
                    
                    .meta-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 0.5rem;
                        
                        .icon {
                            color: #19b74b;
                        }
                    }
                }
                
                .application-instructions {
                    background-color: #f9f9f9;
                    padding: 1rem;
                    border-radius: 8px;
                    
                    h4 {
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 0.5rem;
                    }
                    
                    .apply-button {
                        margin-top: 1rem;
                        background-color: #19b74b;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 0.7rem 1.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        
                        &:hover {
                            background-color: #148f3a;
                        }
                    }
                }
            }
        }
    }
    
    @media (max-width: 768px) {
        .job-header {
            flex-direction: column;
            align-items: flex-start;
            
            .logo {
                width: 60px;
                height: 60px;
                font-size: 1.5rem;
            }
            
            .job-title {
                font-size: 1.5rem;
            }
            
            .company-name {
                font-size: 1.1rem;
            }
            
            .job-meta {
                gap: 0.7rem;
            }
        }
        
        .job-details {
            padding: 1.5rem;
        }
    }
`;

export default Job;