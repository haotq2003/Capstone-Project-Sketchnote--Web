import React from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import error404Animation from "../assets/Error 404.json";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Lottie
          animationData={error404Animation}
          loop={true}
          className="w-full h-auto"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mt-8 mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
        Oops! The page you are looking for might have been removed or is
        temporarily unavailable.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
