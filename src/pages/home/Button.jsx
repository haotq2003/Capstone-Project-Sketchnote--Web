const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-normal py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1";

  const variants = {
    primary: "text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border-2 shadow-sketch hover:shadow-hover",
    outline: "bg-transparent border-2 hover:bg-opacity-10",
  };

  const getStyle = () => {
    switch (variant) {
      case "primary":
        return { backgroundColor: "#084F8C", color: "white" };
      case "secondary":
        return { color: "#084F8C", borderColor: "#084F8C" };
      case "outline":
        return { color: "#084F8C", borderColor: "#084F8C" };
      default:
        return { backgroundColor: "#084F8C", color: "white" };
    }
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={getStyle()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
