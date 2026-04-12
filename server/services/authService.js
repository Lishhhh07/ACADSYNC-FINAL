import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load env vars first
dotenv.config();

import { db } from '../config/firebase.js';
import { sendRegistrationEmail, sendLoginEmail } from '../config/mailer.js';

/**
 * Register a new student
 */
export const registerStudent = async (email, password) => {
  console.log('[Auth] Register student request received');

  // Validation
  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Check if student already exists
  const studentsRef = db.collection('students');
  const existingStudent = await studentsRef.where('email', '==', email).get();

  if (!existingStudent.empty) {
    throw new Error('Student with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create student document
  const studentData = {
    email,
    password: hashedPassword,
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  const docRef = await studentsRef.add(studentData);
  const studentId = docRef.id;

  // Generate JWT
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: studentId, email, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Auth] Student registered successfully: ${email}`);

  // Send registration email
  try {
    await sendRegistrationEmail(email, 'Student');
  } catch (emailError) {
    console.error('Failed to send registration email:', emailError);
    // Don't fail registration if email fails
  }

  return {
    token,
    user: {
      id: studentId,
      email,
      role: 'student',
    },
  };
};

/**
 * Login student
 */
export const loginStudent = async (email, password) => {
  console.log('[Auth] Login student request received');

  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  // Find student
  const studentsRef = db.collection('students');
  const snapshot = await studentsRef.where('email', '==', email).get();

  if (snapshot.empty) {
    throw new Error('Invalid email or password');
  }

  const studentDoc = snapshot.docs[0];
  const studentData = studentDoc.data();

  // Verify password
  const isValidPassword = await bcrypt.compare(password, studentData.password);
  if (!isValidPassword) {
    console.log(`[Auth] Invalid password for student: ${email}`);
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: studentDoc.id, email, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Auth] Student logged in successfully: ${email}`);

  // Send login email
  try {
    await sendLoginEmail(email, 'Student');
  } catch (emailError) {
    console.error('Failed to send login email:', emailError);
    // Don't fail login if email fails
  }

  return {
    token,
    user: {
      id: studentDoc.id,
      email,
      role: 'student',
    },
  };
};

/**
 * Register a new teacher
 */
export const registerTeacher = async (email, password) => {
  console.log('[Auth] Register teacher request received');

  // Validation
  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Check if teacher already exists
  const teachersRef = db.collection('teachers');
  const existingTeacher = await teachersRef.where('email', '==', email).get();

  if (!existingTeacher.empty) {
    throw new Error('Teacher with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create teacher document
  const teacherData = {
    email,
    password: hashedPassword,
    role: 'teacher',
    createdAt: new Date().toISOString(),
  };

  const docRef = await teachersRef.add(teacherData);
  const teacherId = docRef.id;

  // Generate JWT
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: teacherId, email, role: 'teacher' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Auth] Teacher registered successfully: ${email}`);

  // Send registration email
  try {
    await sendRegistrationEmail(email, 'Teacher');
  } catch (emailError) {
    console.error('Failed to send registration email:', emailError);
    // Don't fail registration if email fails
  }

  return {
    token,
    user: {
      id: teacherId,
      email,
      role: 'teacher',
    },
  };
};

/**
 * Login teacher
 */
export const loginTeacher = async (email, password) => {
  console.log('[Auth] Login teacher request received');

  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  // Find teacher
  const teachersRef = db.collection('teachers');
  const snapshot = await teachersRef.where('email', '==', email).get();

  if (snapshot.empty) {
    throw new Error('Invalid email or password');
  }

  const teacherDoc = snapshot.docs[0];
  const teacherData = teacherDoc.data();

  // Verify password
  const isValidPassword = await bcrypt.compare(password, teacherData.password);
  if (!isValidPassword) {
    console.log(`[Auth] Invalid password for teacher: ${email}`);
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: teacherDoc.id, email, role: 'teacher' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Auth] Teacher logged in successfully: ${email}`);

  // Send login email
  try {
    await sendLoginEmail(email, 'Teacher');
  } catch (emailError) {
    console.error('Failed to send login email:', emailError);
    // Don't fail login if email fails
  }

  return {
    token,
    user: {
      id: teacherDoc.id,
      email,
      role: 'teacher',
    },
  };
};
