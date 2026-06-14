import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import freelancerModel from "../models/freelancerSchema.js";
import clientModel from "../models/clientSchema.js";
import transporter from "../config/mail.js";

export const register = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        let missing = [];
        if (!fullName) missing.push("fullName");
        if (!email) missing.push("email");
        if (!password) missing.push("password");
        if (!role) missing.push("role");
        return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }

    try {
        const normalizedRole = role.toLowerCase().trim();
        const existingUser = await freelancerModel.findOne({ email }) || await clientModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        let user;

        if (normalizedRole === "freelancer") {
            user = new freelancerModel({
                fullName,
                email,
                password: hashedPassword,
                role: normalizedRole
            });
        } else if (normalizedRole === "client") {
            user = new clientModel({
                fullName,
                email,
                password: hashedPassword,
                role: normalizedRole
            });
        } else {
            return res.status(400).json({ success: false, message: `Invalid role: ${role}. Expected 'freelancer' or 'client'.` });
        }

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const { password: _, ...userData } = user._doc;
        res.status(201).json({ success: true, message: "User registered successfully", user: userData, role: user.role });


    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await freelancerModel.findOne({ email }) || await clientModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: "Your account has been blocked by the admin." });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const { password: _, ...userData } = user._doc;
        res.status(200).json({ success: true, message: "Login successful", user: userData, role: user.role });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

export const logout = async (req, res) => {

    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const userId = req.userId; // Use userId from middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID" });
        }

        const user = await freelancerModel.findById(userId) || await clientModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email",
            text: `Your verification code is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Verification OTP sent successfully" });

    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId; // Use userId from middleware
        const { otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: "User ID and OTP are required" });
        }

        const user = await freelancerModel.findById(userId) || await clientModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp !== otp || user.verifyOtp === "" || user.verifyOtp === null) {
            return res.status(401).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpire < Date.now()) {
            return res.status(401).json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpire = null;
        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Verify email error:", error);
        res.status(500).json({ success: false, message: "Email verification failed" });
    }
};

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await freelancerModel.findById(userId) || await clientModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { password, ...userData } = user._doc;

        res.status(200).json({ success: true, role: user.role, user: userData });

    } catch (error) {
        console.error("Get user data error:", error);
        res.status(500).json({ success: false, message: "Failed to get user data" });
    }
};

export const freelancerSetupProfile = async (req, res) => {
    const { education, skills, bio } = req.body;

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!education || !Array.isArray(education) || !skills || !Array.isArray(skills)) {
            return res.status(400).json({ success: false, message: "Education and skills are required" });
        }

        const user = await freelancerModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if ((user.education?.length || 0) > 0 || (user.skills?.length || 0) > 0 || (user.bio?.length || 0) > 0) {
            return res.status(400).json({ success: false, message: "Profile already set" });
        }

        // Set education, skills, bio
        user.education = education;
        user.skills = skills;
        user.bio = bio;

        await user.save(); // <--- important

        const { password, ...userData } = user._doc;

        res.status(201).json({ success: true, user: userData });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};



export const freelancerUpdateProfile = async (req, res) => {
    try {
        const userId = req.userId; // from JWT middleware
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const {
            education,
            title,
            bio,
            skills,
            experienceLevel,
            hourlyRate,
            languages,
            portfolioLinks,
            certifications,
        } = req.body;

        const user = await freelancerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle file uploads
        let resumePath = user.resume;
        let profileImagePath = user.profileImage;

        if (req.files) {
            if (req.files.resume && req.files.resume[0]) {
                resumePath = `/uploads/resumes/${req.files.resume[0].filename}`;
            }
            if (req.files.profileImage && req.files.profileImage[0]) {
                profileImagePath = `/uploads/profiles/${req.files.profileImage[0].filename}`;
            }
        }

        // Set profile fields if provided
        if (education) user.education = JSON.parse(education);
        if (title !== undefined) user.title = title;
        if (bio !== undefined) user.bio = bio;
        if (skills) user.skills = JSON.parse(skills);
        if (experienceLevel) user.experienceLevel = experienceLevel;
        if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
        if (languages) user.languages = JSON.parse(languages);
        if (portfolioLinks) user.portfolioLinks = JSON.parse(portfolioLinks);
        if (certifications) user.certifications = JSON.parse(certifications);
        user.resume = resumePath;
        user.profileImage = profileImagePath;

        await user.save();

        const { password: _, ...userData } = user._doc;
        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error("Setup profile error:", error);
        res.status(500).json({ success: false, message: "Failed to set up profile" });
    }
};

export const clientSetupProfile = async (req, res) => {
    const { companyName, companyDescription, industry, companyWebsite, talent } = req.body;

    if (!companyName || !companyDescription || !industry || !companyWebsite || !talent) {
        return res.status(400).json({ success: false, message: "Company name, description, industry, website, and talent categories are required" });
    }

    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }



        const user = await clientModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if ((user.companyName?.length || 0) > 0 || (user.companyDescription?.length || 0) > 0 || (user.companyLogo?.length || 0) > 0) {
            return res.status(400).json({ success: false, message: "Profile already set" });
        }

        // Set company name, description, logo
        user.companyName = companyName;
        user.companyDescription = companyDescription;
        user.industry = industry;
        user.companyWebsite = companyWebsite;
        user.talent = talent;

        await user.save(); // <--- important

        const { password, ...userData } = user._doc;

        res.status(201).json({ success: true, user: userData });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

export const clientUpdateProfile = async (req, res) => {

    const { companyName, companyDescription, industry, companyWebsite, companyLogo, phone, address, talent } = req.body;
    try {
        const userId = req.userId; // from JWT middleware
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }



        const user = await clientModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle file uploads
        let companyLogoPath = user.companyLogo;

        if (req.files) {
            if (req.files.companyLogo && req.files.companyLogo[0]) {
                companyLogoPath = `/uploads/logos/${req.files.companyLogo[0].filename}`;
            }
        }

        // Set profile fields if provided
        if (companyName !== undefined) user.companyName = companyName;
        if (companyDescription !== undefined) user.companyDescription = companyDescription;
        if (industry !== undefined) user.industry = industry;
        if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (talent) user.talent = JSON.parse(talent);
        user.companyLogo = companyLogoPath;

        await user.save();

        const { password: _, ...userData } = user._doc;
        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query, role } = req.query;
        let searchCriteria = {};

        if (query) {
            searchCriteria.$or = [
                { fullName: { $regex: query, $options: 'i' } },
                { skills: { $regex: query, $options: 'i' } },
                { companyName: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ];
        }

        let users = [];
        if (!role || role === 'freelancer') {
            const freelancers = await freelancerModel.find(searchCriteria).select("-password -verifyOtp -resetOtp -verifyOtpExpire -resetOtpExpire");
            users = [...users, ...freelancers];
        }

        if (!role || role === 'client') {
            const clients = await clientModel.find(searchCriteria).select("-password -verifyOtp -resetOtp -verifyOtpExpire -resetOtpExpire");
            users = [...users, ...clients];
        }

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Search users error:", error);
        res.status(500).json({ success: false, message: "Search failed" });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await freelancerModel.findById(id).select("-password -verifyOtp -resetOtp") ||
            await clientModel.findById(id).select("-password -verifyOtp -resetOtp");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get public profile error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};
