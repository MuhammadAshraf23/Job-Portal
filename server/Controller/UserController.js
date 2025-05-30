const UserModel = require("../Model/UserModel");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.getAllUser = async (req, res, next) => {
    try {
        const result = await UserModel.find({}).select("-password");
        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                result,
            });
        } else {
            next(createError(200, "User list is empty"));
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            next(createError(404, "User not found"));
        } else {
            res.status(200).json({
                status: true,
                result: user,
            });
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.addUser = async (req, res, next) => {
    const data = req.body;
    try {
        const isUserExists = await UserModel.findOne({ email: data.email });
        if (isUserExists) {
            next(createError(400, "Email Already exists"));
        } else {
            if (data.email === "zfar@gmail.com") {
                data.role = "admin";
            } else {
                data.role = data.role === "recruiter" ? "recruiter" : "user";
            }

            const newUser = new UserModel(data);
            const result = await newUser.save();
            const { password, ...userWithoutPassword } = result.toObject();

            res.status(201).json({
                status: true,
                message: "User registered successfully",
                result: userWithoutPassword
            });
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};


exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(createError(401, "Invalid credentials"));
        }
        
        const { password: userPassword, ...userWithoutPassword } = user.toObject();
        res.status(200).json({
            status: true,
            message: "Login successful",
            result: userWithoutPassword
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError(400, "Invalid user ID format"));
        }
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return next(createError(404, "User not found"));
        }
        
        res.status(200).json({
            status: true,
            message: "User updated successfully",
            result: updatedUser
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError(400, "Invalid User ID format"));
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return next(createError(404, "User not found"));
        }

        res.status(200).json({
            status: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.deleteAllUsers = async (req, res, next) => {
    try {
        await UserModel.deleteMany({});
        res.status(200).json({
            status: true,
            message: "All users deleted successfully"
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};
