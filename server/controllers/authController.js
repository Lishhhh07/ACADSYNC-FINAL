import * as authService from '../services/authService.js';

/**
 * Register a new student
 */
export const registerStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerStudent(email, password);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    
    // Handle conflict (email already exists)
    if (error.message.includes('already exists')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Login student
 */
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginStudent(email, password);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Register a new teacher
 */
export const registerTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerTeacher(email, password);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    
    // Handle conflict (email already exists)
    if (error.message.includes('already exists')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Login teacher
 */
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginTeacher(email, password);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
