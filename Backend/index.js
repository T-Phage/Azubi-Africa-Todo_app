import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// import initApp from "./src/modules/index.router.js";
// import "dotenv/config";

// const app = express();
// const PORT = process.env.PORT || 6005;

// initApp(app, express);

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });


//const express = require('express');
//const mongoose = require('mongoose');
//const cors = require('cors'); // Import CORS

const app = express();
const PORT = 3000;

// Use CORS Middleware
app.use(cors());
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));

// Middleware to parse JSON data
app.use(express.json());

// MongoDB Connection URI
// const MONGO_URI = 'mongodb://127.0.0.1:27017';
// const MONGO_URI = 'mongodb://mongo-shared-dev:fikTpih4U2!@20.218.241.192:27017/?directConnection=true&appName=mongosh+1.8.2&authMechanism=DEFAULT';
const MONGO_URI = 'mongodb://mongo-shared-dev:fikTpih4U2!@mongodb:27017/?authSource=admin'

const dbname = 'todos';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbname })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, default: 18 },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, },
  date: { type: String, },
  activity: { type: String, },
  description: { type: String, },
  strStatus: { type: String, }
});



const User = mongoose.model('User', userSchema);
const Todos = mongoose.model('Todos', todoSchema);

// Route: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route: Fetch all users
app.post('/api/todos', async (req, res) => {
  const { title, description, activity, date, strStatus } = req.body;

  try {
    const todo = new Todos({
      title,
      description,
      activity,
      date,
      strStatus
    });
    await todo.save();

    return res.status(201).send({ todo });
  } catch (error) {
    // if (error.errors.title)
    //   return res.status(400).send({ message: "the Title field is required" });

    // if (error.errors.description)
    //   return res
    //     .status(400)
    //     .send({ message: "the Description field is required" });

    // return res.status(500).send({ message: "Internal server error" });
    console.log(error);
    return res.status(500).send({ message: error });
  }
});
// Route: Fetch all users
app.get('/api/gettodos', async (req, res) => {

  try {
    // Parse query parameters with default values
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Get total count of documents for pagination info
    const total = await Todos.countDocuments();

    // Find todos with pagination
    const todoList = await Todos.find()
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const numOfPages = Math.ceil(total / limit);

    if (!todoList || todoList.length === 0) {
      return res.status(200).json({ 
        todoList: [],
        pagination: {
          total,
          page,
          limit,
          numOfPages
        }
      });
    }

    return res.status(200).json({ 
      todoList,
      pagination: {
        total,
        page,
        limit,
        numOfPages
      }
    });
    

    // const todoList = await Todos.find();

    // if (!todoList || todoList.length === 0) {
    //   return res.status(201).send({ todoList: [] });
    // }

    // return res.status(201).send({ todoList });
  } catch (error) {
    // if (error.errors.title)
    //   return res.status(400).send({ message: "the Title field is required" });

    // if (error.errors.description)
    //   return res
    //     .status(400)
    //     .send({ message: "the Description field is required" });

    // return res.status(500).send({ message: "Internal server error" });
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

app.delete('/api/todo/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todos.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).send({ message: `Todo with id ${id} not found` });
    }
    return res.status(200).send({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error deleting todo", error });
  }
});

// Route: Update a todo by ID
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, activity, date, strStatus } = req.body;

  try {
    const updatedTodo = await Todos.findByIdAndUpdate(
      id,
      { title, description, activity, date, strStatus },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    return res.status(200).send({ todo: updatedTodo });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating todo", error });
  }
});

// Routes
app.get('/', async (req, res) => {
  try {
    //const Todo = await TodoModel.find();
    res.send("Todo");
  }
  catch (e) {
    console.log(e);
  }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

