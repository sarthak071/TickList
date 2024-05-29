const express = require("express");
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");


const router = express.Router();

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("ticklistdb").collection("ticklist");
    return collection;
};

// GET METHOD
router.get("/todos", async (req, res) => {
    console.log("GET request to /api/todos");
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST METHOD
router.post("/todos", async(req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ mssg: "error no todo found"});
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({ todo, status: false });
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });

});

// DELETE METHOD
router.delete("/todos/:id", async(req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });

    res.status(200).json(deletedTodo);
});

// PUT METHOD
router.put("/todos/:id", async(req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
        return res.status(400).json({ mssg: "invalid status"});
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });

    res.status(200).json(updatedTodo);
});

module.exports = router;
