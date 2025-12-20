import { useEffect, useState } from "react";
import "./Welcome.scss";
import helloVideo from "../../assets/Animation_Hello.webm";

const Welcome = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 3000);
    const timer2 = setTimeout(() => {
      navigate("/home"); // Thay đổi path tùy theo trang bạn muốn đến
    }, 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`welcome-page ${fadeOut ? "fade-out" : ""}`}>
      <video
        src={helloVideo}
        autoPlay
        muted
        loop
        className="welcome-video"
      ></video>
      <h1 className="typing-text">
        Welcome to SketchNote! We are happy to have you here!
      </h1>
    </div>
  );
};

export default Welcome;
