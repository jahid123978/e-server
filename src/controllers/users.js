const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
async function getAllUsers(request, response) {
  try {
    const users = await prisma.user.findMany({});
    return response.json(users);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching users" });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    console.log("Creating user:", req.body);

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "User already exists. Please sign in instead." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "user" },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Return minimal user info + token
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function login(req, res){
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Look up user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials." });
    }

    // Compare password hashes
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Return minimal user info + token
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

async function updateUser(request, response) {
  try {
    const { id } = request.params;
    const { email, password, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return response.status(200).json(updatedUser);
  } catch (error) {
    return response.status(500).json({ error: "Error updating user" });
  }
}

async function deleteUser(request, response) {
  try {
    const { id } = request.params;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error deleting user" });
  }
}

async function getUser(request, response) {
  const { id } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  return response.status(200).json(user);
}

async function getUserByEmail(request, response) {
  const { email } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  return response.status(200).json(user);
}

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserByEmail,
};
