import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  _id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(name: string, email: string, password: string) {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)

  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    name,
    email,
  }
}

export async function authenticateUser(email: string, password: string) {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  }
}

export async function getUserById(userId: string) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require("mongodb")

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  if (!user) {
    return null
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  }
}
