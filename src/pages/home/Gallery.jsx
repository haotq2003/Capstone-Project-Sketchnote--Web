import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Eye,
  ShoppingCart,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  ImageIcon,
  Sparkles,
  Layers,
  Download,
  Clock,
  Mail,
  Heart,
  Bookmark,
  TrendingUp,
  Award,
  Palette,
  PenTool,
  MousePointer,
  Zap,
} from "lucide-react";
import { Pagination, Empty, Spin, Select, Input, message } from "antd";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { orderService } from "../../service/orderService";
import * as THREE from "three";

const Gallery = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetail, setTemplateDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

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
    for (let i = 0; i < 12; i++) {
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
    const particlesCount = 300;
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
      opacity: 0.4,
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

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, pageSize]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const result = await orderService.getTemplates(currentPage, pageSize);
      setTemplates(result.content || []);
      setTotalElements(result.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = async (template) => {
    setSelectedTemplate(template);
    setDetailLoading(true);
    setSelectedImageIndex(0);
    setTemplateDetail(null);

    try {
      const detail = await orderService.getTemplateById(
        template.resourceTemplateId
      );
      setTemplateDetail(detail);
    } catch (error) {
      console.error("Failed to fetch template detail:", error);
      setTemplateDetail(template);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
    setTemplateDetail(null);
    setSelectedImageIndex(0);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  const formatPrice = (price) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getThumbnail = (template) => {
    const thumbnail = template.images?.find((img) => img.isThumbnail);
    return thumbnail?.imageUrl || template.images?.[0]?.imageUrl || null;
  };

  const getAllImages = (detail) => {
    if (!detail) return [];

    const images = [];

    if (detail.bannerUrl) {
      images.push({ url: detail.bannerUrl, label: "Banner", type: "banner" });
    }

    if (detail.images?.length > 0) {
      detail.images.forEach((img, idx) => {
        images.push({
          url: img.imageUrl,
          label: img.isThumbnail ? "Thumbnail" : `Image ${idx + 1}`,
          type: "image",
          isThumbnail: img.isThumbnail,
        });
      });
    }

    if (detail.items?.length > 0) {
      detail.items.forEach((item) => {
        if (item.imageUrl) {
          images.push({
            url: item.imageUrl,
            label: `Page ${item.itemIndex}`,
            type: "item",
            itemUrl: item.itemUrl,
          });
        }
      });
    }

    return images;
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesType = filterType === "ALL" || template.type === filterType;
    const matchesSearch =
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const allImages = getAllImages(templateDetail);

  const stats = [
    { icon: Layers, value: totalElements || "100+", label: "Templates" },
    { icon: Award, value: "50+", label: "Designers" },
    { icon: Download, value: "10K+", label: "Downloads" },
  ];

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
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
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
          className="absolute top-24 left-20 w-16 h-16"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
          >
            <ImageIcon className="w-8 h-8" style={{ color: "#084F8C" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-32 right-24 w-14 h-14"
          animate={{
            y: [0, 15, 0],
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
            <Palette className="w-7 h-7" style={{ color: "#7c3aed" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-32 w-12 h-12"
          animate={{
            y: [0, -15, 0],
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
            <PenTool className="w-6 h-6" style={{ color: "#059669" }} />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-20"
          animate={{
            y: [0, 12, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          style={{ zIndex: 3 }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(219, 39, 119, 0.1)" }}
          >
            <Sparkles className="w-7 h-7" style={{ color: "#db2777" }} />
          </div>
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
              <span
                className="inline-flex items-center gap-2 font-body text-sm font-normal tracking-wider uppercase mb-6 px-6 py-3 rounded-full border backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(8, 79, 140, 0.1)",
                  color: "#084F8C",
                  borderColor: "rgba(8, 79, 140, 0.2)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Template Gallery
                <Sparkles className="w-4 h-4" />
              </span>
            </motion.div>

            <motion.div
              className="mt-10"
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
                Discover Our Resource
                <Sparkles className="w-4 h-4" />
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sketch text-5xl md:text-6xl lg:text-7xl font-normal text-foreground mb-6"
            >
              Explore Our{" "}
              <span className="relative inline-block">
                <span style={{ color: "#084F8C" }}>Template</span>
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
              </span>
              <br />
              <span className="font-pacifico">Collection</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Discover beautiful templates and resources created by our talented
              designers. Get inspired and download on our mobile app.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mb-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                >
                  <stat.icon className="w-5 h-5" style={{ color: "#084F8C" }} />
                  <div className="text-left">
                    <p
                      className="font-sketch text-xl font-normal"
                      style={{ color: "#084F8C" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a
                href="#templates"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 text-white font-normal py-4 px-8 rounded-2xl shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: "#084F8C",
                  boxShadow: "0 10px 40px rgba(8, 79, 140, 0.3)",
                }}
              >
                <Eye className="w-5 h-5" />
                Browse Templates
              </motion.a>
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

      {/* Filters & Controls */}
      <section
        id="templates"
        className="py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur-md z-40"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search templates, designers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-border bg-white shadow-sm"
                style={{ paddingLeft: "3rem" }}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter by Type */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-border">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  className="w-32"
                  bordered={false}
                  options={[
                    { value: "ALL", label: "All Types" },
                    { value: "TEMPLATES", label: "Templates" },
                    { value: "ICONS", label: "Icons" },
                  ]}
                />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-[#084F8C] text-white shadow-md"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-[#084F8C] text-white shadow-md"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-muted-foreground">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
              >
                <ImageIcon className="w-12 h-12" style={{ color: "#084F8C" }} />
              </div>
              <h3 className="font-sketch text-2xl text-foreground mb-2">
                No templates found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredTemplates.length}
                  </span>{" "}
                  templates
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending this week</span>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.resourceTemplateId}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className={`group bg-white rounded-3xl border border-border overflow-hidden shadow-sketch hover:shadow-hover transition-all duration-500 cursor-pointer ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                    onClick={() => handleTemplateClick(template)}
                    onMouseEnter={() =>
                      setHoveredTemplate(template.resourceTemplateId)
                    }
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative overflow-hidden bg-gradient-to-br from-muted to-muted/50 ${
                        viewMode === "list" ? "w-56 h-40" : "aspect-[4/3]"
                      }`}
                    >
                      {getThumbnail(template) ? (
                        <motion.img
                          src={getThumbnail(template)}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          animate={{
                            scale:
                              hoveredTemplate === template.resourceTemplateId
                                ? 1.1
                                : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity:
                            hoveredTemplate === template.resourceTemplateId
                              ? 1
                              : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Heart className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Bookmark className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-1"
                          style={{ color: "#084F8C" }}
                        >
                          <Eye className="w-4 h-4" />
                          Quick View
                        </motion.button>
                      </motion.div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1.5 text-xs font-medium rounded-full text-white shadow-lg"
                          style={{ backgroundColor: "#084F8C" }}
                        >
                          {template.type}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-lg ${
                            template.price === 0
                              ? "bg-green-500 text-white"
                              : "bg-white text-foreground"
                          }`}
                        >
                          {formatPrice(template.price)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`p-5 ${
                        viewMode === "list"
                          ? "flex-1 flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div>
                        <h3 className="font-sketch text-lg font-normal text-foreground mb-2 line-clamp-1 group-hover:text-[#084F8C] transition-colors">
                          {template.name}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                          {template.description}
                        </p>
                      </div>

                      {/* Designer Info & Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          {template.designerInfo?.avatarUrl ? (
                            <img
                              src={template.designerInfo.avatarUrl}
                              alt={template.designerInfo.firstName}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                            />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: "rgba(8, 79, 140, 0.1)",
                              }}
                            >
                              <User
                                className="w-4 h-4"
                                style={{ color: "#084F8C" }}
                              />
                            </div>
                          )}
                          <span className="font-body text-sm text-muted-foreground">
                            {template.designerInfo?.firstName}{" "}
                            {template.designerInfo?.lastName}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {template.averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {template.averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span>{template.purchaseCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-16"
              >
                <Pagination
                  current={currentPage + 1}
                  pageSize={pageSize}
                  total={totalElements}
                  onChange={handlePageChange}
                  showSizeChanger
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} templates`
                  }
                  pageSizeOptions={["8", "12", "24", "48"]}
                  className="custom-pagination"
                />
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
            >
              <Zap className="w-10 h-10" style={{ color: "#084F8C" }} />
            </div>
            <h2 className="font-sketch text-3xl md:text-4xl font-normal text-foreground mb-4">
              Want to use these templates?
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8">
              Download our mobile app to purchase and start creating beautiful
              sketchnotes today!
            </p>
            <motion.a
              href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-white font-normal py-4 px-8 rounded-2xl shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#084F8C",
                boxShadow: "0 10px 40px rgba(8, 79, 140, 0.3)",
              }}
            >
              <Download className="w-5 h-5" />
              Download Mobile App
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-white to-muted/30">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
                  >
                    <Layers className="w-6 h-6" style={{ color: "#084F8C" }} />
                  </div>
                  <div>
                    <h2 className="font-sketch text-2xl font-normal text-foreground">
                      {templateDetail?.name || selectedTemplate.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {templateDetail?.status && (
                        <span
                          className={`px-2 py-0.5 text-xs font-normal rounded-full ${
                            templateDetail.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {templateDetail.status}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {templateDetail?.type || selectedTemplate.type}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {detailLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Spin size="large" />
                    <span className="mt-4 text-muted-foreground">
                      Loading template details...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Images Section */}
                    <div className="space-y-4">
                      {/* Main Image Display */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative group">
                        {allImages.length > 0 ? (
                          <>
                            <motion.img
                              key={selectedImageIndex}
                              src={allImages[selectedImageIndex]?.url}
                              alt={allImages[selectedImageIndex]?.label}
                              className="w-full h-full object-cover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            {/* Image Label */}
                            <div className="absolute bottom-4 left-4">
                              <span className="px-4 py-2 text-sm font-normal rounded-full bg-black/60 backdrop-blur-sm text-white">
                                {allImages[selectedImageIndex]?.label}
                              </span>
                            </div>
                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    setSelectedImageIndex((prev) =>
                                      prev === 0
                                        ? allImages.length - 1
                                        : prev - 1
                                    )
                                  }
                                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    setSelectedImageIndex((prev) =>
                                      prev === allImages.length - 1
                                        ? 0
                                        : prev + 1
                                    )
                                  }
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </motion.button>
                              </>
                            )}
                            {/* Image counter */}
                            <div className="absolute bottom-4 right-4">
                              <span className="px-3 py-1.5 text-xs font-normal rounded-full bg-black/60 backdrop-blur-sm text-white">
                                {selectedImageIndex + 1} / {allImages.length}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Image Thumbnails */}
                      {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {allImages.map((img, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                selectedImageIndex === index
                                  ? "border-[#084F8C] ring-2 ring-[#084F8C]/30 shadow-lg"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={img.label}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Items/Pages Section */}
                      {templateDetail?.items?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-sketch text-lg font-normal text-foreground mb-4 flex items-center gap-2">
                            <Layers
                              className="w-5 h-5"
                              style={{ color: "#084F8C" }}
                            />
                            Template Pages ({templateDetail.items.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {templateDetail.items.map((item) => (
                              <motion.div
                                key={item.resourceItemId}
                                whileHover={{ y: -4 }}
                                className="bg-muted/30 rounded-2xl overflow-hidden border border-border hover:border-[#084F8C]/30 transition-all"
                              >
                                {item.imageUrl ? (
                                  <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                      src={item.imageUrl}
                                      alt={`Page ${item.itemIndex}`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-[4/3] flex items-center justify-center bg-muted">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                  </div>
                                )}
                                <div className="p-4">
                                  <p className="font-medium text-sm text-foreground">
                                    Page {item.itemIndex}
                                  </p>
                                  {item.itemUrl && (
                                    <a
                                      href={item.itemUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs hover:underline flex items-center gap-1 mt-2"
                                      style={{ color: "#084F8C" }}
                                    >
                                      <Download className="w-3 h-3" />
                                      View JSON Data
                                    </a>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                      {/* Price & Type */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span
                          className={`px-5 py-2.5 text-lg font-medium rounded-2xl ${
                            (templateDetail?.price ||
                              selectedTemplate.price) === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {formatPrice(
                            templateDetail?.price || selectedTemplate.price
                          )}
                        </span>
                        {templateDetail?.items?.length > 0 && (
                          <span className="px-4 py-2 text-sm font-normal rounded-xl bg-muted text-muted-foreground">
                            {templateDetail.items.length} pages included
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div className="p-5 bg-muted/30 rounded-2xl">
                        <h4 className="font-sketch text-lg font-normal text-foreground mb-3">
                          Description
                        </h4>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          {templateDetail?.description ||
                            selectedTemplate.description}
                        </p>
                      </div>

                      {/* Designer */}
                      <div>
                        <h4 className="font-sketch text-lg font-normal text-foreground mb-4">
                          Designer
                        </h4>
                        <motion.div
                          whileHover={{ y: -2 }}
                          className="flex items-center gap-4 p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl border border-border"
                        >
                          {(
                            templateDetail?.designerInfo ||
                            selectedTemplate.designerInfo
                          )?.avatarUrl ? (
                            <img
                              src={
                                (
                                  templateDetail?.designerInfo ||
                                  selectedTemplate.designerInfo
                                ).avatarUrl
                              }
                              alt="Designer"
                              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-lg"
                            />
                          ) : (
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center"
                              style={{
                                backgroundColor: "rgba(8, 79, 140, 0.1)",
                              }}
                            >
                              <User
                                className="w-8 h-8"
                                style={{ color: "#084F8C" }}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-lg text-foreground">
                              {
                                (
                                  templateDetail?.designerInfo ||
                                  selectedTemplate.designerInfo
                                )?.firstName
                              }{" "}
                              {
                                (
                                  templateDetail?.designerInfo ||
                                  selectedTemplate.designerInfo
                                )?.lastName
                              }
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Mail className="w-4 h-4" />
                              {
                                (
                                  templateDetail?.designerInfo ||
                                  selectedTemplate.designerInfo
                                )?.email
                              }
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            icon: ShoppingCart,
                            value:
                              templateDetail?.purchaseCount ||
                              selectedTemplate.purchaseCount ||
                              0,
                            label: "Purchases",
                            color: "#084F8C",
                          },
                          {
                            icon: Star,
                            value:
                              (
                                templateDetail?.averageRating ||
                                templateDetail?.avgResourceRating
                              )?.toFixed(1) || "N/A",
                            label: "Rating",
                            color: "#eab308",
                          },
                          {
                            icon: Layers,
                            value: templateDetail?.items?.length || 0,
                            label: "Pages",
                            color: "#7c3aed",
                          },
                        ].map((stat, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -4 }}
                            className="text-center p-5 bg-white rounded-2xl border border-border shadow-sm"
                          >
                            <stat.icon
                              className="w-7 h-7 mx-auto mb-3"
                              style={{ color: stat.color }}
                            />
                            <p className="text-2xl font-semibold text-foreground">
                              {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {stat.label}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 p-5 bg-muted/30 rounded-2xl">
                        {[
                          {
                            icon: Calendar,
                            label: "Released",
                            value: formatDate(templateDetail?.releaseDate),
                          },
                          {
                            icon: Clock,
                            label: "Expires",
                            value: formatDate(templateDetail?.expiredTime),
                          },
                          {
                            icon: Calendar,
                            label: "Created",
                            value: formatDate(templateDetail?.createdAt),
                          },
                          {
                            icon: Clock,
                            label: "Updated",
                            value: formatDate(templateDetail?.updatedAt),
                          },
                        ].map(
                          (date, index) =>
                            date.value &&
                            date.value !== "N/A" && (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <date.icon className="w-4 h-4" />
                                <span>
                                  {date.label}: {date.value}
                                </span>
                              </div>
                            )
                        )}
                      </div>

                      {/* Download CTA */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl text-center relative overflow-hidden"
                        style={{ backgroundColor: "#084F8C" }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="relative">
                          <Sparkles className="w-10 h-10 mx-auto mb-4 text-white/80" />
                          <p className="font-medium text-white text-lg mb-2">
                            Want to use this template?
                          </p>
                          <p className="text-sm text-white/70 mb-5">
                            Download our mobile app to purchase and start
                            creating!
                          </p>
                          <motion.a
                            href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                            style={{ color: "#084F8C" }}
                          >
                            <Download className="w-5 h-5" />
                            Download App
                          </motion.a>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
