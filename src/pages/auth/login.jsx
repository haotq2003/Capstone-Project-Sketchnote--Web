import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService";
import {
  PenTool,
  Type,
  Users,
  Mail,
  Lock,
  ArrowRight,
  Brush,
  Palette,
  Pencil,
  Eraser,
  Shapes,
  Image,
  Layers,
  Sparkles,
  Scissors,
  Circle,
  Square,
  Triangle,
  Star,
  Heart,
  Smile,
} from "lucide-react";
import { message } from "antd";
import * as THREE from "three";

const SketchnoteLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Three.js background animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Create geometric shapes
    const geometries = [
      new THREE.TorusGeometry(0.7, 0.2, 16, 100),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.9),
    ];

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    const meshes = geometries.map((geo, i) => {
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.x = (i - 1) * 3;
      mesh.position.z = -2;
      return mesh;
    });

    meshes.forEach((mesh) => scene.add(mesh));

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      meshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.003 * (i + 1);
        mesh.rotation.y += 0.005 * (i + 1);
      });

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      message.warning({
        content: "Please fill in both email and password",
        duration: 3,
        style: { marginTop: "20vh" },
      });
      return;
    }

    setLoading(true);

    try {
      const { roles } = await authService.login(email, password);

      // Check if user is CUSTOMER only (not ADMIN or STAFF)
      const isCustomerOnly = roles.includes("CUSTOMER") &&
        !roles.includes("ADMIN") &&
        !roles.includes("STAFF");

      if (isCustomerOnly) {
        // Show access denied modal for customers
        message.error({
          content: (
            <div>
              <div className="font-semibold mb-2">Access Restricted</div>
              <div className="text-sm">This web platform is for Admin and Staff only.</div>
              <div className="text-sm mt-1">Please use our Mobile App instead.</div>
            </div>
          ),
          duration: 5,
          style: { marginTop: "20vh" },
        });

        // Logout and clear session
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('roles');

        setLoading(false);
        return;
      }

      message.success({
        content: "Login successful! Redirecting...",
        duration: 2,
        style: { marginTop: "20vh" },
      });

      setTimeout(() => {
        if (roles.includes("ADMIN")) {
          navigate("/admin");
        } else if (roles.includes("STAFF")) {
          navigate("/staff/courses");
        } else if (roles.includes("DESIGNER")) {
          navigate("/designer");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      message.error({
        content: error.message || "Login failed. Please try again.",
        duration: 3,
        style: { marginTop: "20vh" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Floating icons data - giống app vẽ vời
  const floatingIcons = [
    {
      Icon: Brush,
      position: "top-16 left-16",
      delay: 0,
      duration: 4,
      color: "text-pink-300",
    },
    {
      Icon: Palette,
      position: "top-24 right-20",
      delay: 0.5,
      duration: 5,
      color: "text-purple-300",
    },
    {
      Icon: Pencil,
      position: "top-40 left-32",
      delay: 1,
      duration: 4.5,
      color: "text-yellow-300",
    },
    {
      Icon: PenTool,
      position: "top-1/4 right-28",
      delay: 1.5,
      duration: 5.5,
      color: "text-blue-300",
    },
    {
      Icon: Eraser,
      position: "bottom-32 left-24",
      delay: 2,
      duration: 4.8,
      color: "text-red-300",
    },
    {
      Icon: Shapes,
      position: "bottom-40 right-32",
      delay: 0.8,
      duration: 5.2,
      color: "text-green-300",
    },
    {
      Icon: Type,
      position: "top-1/3 left-20",
      delay: 1.2,
      duration: 4.3,
      color: "text-cyan-300",
    },
    {
      Icon: Layers,
      position: "bottom-1/4 right-24",
      delay: 1.8,
      duration: 5.8,
      color: "text-indigo-300",
    },
    {
      Icon: Image,
      position: "top-1/2 right-16",
      delay: 0.3,
      duration: 4.6,
      color: "text-orange-300",
    },
    {
      Icon: Sparkles,
      position: "top-2/3 left-28",
      delay: 2.2,
      duration: 5.3,
      color: "text-yellow-200",
    },
    {
      Icon: Scissors,
      position: "bottom-1/3 left-36",
      delay: 1.6,
      duration: 4.9,
      color: "text-teal-300",
    },
    {
      Icon: Users,
      position: "top-1/2 left-12",
      delay: 0.6,
      duration: 5.6,
      color: "text-purple-200",
    },
    {
      Icon: Circle,
      position: "bottom-20 right-40",
      delay: 1.3,
      duration: 4.4,
      color: "text-pink-200",
    },
    {
      Icon: Square,
      position: "top-20 right-1/3",
      delay: 0.9,
      duration: 5.1,
      color: "text-blue-200",
    },
    {
      Icon: Triangle,
      position: "bottom-1/2 right-20",
      delay: 1.9,
      duration: 4.7,
      color: "text-green-200",
    },
    {
      Icon: Star,
      position: "top-3/4 right-1/4",
      delay: 0.4,
      duration: 5.4,
      color: "text-yellow-300",
    },
    {
      Icon: Heart,
      position: "bottom-1/4 left-1/4",
      delay: 1.4,
      duration: 5.9,
      color: "text-red-200",
    },
    {
      Icon: Smile,
      position: "top-1/3 right-1/3",
      delay: 2.1,
      duration: 4.2,
      color: "text-orange-200",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4]">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-500/20"
        style={{ zIndex: 2 }}
      />

      {/* Floating drawing tool icons - scattered everywhere */}
      {floatingIcons.map(
        ({ Icon, position, delay, duration, color }, index) => (
          <motion.div
            key={index}
            className={`absolute ${position} ${color} opacity-30`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              y: [0, -25, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              opacity: {
                repeat: Infinity,
                duration: duration,
                ease: "easeInOut",
              },
              y: { repeat: Infinity, duration: duration, ease: "easeInOut" },
              rotate: {
                repeat: Infinity,
                duration: duration * 2,
                ease: "linear",
              },
              scale: {
                repeat: Infinity,
                duration: duration,
                ease: "easeInOut",
              },
              delay: delay,
            }}
            style={{ zIndex: 3 }}
          >
            <Icon size={Math.random() * 20 + 30} strokeWidth={1.5} />
          </motion.div>
        )
      )}

      {/* Additional decorative elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 20, ease: "linear" },
          scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
        }}
        style={{ zIndex: 2 }}
      >
        <div className="w-96 h-96 border-2 border-white/5 rounded-full" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: -360,
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 25, ease: "linear" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        style={{ zIndex: 2 }}
      >
        <div className="w-[28rem] h-[28rem] border-2 border-white/5 rounded-full" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* Logo and Slogan with drawing icon */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-3"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Palette size={48} className="text-white" strokeWidth={2} />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight">
              Sketchnote
            </h1>
            <motion.div
              animate={{ rotate: [0, 15, -15, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
            >
              <Brush size={48} className="text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>
          <motion.p
            className="text-white/90 text-lg md:text-xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ✨ Write, draw, and collaborate – all in one intelligent space ✨
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-tr-full" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative z-10"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-blue-600" size={24} />
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <Sparkles className="text-cyan-600" size={24} />
              </div>
              <p className="text-center text-gray-500 mb-8 text-sm">
                Sign in to unleash your creativity
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <motion.div whileTap={{ scale: 0.995 }} className="relative">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-300 ${focusedInput === "email"
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                        } focus:outline-none bg-gray-50 focus:bg-white`}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div whileTap={{ scale: 0.995 }} className="relative">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-300 ${focusedInput === "password"
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                        } focus:outline-none bg-gray-50 focus:bg-white`}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <Heart size={16} className="text-red-400" />
                  Protected by enterprise-grade security
                  <Heart size={16} className="text-red-400" />
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/70 text-sm mt-8 flex items-center gap-2"
        >
          <Palette size={16} />
          © 2025 Sketchnote. All rights reserved.
          <Brush size={16} />
        </motion.p>
      </div>
    </div>
  );
};

export default SketchnoteLogin;
