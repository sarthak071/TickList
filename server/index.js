require("dotenv").config();
const { connectToMongoDB } = require("./database");
const express = require("express");
const app = express();
const path= require("path");
app.use(express.json()); // Fix here: calling the function correctly

// Logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

const router = require("./routes");
app.use("/api", router);

app.use(express.static(path.join(__dirname,"build")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"));
})

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();
