import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Pencil,
  Palette,
  Share2,
  Sparkles,
  Zap,
  Cloud,
  Layers,
  Users,
  Lock,
  Smartphone,
  Globe,
  Download,
  PenTool,
  Image,
  FileText,
  Wand2,
  Play,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Brush,
  MousePointer,
  Move,
  RotateCcw,
  ZoomIn,
  Type,
  Shapes,
  Eraser,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import * as THREE from "three";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Three.js Background
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create floating geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.TorusGeometry(0.4, 0.15, 16, 100),
      new THREE.OctahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.5),
      new THREE.DodecahedronGeometry(0.4),
    ];

    const material = new THREE.MeshBasicMaterial({
      color: 0x084f8c,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const meshes = [];
    for (let i = 0; i < 15; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geo, material.clone());
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 10 - 5;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.material.opacity = Math.random() * 0.2 + 0.1;
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x084f8c,
      transparent: true,
      opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      meshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.002 * ((i % 3) + 1);
        mesh.rotation.y += 0.003 * ((i % 2) + 1);
        mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
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

  // Auto rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mainFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mainFeatures = [
    {
      icon: PenTool,
      title: "Natural Drawing Experience",
      description:
        "Our advanced drawing engine provides smooth, pressure-sensitive strokes that feel just like pen on paper. Perfect for artists and note-takers alike.",
      color: "#084F8C",
      gradient: "from-blue-500 to-cyan-500",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
      stats: [
        { label: "Brush Types", value: "50+" },
        { label: "Pressure Levels", value: "4096" },
        { label: "Latency", value: "<10ms" },
      ],
    },
    {
      icon: Palette,
      title: "Unlimited Color Palette",
      description:
        "Express your creativity with our extensive color library. Create custom palettes, save favorites, and use gradients to make your notes pop.",
      color: "#7c3aed",
      gradient: "from-purple-500 to-pink-500",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop",
      stats: [
        { label: "Colors", value: "16M+" },
        { label: "Palettes", value: "100+" },
        { label: "Gradients", value: "∞" },
      ],
    },
    {
      icon: Layers,
      title: "Smart Layers",
      description:
        "Organize your sketches with intelligent layers. Move, resize, and edit individual elements without affecting the rest of your work.",
      color: "#059669",
      gradient: "from-green-500 to-teal-500",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
      stats: [
        { label: "Layers", value: "Unlimited" },
        { label: "Blend Modes", value: "20+" },
        { label: "Effects", value: "50+" },
      ],
    },
    {
      icon: Wand2,
      title: "AI-Powered Tools",
      description:
        "Let our AI help you create perfect shapes, convert handwriting to text, and suggest creative enhancements for your notes.",
      color: "#db2777",
      gradient: "from-pink-500 to-rose-500",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      stats: [
        { label: "AI Models", value: "5+" },
        { label: "Accuracy", value: "99%" },
        { label: "Languages", value: "30+" },
      ],
    },
  ];

  const toolsShowcase = [
    { icon: Pencil, name: "Pencil", color: "#084F8C" },
    { icon: Brush, name: "Brush", color: "#7c3aed" },
    { icon: Eraser, name: "Eraser", color: "#dc2626" },
    { icon: Type, name: "Text", color: "#059669" },
    { icon: Shapes, name: "Shapes", color: "#d97706" },
    { icon: Image, name: "Images", color: "#0891b2" },
    { icon: Layers, name: "Layers", color: "#7c3aed" },
    { icon: Move, name: "Move", color: "#6366f1" },
    { icon: ZoomIn, name: "Zoom", color: "#ec4899" },
    { icon: RotateCcw, name: "Undo", color: "#14b8a6" },
  ];

  const additionalFeatures = [
    {
      icon: Cloud,
      title: "Cloud Sync",
      description:
        "Access your notes anywhere with automatic cloud synchronization.",
      color: "#0891b2",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share your creations instantly via link, email, or social media.",
      color: "#7c3aed",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work together in real-time with your team or study group.",
      color: "#059669",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your notes are encrypted and protected with enterprise-grade security.",
      color: "#dc2626",
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description: "Seamlessly switch between mobile, tablet, and desktop.",
      color: "#d97706",
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Export as PDF, PNG, or SVG for maximum flexibility.",
      color: "#6366f1",
    },
    {
      icon: Image,
      title: "Image Import",
      description: "Add photos and images to your notes for richer content.",
      color: "#ec4899",
    },
    {
      icon: FileText,
      title: "Templates Library",
      description: "Start quickly with hundreds of professional templates.",
      color: "#14b8a6",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      content:
        "SketchNote has completely transformed how I brainstorm and present ideas to clients. The natural drawing feel is unmatched!",
      rating: 5,
    },
    {
      name: "Michael Park",
      role: "Medical Student",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content:
        "Visual note-taking has helped me retain 40% more information. The AI features for converting my handwriting are incredible.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Product Manager",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content:
        "The collaboration features make it perfect for remote team brainstorming sessions. We use it daily!",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
          .font-pacifico {
            font-family: 'Pacifico', cursive;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(8, 79, 140, 0.3); }
            50% { box-shadow: 0 0 40px rgba(8, 79, 140, 0.6); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `}
      </style>

      <Navbar />

      {/* Hero Section with 3D Background */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(8, 79, 140, 0.05) 0%, transparent 50%, rgba(8, 145, 178, 0.05) 100%)`,
            zIndex: 2,
          }}
        />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-20 h-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
          >
            <PenTool className="w-10 h-10" style={{ color: "#084F8C" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-32 w-16 h-16"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.1)" }}
          >
            <Palette className="w-8 h-8" style={{ color: "#7c3aed" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-32 w-14 h-14"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(5, 150, 105, 0.1)" }}
          >
            <Layers className="w-7 h-7" style={{ color: "#059669" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-20 w-18 h-18"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(219, 39, 119, 0.1)" }}
          >
            <Sparkles className="w-8 h-8" style={{ color: "#db2777" }} />
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <span
              className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-6 px-6 py-3 rounded-full border"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
                borderColor: "rgba(8, 79, 140, 0.2)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Discover Our Features
              <Sparkles className="w-4 h-4" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sketch text-6xl md:text-7xl lg:text-8xl font-normal text-foreground mb-8"
          >
            Powerful Tools for{" "}
            <span
              className="relative inline-block"
              style={{ color: "#084F8C" }}
            >
              Creative
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <motion.path
                  d="M0 15 Q50 5 100 15 T200 15"
                  fill="none"
                  stroke="#084F8C"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>{" "}
            <span className="font-pacifico">Minds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            Discover all the features that make SketchNote the ultimate platform
            for visual note-taking and creative expression.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-white font-normal py-4 px-8 rounded-2xl shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#084F8C",
                boxShadow: "0 10px 40px rgba(8, 79, 140, 0.3)",
              }}
            >
              <Play className="w-5 h-5" />
              Explore Features
            </motion.a>
            <motion.a
              href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 font-normal py-4 px-8 rounded-2xl border-2 transition-all duration-300"
              style={{
                borderColor: "#084F8C",
                color: "#084F8C",
              }}
            >
              <Download className="w-5 h-5" />
              Download App
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.5 },
              y: { duration: 1.5, repeat: Infinity },
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <MousePointer className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Tools Showcase */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(8, 79, 140, 0.1) 0%, transparent 70%)`,
          }}
        />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground mb-4">
              Your Creative <span style={{ color: "#084F8C" }}>Toolkit</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to bring your ideas to life, right at your
              fingertips.
            </p>
          </motion.div>

          {/* Floating Tools */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {toolsShowcase.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
                className="group cursor-pointer"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-border"
                  style={{
                    borderColor:
                      hoveredCard === tool.name ? tool.color : undefined,
                  }}
                  onMouseEnter={() => setHoveredCard(tool.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <tool.icon
                    className="w-8 h-8 transition-colors duration-300"
                    style={{ color: tool.color }}
                  />
                  <span className="text-xs font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                    {tool.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features - Interactive Showcase */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
              }}
            >
              Core Features
            </span>
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground">
              What Makes Us <span style={{ color: "#084F8C" }}>Different</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Tabs */}
            <div className="space-y-4">
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                    activeFeature === index
                      ? "bg-white shadow-xl scale-[1.02]"
                      : "bg-white/50 hover:bg-white hover:shadow-lg"
                  }`}
                  style={{
                    borderLeft:
                      activeFeature === index
                        ? `4px solid ${feature.color}`
                        : "4px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300"
                      style={{
                        backgroundColor: `${feature.color}15`,
                        transform:
                          activeFeature === index ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <feature.icon
                        className="w-7 h-7"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sketch text-xl font-normal text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <AnimatePresence mode="wait">
                        {activeFeature === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="font-body text-muted-foreground mb-4">
                              {feature.description}
                            </p>
                            <div className="flex gap-6">
                              {feature.stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                  <p
                                    className="font-sketch text-2xl font-normal"
                                    style={{ color: feature.color }}
                                  >
                                    {stat.value}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {stat.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 transition-all duration-300 ${
                        activeFeature === index
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2"
                      }`}
                      style={{ color: feature.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Image */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Decorative elements */}
                  <div
                    className="absolute -inset-4 rounded-3xl blur-xl opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${mainFeatures[activeFeature].color}40, transparent)`,
                    }}
                  />

                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={mainFeatures[activeFeature].image}
                      alt={mainFeatures[activeFeature].title}
                      className="w-full aspect-[4/3] object-cover"
                    />

                    {/* Overlay gradient */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${mainFeatures[activeFeature].color}, transparent)`,
                      }}
                    />

                    {/* Feature badge */}
                    <div
                      className="absolute bottom-6 left-6 px-4 py-2 rounded-xl text-white font-normal shadow-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: `${mainFeatures[activeFeature].color}dd`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {React.createElement(mainFeatures[activeFeature].icon, {
                          className: "w-5 h-5",
                        })}
                        {mainFeatures[activeFeature].title}
                      </div>
                    </div>
                  </div>

                  {/* Floating cards */}
                  <motion.div
                    className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-normal text-foreground">
                        4.9 Rating
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {mainFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeFeature === index ? "w-8" : "w-2"
                    }`}
                    style={{
                      backgroundColor:
                        activeFeature === index
                          ? mainFeatures[index].color
                          : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground mb-4">
              And So Much <span style={{ color: "#084F8C" }}>More</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed to help you capture and express your
              ideas effortlessly.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                  }}
                />

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: feature.color }}
                  />
                </div>
                <h4 className="font-sketch text-lg font-normal text-foreground mb-2 relative">
                  {feature.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground relative">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
              }}
            >
              Testimonials
            </span>
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground">
              Loved by <span style={{ color: "#084F8C" }}>Creators</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-sketch hover:shadow-hover transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                <p className="font-body text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-normal text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
            style={{ backgroundColor: "#084F8C" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-white/10 rounded-full" />
            <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border-2 border-white/10 rounded-full" />

            {/* Floating icons */}
            <motion.div
              className="absolute top-8 right-8 opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <PenTool className="w-16 h-16" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-8 opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Palette className="w-12 h-12" />
            </motion.div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 mx-auto mb-8 opacity-80" />
              </motion.div>

              <h2 className="font-sketch text-4xl md:text-5xl font-normal mb-6">
                Ready to Get Started?
              </h2>
              <p className="font-body text-xl text-white/80 max-w-xl mx-auto mb-10">
                Download our mobile app and start creating beautiful sketchnotes
                today. Join thousands of creative minds!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-white font-normal py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ color: "#084F8C" }}
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Download for</div>
                    <div className="font-normal">Android</div>
                  </div>
                </motion.a>

                <motion.a
                  href="/gallery"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-normal py-4 px-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Globe className="w-5 h-5" />
                  Explore Gallery
                </motion.a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-12 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <p className="font-sketch text-4xl font-normal">10K+</p>
                  <p className="text-white/70">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="font-sketch text-4xl font-normal">50K+</p>
                  <p className="text-white/70">Notes Created</p>
                </div>
                <div className="text-center">
                  <p className="font-sketch text-4xl font-normal">4.9</p>
                  <p className="text-white/70">App Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
