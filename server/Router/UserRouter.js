const express = require("express");
const UserRouter = express.Router();

// Controllers
const UserController = require("../Controller/UserController");

// User routes
UserRouter.get("/", UserController.getAllUser);
UserRouter.delete("/", UserController.deleteAllUsers);

UserRouter.get("/:id", UserController.getSingleUser);
UserRouter.patch("/:id", UserController.updateUser);
UserRouter.delete("/:id", UserController.deleteUser);

module.exports = UserRouter;