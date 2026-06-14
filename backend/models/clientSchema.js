import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
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
      type: String
    },

    role: {
      type: String,
      default: "client"
    },

    // Email Verification

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

    // Company Details
    companyName: {
      type: String
    },

    companyWebsite: {
      type: String
    },

    companyDescription: {
      type: String
    },

    industry: {
      type: String
    },
    companyLogo: {
      type: String
    },
    talent: [{
      type: String
    }],
    phone: {
      type: String
    },
    address: {
      type: String
    },

    // Client Stats
    totalJobsPosted: {
      type: Number,
      default: 0
    },

    totalHires: {
      type: Number,
      default: 0
    },

    totalSpent: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    // Verification Badge (Optional Future)
    isCompanyVerified: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const clientModel = mongoose.models.Client || mongoose.model("Client", clientSchema);
export default clientModel;
