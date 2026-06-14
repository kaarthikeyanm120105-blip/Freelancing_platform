import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dropIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const db = mongoose.connection.db;

        // Collections to check
        const collections = ["freelancers", "clients"];

        for (const colName of collections) {
            try {
                const collection = db.collection(colName);
                const indexes = await collection.indexes();

                // Look for userName index
                const userNameIndex = indexes.find(idx => idx.name === "userName_1");

                if (userNameIndex) {
                    console.log(`Dropping index 'userName_1' from collection '${colName}'...`);
                    await collection.dropIndex("userName_1");
                    console.log(`Successfully dropped index from '${colName}'.`);
                } else {
                    console.log(`No 'userName_1' index found in collection '${colName}'.`);
                }
            } catch (err) {
                console.error(`Error processing collection '${colName}':`, err.message);
            }
        }

        console.log("Finished dropping indexes.");
        process.exit(0);
    } catch (error) {
        console.error("Connection error:", error);
        process.exit(1);
    }
};

dropIndexes();
