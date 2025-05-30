const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET,POST,DELETE,PUT,PATCH"],
        credentials: true,
    })
);


// Routers
const JobRouter = require("./Router/JobRouter");
const UserRouter = require("./Router/UserRouter");
const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");

// Connecting routes
app.use("/api/v1/Jobs", JobRouter);
app.use("/api/v1/Users",  UserRouter);
app.use("/api/v1/Auth", AuthRouter);
app.use("/api/v1/Admin", AdminRouter);
app.use("/api/v1/Application", ApplicationRouter);

module.exports = app;
