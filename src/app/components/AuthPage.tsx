import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Shield, ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI, setToken } from "../utils/api";

interface AuthPageProps {
  onBack: () => void;
  onStudentLogin: () => void;
  onFacultyLogin: () => void;
}

export function AuthPage({ onBack, onStudentLogin, onFacultyLogin }: AuthPageProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "faculty" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Warm up backend connection on component mount
  useEffect(() => {
    const warmupBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('[AuthPage] Warming up backend connection...');
        const response = await fetch(`${apiUrl}/health`, { method: 'GET' });
        if (response.ok) {
          console.log('[AuthPage] Backend warmup successful');
        }
      } catch (error) {
        console.warn('[AuthPage] Backend warmup failed (this is ok):', error);
      }
    };
    
    warmupBackend();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    // Retry logic: attempt login up to 2 times
    let lastError: any;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AuthPage] Login attempt ${attempt}/2`);
        let response;
        if (selectedRole === "student") {
          response = isRegisterMode
            ? await authAPI.registerStudent(email, password)
            : await authAPI.loginStudent(email, password);
        } else {
          response = isRegisterMode
            ? await authAPI.registerTeacher(email, password)
            : await authAPI.loginTeacher(email, password);
        }

        // Store token
        setToken(response.data.token);

        // Navigate to dashboard
        if (selectedRole === "student") {
          onStudentLogin();
        } else {
          onFacultyLogin();
        }
        return;
      } catch (err: any) {
        lastError = err;
        if (attempt < 2) {
          console.warn(`[AuthPage] Login attempt ${attempt} failed, retrying...`);
          // Wait 500ms before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    setError(lastError?.message || "Login failed. Please try again.");
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-violet-500/40 to-purple-500/40 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* Role Selection */
            <motion.div
              key="role-selection"
              className="w-full max-w-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-100 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-lg text-white/60">
                  Select your role to continue
                </p>
              </motion.div>

              {/* Role selection cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Student Login Card */}
                <motion.button
                  onClick={() => setSelectedRole("student")}
                  className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className="relative z-10 space-y-6">
                    <motion.div
                      className="relative w-20 h-20 mx-auto"
                      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>

                    <div className="space-y-2">
                      <h2 className="text-3xl text-white">
                        Student Login
                      </h2>
                      <p className="text-white/60">
                        Access your class schedules and book appointments
                      </p>
                    </div>

                    <motion.div
                      className="flex items-center justify-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-sm">Continue</span>
                      →
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{ transform: "skewX(-20deg)" }}
                  />
                </motion.button>

                {/* Faculty Login Card */}
                <motion.button
                  onClick={() => setSelectedRole("faculty")}
                  className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/50 transition-all duration-500"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className="relative z-10 space-y-6">
                    <motion.div
                      className="relative w-20 h-20 mx-auto"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>

                    <div className="space-y-2">
                      <h2 className="text-3xl text-white">
                        Faculty Access
                      </h2>
                      <p className="text-white/60">
                        Faculty Access Only - Secure Admin Portal
                      </p>
                    </div>

                    <motion.div
                      className="flex items-center justify-center gap-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-sm">Continue</span>
                      →
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{ transform: "skewX(-20deg)" }}
                  />
                </motion.button>
              </div>

              <motion.p
                className="text-center mt-12 text-sm text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Secure authentication powered by ACADSYNC
              </motion.p>
            </motion.div>
          ) : (
            /* Login Form */
            <motion.div
              key="login-form"
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
              >
                {/* Gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    selectedRole === "student"
                      ? "from-cyan-500/10 to-blue-500/10"
                      : "from-violet-500/10 to-purple-500/10"
                  }`}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <motion.div
                      className="relative w-16 h-16 mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          selectedRole === "student"
                            ? "from-cyan-500 to-blue-500"
                            : "from-violet-500 to-purple-500"
                        } rounded-2xl blur-lg opacity-60`}
                      />
                      <div
                        className={`relative w-full h-full bg-gradient-to-br ${
                          selectedRole === "student"
                            ? "from-cyan-500 to-blue-500"
                            : "from-violet-500 to-purple-500"
                        } rounded-2xl flex items-center justify-center`}
                      >
                        {selectedRole === "student" ? (
                          <GraduationCap className="w-8 h-8 text-white" />
                        ) : (
                          <Shield className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </motion.div>

                    <div>
                      <h2 className="text-3xl text-white mb-2">
                        {selectedRole === "student" ? "Student Login" : "Faculty Access"}
                      </h2>
                      <p className="text-sm text-white/60">
                        {selectedRole === "student"
                          ? "Enter your credentials to continue"
                          : "Secure admin authentication required"}
                      </p>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Form fields */}
                  <div className="space-y-4">
                    {/* Email field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm text-white/80 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:bg-white/10 transition-all outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Password field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm text-white/80 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleLogin();
                            }
                          }}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:bg-white/10 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Login button */}
                  <motion.button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`group relative w-full py-4 bg-gradient-to-r ${
                      selectedRole === "student"
                        ? "from-cyan-500 to-blue-500"
                        : "from-violet-500 to-purple-500"
                    } rounded-xl overflow-hidden disabled:opacity-50`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        selectedRole === "student"
                          ? "from-cyan-400 to-blue-400"
                          : "from-violet-400 to-purple-400"
                      } opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
                    />

                    <span className="relative flex items-center justify-center gap-2 text-white">
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Logging in...
                        </>
                      ) : (
                        <>
                          {isRegisterMode ? "Register" : "Login"} as {selectedRole === "student" ? "Student" : "Faculty"}
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Back button */}
                  <motion.button
                    onClick={() => setSelectedRole(null)}
                    className="w-full py-3 text-white/60 hover:text-white text-sm transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ← Back to role selection
                  </motion.button>

                  {/* Footer */}
                  <motion.div
                    className="pt-4 border-t border-white/10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-white/60">
                      {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                      <button
                        onClick={() => {
                          setIsRegisterMode(!isRegisterMode);
                          setError("");
                        }}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {isRegisterMode ? "Login" : `Create ${selectedRole === "student" ? "Student" : "Faculty"} Account`}
                      </button>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
