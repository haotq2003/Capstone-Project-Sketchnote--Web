import React from "react";

const VARIANTS = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:-translate-y-1 rounded-xl",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
    outline: "border-2 border-primary/30 bg-background hover:bg-primary/5 hover:border-primary/50 rounded-xl text-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl",
    ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl",
    link: "text-primary underline-offset-4 hover:underline",
    sketch: "bg-white border-2 border-primary/20 shadow-sm hover:-translate-y-1 rounded-xl text-foreground font-medium",
    hero: "bg-primary text-white font-bold hover:-translate-y-1 shadow-lg shadow-primary/30 rounded-xl",
    blue: "bg-sketch-blue text-primary-foreground rounded-xl",
    sky: "bg-sketch-sky text-foreground rounded-xl",
};

const SIZES = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-lg rounded-2xl",
    icon: "h-10 w-10",
};

export const Button = React.forwardRef(
    (
        {
            className = "",
            variant = "default",
            size = "default",
            type = "button",
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                type={type}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium transition-all duration-300
          disabled:opacity-50 disabled:pointer-events-none
          ${VARIANTS[variant]}
          ${SIZES[size]}
          ${className}
        `}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
