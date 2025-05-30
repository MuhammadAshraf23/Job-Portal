const express = require("express");
const AdminRouter = express.Router();

// Controllers
const AdminController = require("../Controller/AdminController");

// Admin routes
AdminRouter.get("/info", AdminController.getAllInfo);
AdminRouter.get("/stats", AdminController.monthlyInfo);
AdminRouter.patch("/update-role", AdminController.updateUserRole);

module.exports = AdminRouter;