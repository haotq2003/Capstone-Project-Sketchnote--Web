import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  PenTool,
  Palette,
  Layers,
  Download,
  MousePointer,
} from "lucide-react";
import { Link } from "react-router-dom";
import * as THREE from "three";

const HeroSection = () => {
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

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
          .font-pacifico {
            font-family: 'Pacifico', cursive;
          }
        `}
      </style>

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

      {/* Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#084F8C" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#084F8C" }}
        />
      </div>

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
          className="w-full h-full rounded-xl flex items-center justify-center backdrop-blur-sm"
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
          className="w-full h-full rounded-lg flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(5, 150, 105, 0.1)" }}
        >
          <Layers className="w-7 h-7" style={{ color: "#059669" }} />
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

      {/* Additional floating shapes */}
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

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-16 h-16"
        animate={{
          scale: [1, 0.8, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ zIndex: 3 }}
      >
        <div
          className="w-full h-full border-2 rounded-full"
          style={{ borderColor: "rgba(8, 79, 140, 0.2)" }}
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border shadow-lg mb-8"
              style={{ borderColor: "rgba(8, 79, 140, 0.2)" }}
            >
              <Star
                className="w-4 h-4 fill-current"
                style={{ color: "#084F8C" }}
              />
              <span className="font-body text-sm font-normal text-foreground">
                Transform your ideas into visual notes
              </span>
              <Sparkles className="w-4 h-4" style={{ color: "#084F8C" }} />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sketch text-5xl md:text-7xl lg:text-8xl font-normal text-foreground mb-6"
          >
            Capture Ideas with{" "}
            <span className="relative inline-block">
              <span style={{ color: "#084F8C" }}>Creative</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <motion.path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="#084F8C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </motion.svg>
            </span>{" "}
            <span className="font-pacifico">Sketches</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            SketchNote is your digital canvas for visual thinking. Draw,
            annotate, and organize your thoughts in a beautiful, intuitive way.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-white font-normal py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: "#084F8C",
                  boxShadow: "0 10px 40px rgba(8, 79, 140, 0.3)",
                }}
              >
                <Sparkles className="w-5 h-5" />
                Start Creating
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border-2 font-normal py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ color: "#084F8C", borderColor: "#084F8C" }}
              >
                View Gallery
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Download App CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6"
          >
            <motion.a
              href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm underline underline-offset-4">
                Download Mobile App
              </span>
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16"
          >
            <p className="font-body text-sm text-muted-foreground mb-4">
              Trusted by creative minds worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: "10K+", label: "Users" },
                { value: "50K+", label: "Notes" },
                { value: "4.9★", label: "Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="font-sketch text-2xl font-normal"
                    style={{ color: "#084F8C" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
  );
};

export default HeroSection;
