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
  console.time('login_total_student');
  console.log('[Auth] Login student request received');

  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  // Find student
  console.time('firestore_query_student');
  const studentsRef = db.collection('students');
  const snapshot = await studentsRef
  .where('email', '==', email)
  .limit(1)
  .get();
  console.timeEnd('firestore_query_student');

  if (snapshot.empty) {
    throw new Error('Invalid email or password');
  }

  const studentDoc = snapshot.docs[0];
  const studentData = studentDoc.data();

  // Verify password
  console.time('password_hash_student');
  const isValidPassword = await bcrypt.compare(password, studentData.password);
  console.timeEnd('password_hash_student');
  
  if (!isValidPassword) {
    console.log(`[Auth] Invalid password for student: ${email}`);
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  console.time('jwt_generation_student');
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: studentDoc.id, email, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.timeEnd('jwt_generation_student');

  console.log(`[Auth] Student logged in successfully: ${email}`);

  // Send login email (non-blocking)
  sendLoginEmail(email, 'Student').catch((emailError) => {
    console.error('Failed to send login email:', emailError);
    // Don't fail login if email fails
  });

  console.timeEnd('login_total_student');
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
  console.time('login_total_teacher');
  console.log('[Auth] Login teacher request received');

  if (!email || !password) {
    console.log('[Auth] Validation failed: missing email or password');
    throw new Error('Email and password are required');
  }

  // Find teacher
  console.time('firestore_query_teacher');
  const teachersRef = db.collection('teachers');
  const snapshot = await teachersRef
  .where('email', '==', email)
  .limit(1)
  .get();
  console.timeEnd('firestore_query_teacher');

  if (snapshot.empty) {
    throw new Error('Invalid email or password');
  }

  const teacherDoc = snapshot.docs[0];
  const teacherData = teacherDoc.data();

  // Verify password
  console.time('password_hash_teacher');
  const isValidPassword = await bcrypt.compare(password, teacherData.password);
  console.timeEnd('password_hash_teacher');
  
  if (!isValidPassword) {
    console.log(`[Auth] Invalid password for teacher: ${email}`);
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  console.time('jwt_generation_teacher');
  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is not set in environment variables');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { userId: teacherDoc.id, email, role: 'teacher' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.timeEnd('jwt_generation_teacher');

  console.log(`[Auth] Teacher logged in successfully: ${email}`);

  // Send login email (non-blocking)
  sendLoginEmail(email, 'Teacher').catch((emailError) => {
    console.error('Failed to send login email:', emailError);
    // Don't fail login if email fails
  });

  console.timeEnd('login_total_teacher');
  return {
    token,
    user: {
      id: teacherDoc.id,
      email,
      role: 'teacher',
    },
  };
};
