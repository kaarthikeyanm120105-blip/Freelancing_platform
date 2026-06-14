 import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import freelancerModel from '../models/freelancerSchema.js';
import clientModel from '../models/clientSchema.js';
import connectDB from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'thalapathy';

        // Check if admin already exists in either collection
        const existingAdmin = await freelancerModel.findOne({ email: adminEmail }) ||
            await clientModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // We'll store the admin in the freelancer collection for simplicity, but with the 'admin' role
        const admin = new freelancerModel({
            fullName: 'Platform Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isAccountVerified: true
        });

        await admin.save();
        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
