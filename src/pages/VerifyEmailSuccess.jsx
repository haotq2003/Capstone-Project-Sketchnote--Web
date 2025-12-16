import React from "react";
import Lottie from "lottie-react";
import celebrationAnimation from "../assets/celebration.json";

const VerifyEmailSuccess = () => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <img
            src="https://res.cloudinary.com/dk3yac2ie/image/upload/v1765870134/sfsugrqtnizilox7wqdl.png"
            alt="SketchNotes Logo"
            style={styles.logoImg}
          />
          <span style={styles.logoText}>SketchNotes</span>
        </div>

        {/* Success Animation */}
        <div style={styles.animation}>
          <Lottie
            animationData={celebrationAnimation}
            loop={true}
            autoplay={true}
          />
        </div>

        {/* Title */}
        <h1 style={styles.title}>Email Verified Successfully</h1>

        {/* Description */}
        <p style={styles.description}>
          Your email address has been successfully verified.
          <br />
          You can now log in to the app and start creating beautiful sketches
          and notes.
        </p>

        {/* Hint */}
        <div style={styles.hint}>
          Please open the <b>SketchNotes app</b> and log in to continue.
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          © 2025 SketchNotes • Made with ❤️ for creative minds
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #f9fcff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    padding: "40px 32px",
    textAlign: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  logoImg: {
    width: "42px",
    height: "42px",
  },
  logoText: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "28px",
    color: "#1565c0",
  },
  icon: {
    fontSize: "64px",
    margin: "20px 0",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    color: "#1e88e5",
  },
  description: {
    fontSize: "15px",
    color: "#555555",
    lineHeight: "1.6",
    margin: "16px 0",
  },
  hint: {
    marginTop: "18px",
    padding: "12px 16px",
    backgroundColor: "#f5f9ff",
    borderLeft: "4px solid #1e88e5",
    fontSize: "14px",
    color: "#333333",
  },
  animation: {
    width: "120px",
    height: "120px",
    margin: "0 auto 16px",
  },

  footer: {
    marginTop: "28px",
    fontSize: "12px",
    color: "#999999",
  },
};

export default VerifyEmailSuccess;
