// Pass the URL of your MongoDB instance as the first argument

import mongoose from "mongoose";

// Retrieve the MongoDB connection URL from command-line arguments
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

// Establish connection to MongoDB
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/**
 * Clears the entire database by dropping it.
 *
 * @returns {Promise<void>} A promise that resolves when the database is cleared.
 */
const clearDatabase = async (): Promise<void> => {
  try {
    await db.dropDatabase();
    console.log("Database cleared");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    if (db) db.close();
  }
};

// Execute the database clearing function
clearDatabase().catch((err) => {
  console.error("ERROR:", err);
  if (db) db.close();
});

console.log("Processing...");
