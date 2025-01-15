const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Use JSON parser

// MongoDB Connection
mongoose.connect(process.env.MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Car Schema and Model
const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  color: { type: String, required: true },
  image_url: { type: String, required: true },
});

const Car = mongoose.model("Car", carSchema);

// SignUp Route
app.post("/api/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Add Car to Inventory
app.post("/api/inventory", async (req, res) => {
  const car = new Car(req.body);
  try {
    await car.save();
    res.json({ message: "Car added successfully!", car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add car" });
  }
});

// Get Cars from Inventory with Filters
app.get("/api/inventory", async (req, res) => {
  const { price, mileage, color } = req.query;
  const filters = {};

  if (price) filters.price = { $lte: Number(price) };
  if (mileage) filters.mileage = { $lte: Number(mileage) };
  if (color) filters.color = color;

  try {
    const cars = await Car.find(filters);
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// Update Car in Inventory
app.put("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car updated successfully!", car: updatedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update car" });
  }
});

// Delete Car from Inventory
app.delete("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete car" });
  }
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
