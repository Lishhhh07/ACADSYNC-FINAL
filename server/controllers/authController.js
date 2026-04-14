/**
 * Register a new student
 */
export const registerStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        user: {
          email,
          role: "student",
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/**
 * Login student
 */
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    return res.json({
      success: true,
      data: {
        user: {
          email,
          role: "student",
        },
        token: "dummy-token",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * Register teacher
 */
export const registerTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    return res.status(201).json({
      success: true,
      data: {
        user: {
          email,
          role: "teacher",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/**
 * Login teacher
 */
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    return res.json({
      success: true,
      data: {
        user: {
          email,
          role: "teacher",
        },
        token: "dummy-token",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};