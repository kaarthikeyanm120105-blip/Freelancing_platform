import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    yearCompleted: { type: Number, required: true },
    stream: { type: String, required: true },
});

const freelancerSchema = new mongoose.Schema(
    {
        // Basic Info
        fullName: {
            type: String,
            required: true,
            trim: true
        },



        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        profileImage: {
            type: String   // Cloudinary URL
        },

        role: {
            type: String,
            default: "freelancer"
        },

        // Verification

        verifyOtp: {
            type: String,
            default: ""
        },

        verifyOtpExpire: {
            type: Date,
            default: Date.now() + 10 * 60 * 1000
        },

        isAccountVerified: {
            type: Boolean,
            default: false
        },

        resetOtp: {
            type: String,
            default: ""
        },

        resetOtpExpire: {
            type: Date,
            default: Date.now() + 10 * 60 * 1000
        },


        // Professional Info

        education: [educationSchema],
        title: {
            type: String  // e.g. "Full Stack Developer"
        },

        bio: {
            type: String
        },

        skills: [
            {
                type: String
            }
        ],

        experienceLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Expert"]
        },

        hourlyRate: {
            type: Number
        },

        languages: [
            {
                type: String
            }
        ],

        // Portfolio
        portfolioLinks: [
            {
                type: String
            }
        ],

        certifications: [
            {
                name: { type: String },
                issuer: { type: String },
                date: { type: Date },
                link: { type: String },
                verified: { type: Boolean, default: false }
            }
        ],

        resume: {
            type: String   // PDF 
        },

        // Rating System
        rating: {
            type: Number,
            default: 0
        },

        totalReviews: {
            type: Number,
            default: 0
        },

        completedProjects: {
            type: Number,
            default: 0
        },

        // Availability
        isAvailable: {
            type: Boolean,
            default: true
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const freelancerModel = mongoose.models.Freelancer || mongoose.model("Freelancer", freelancerSchema);

export default freelancerModel;

