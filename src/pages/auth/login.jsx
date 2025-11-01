import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService";
import { PenTool, Type, Users } from "lucide-react"; // icon đẹp gọn

const SketchnoteLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    try {
      const { roles } = await authService.login(email, password);
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("STAFF")) {
        navigate("/staff");
      } else if (roles.includes("DESIGNER")) {
        navigate("/designer");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#49C5E8]"
      style={{
        backgroundImage: "url('/images/sketchnote-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo and slogan */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Sketchnote
        </h1>
        <p className="text-white text-lg mt-2 italic">
          Write, draw, and collaborate – all in one intelligent space.
        </p>
      </motion.div>

      {/* Animated icons */}
      <motion.div
        className="absolute top-20 left-20 text-white opacity-70"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <PenTool size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-white opacity-70"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <Type size={40} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-40 text-white opacity-70"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Users size={40} />
      </motion.div>

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md backdrop-blur-md bg-opacity-90"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login to Sketchnote
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SketchnoteLogin;
