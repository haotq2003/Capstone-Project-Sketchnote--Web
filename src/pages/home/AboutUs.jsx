import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Heart,
  Target,
  Users,
  Lightbulb,
  Award,
  Globe,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  MousePointer,
  Star,
  Rocket,
  Zap,
  Coffee,
  Code,
  Palette,
  PenTool,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import * as THREE from "three";

const AboutUs = () => {
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

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate about visual thinking and education technology.",
      color: "#084F8C",
    },
    {
      name: "Sarah Chen",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
      bio: "Creating beautiful and intuitive user experiences.",
      color: "#7c3aed",
    },
    {
      name: "Michael Park",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Building the technology that powers your creativity.",
      color: "#059669",
    },
    {
      name: "Emily Davis",
      role: "Community Manager",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Connecting and supporting our amazing community.",
      color: "#db2777",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "We're passionate about helping people express their ideas visually and creatively.",
      color: "#dc2626",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We constantly push boundaries to bring you the best visual note-taking experience.",
      color: "#f59e0b",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Our users are at the heart of everything we do. We build for you, with you.",
      color: "#084F8C",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for excellence in every feature, every update, every interaction.",
      color: "#059669",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Founded",
      description: "SketchNote was born from a simple idea.",
      icon: Rocket,
    },
    {
      year: "2023",
      title: "10K Users",
      description: "Reached our first major milestone.",
      icon: Users,
    },
    {
      year: "2024",
      title: "Mobile Launch",
      description: "Launched our mobile application.",
      icon: Zap,
    },
    {
      year: "2025",
      title: "Global Reach",
      description: "Serving users in 50+ countries.",
      icon: Globe,
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "50+", label: "Countries", icon: Globe },
    { value: "1M+", label: "Notes Created", icon: PenTool },
    { value: "4.9", label: "App Rating", icon: Star },
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
          className="absolute top-24 left-20 w-20 h-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
          >
            <Heart className="w-10 h-10" style={{ color: "#dc2626" }} />
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
            className="w-full h-full rounded-xl flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.1)" }}
          >
            <Lightbulb className="w-8 h-8" style={{ color: "#f59e0b" }} />
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
            className="w-full h-full rounded-lg flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(5, 150, 105, 0.1)" }}
          >
            <Users className="w-7 h-7" style={{ color: "#059669" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-20"
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
            className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(219, 39, 119, 0.1)" }}
          >
            <Sparkles className="w-8 h-8" style={{ color: "#db2777" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-1/4 w-12 h-12"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full border-2 rounded-lg rotate-45"
            style={{ borderColor: "rgba(8, 79, 140, 0.3)" }}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/4 w-8 h-8"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: "rgba(8, 79, 140, 0.3)" }}
          />
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
              className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-6 px-6 py-3 rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
                borderColor: "rgba(8, 79, 140, 0.2)",
              }}
            >
              <Heart className="w-4 h-4" />
              About Us
              <Heart className="w-4 h-4" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sketch text-6xl md:text-7xl lg:text-8xl font-normal text-foreground mb-8"
          >
            We're Building the Future of{" "}
            <span
              className="relative inline-block"
              style={{ color: "#084F8C" }}
            >
              Visual
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
            <span className="font-pacifico">Thinking</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            SketchNote is more than an app – it's a movement to help people
            think, learn, and create more effectively through visual
            note-taking.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
              >
                <stat.icon
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "#084F8C" }}
                />
                <p
                  className="font-sketch text-3xl font-normal"
                  style={{ color: "#084F8C" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
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
          style={{ zIndex: 10 }}
        >
          <MousePointer className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #084F8C 0%, transparent 50%)`,
          }}
        />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(8, 79, 140, 0.1)",
                  color: "#084F8C",
                }}
              >
                <Target className="w-4 h-4" />
                Our Mission
              </span>
              <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground mb-6">
                Empowering <span style={{ color: "#084F8C" }}>Creative</span>{" "}
                Expression
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that everyone has the ability to think creatively.
                Our mission is to provide tools that make visual note-taking
                accessible, enjoyable, and powerful for everyone – from students
                to professionals, artists to engineers.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8">
                By combining the freedom of hand-drawn notes with the power of
                digital tools, we're helping people capture ideas in ways that
                text alone never could.
              </p>

              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Coffee, label: "User-First" },
                  { icon: Code, label: "Innovation" },
                  { icon: Palette, label: "Creativity" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm"
                  >
                    <item.icon
                      className="w-5 h-5"
                      style={{ color: "#084F8C" }}
                    />
                    <span className="font-normal text-foreground">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-xl"
                style={{ backgroundColor: "#084F8C" }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="w-full"
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, #084F8C, transparent)`,
                  }}
                />
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-normal text-foreground">Top Rated</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: "#084F8C" }} />
                  <span className="font-normal text-foreground">
                    10K+ Users
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
              }}
            >
              <Heart className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground">
              What Drives Us{" "}
              <span className="font-pacifico" style={{ color: "#084F8C" }}>
                Forward
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative text-center p-8 bg-white rounded-3xl border border-border hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${value.color}, transparent)`,
                  }}
                />
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                  style={{ backgroundColor: `${value.color}15` }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <value.icon
                    className="w-10 h-10"
                    style={{ color: value.color }}
                  />
                </motion.div>
                <h3 className="font-sketch text-2xl font-normal text-foreground mb-3 relative">
                  {value.title}
                </h3>
                <p className="font-body text-muted-foreground relative">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
              }}
            >
              <Rocket className="w-4 h-4" />
              Our Journey
            </span>
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground">
              Milestones Along the{" "}
              <span className="font-pacifico" style={{ color: "#084F8C" }}>
                Way
              </span>
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 rounded-full hidden md:block"
                style={{ backgroundColor: "rgba(8, 79, 140, 0.2)" }}
              />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative flex flex-col md:flex-row items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:text-left"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white p-8 rounded-3xl shadow-sketch hover:shadow-hover transition-all duration-300"
                    >
                      <div
                        className={`flex items-center gap-3 mb-4 ${
                          index % 2 === 0
                            ? "md:justify-end"
                            : "md:justify-start"
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
                        >
                          <milestone.icon
                            className="w-6 h-6"
                            style={{ color: "#084F8C" }}
                          />
                        </div>
                        <span
                          className="font-sketch text-3xl font-normal"
                          style={{ color: "#084F8C" }}
                        >
                          {milestone.year}
                        </span>
                      </div>
                      <h4 className="font-sketch text-2xl font-normal text-foreground mb-2">
                        {milestone.title}
                      </h4>
                      <p className="font-body text-muted-foreground">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Dot */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white hidden md:flex items-center justify-center z-10"
                    style={{ backgroundColor: "#084F8C" }}
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(8, 79, 140, 0.1)",
                color: "#084F8C",
              }}
            >
              <Users className="w-4 h-4" />
              Our Team
            </span>
            <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground">
              Meet the{" "}
              <span className="font-pacifico" style={{ color: "#084F8C" }}>
                Creators
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}, transparent)`,
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-sketch text-xl font-normal text-foreground">
                    {member.name}
                  </h4>
                  <p
                    className="font-body text-sm mb-3"
                    style={{ color: member.color }}
                  >
                    {member.role}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    {[Twitter, Linkedin, Github].map((Icon, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={{ scale: 1.2, y: -2 }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        style={{
                          backgroundColor: "rgba(8, 79, 140, 0.05)",
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl p-12 text-center text-white relative overflow-hidden"
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
              <Heart className="w-16 h-16" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-8 opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Mail className="w-12 h-12" />
            </motion.div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 mx-auto mb-8 opacity-80" />
              </motion.div>

              <h2 className="font-sketch text-4xl md:text-5xl font-normal mb-6">
                Get in Touch
              </h2>
              <p className="font-body text-xl text-white/80 max-w-xl mx-auto mb-8">
                Have questions or feedback? We'd love to hear from you.
              </p>

              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl"
                >
                  <Mail className="w-5 h-5" />
                  <span>hello@sketchnote.app</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Ho Chi Minh City, Vietnam</span>
                </motion.div>
              </div>

              <motion.a
                href="mailto:hello@sketchnote.app"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white font-normal py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ color: "#084F8C" }}
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
