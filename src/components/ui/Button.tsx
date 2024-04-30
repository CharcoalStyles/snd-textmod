import React, { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { Variants } from "@/utils/tailwind";

export type ButtonProps = Pick<
  HTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  onClick?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: "small" | "medium" | "large";
  variant?: Variants;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  label: string;
  fullWidth?: boolean;
  isActive?: boolean;
  noBorder?: boolean;
  "data-testid"?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type">;

export const buttonSizes: Array<ButtonProps["size"]> = [
  "small",
  "medium",
  "large",
];

const statusClasses: Record<
  Variants,
  {
    bgColour: string;
    bgHoverColour: string;
    bgActiveColour: string;
    bgActiveHoverColour: string;
    borderColour: string;
  }
> = {
  basic: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-gray-400",
    bgActiveColour: "bg-gray-400",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-gray-400",
  },
  primary: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-primary",
    bgActiveColour: "bg-primary",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-primary",
  },
  secondary: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-secondary",
    bgActiveColour: "bg-secondary",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-secondary",
  },
  accent: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-accent",
    bgActiveColour: "bg-accent",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-accent",
  },
  success: {
    bgColour: "bg-green-600",
    bgHoverColour: "hover:bg-green-400",
    bgActiveColour: "bg-green-400",
    bgActiveHoverColour: "hover:bg-green-600",
    borderColour: "border-green-500",
  },
  danger: {
    bgColour: "bg-red-600",
    bgHoverColour: "hover:bg-red-400",
    bgActiveColour: "bg-red-400",
    bgActiveHoverColour: "hover:bg-red-600",
    borderColour: "border-red-500",
  },
  //TODO: add actual black and white variants
  black: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-gray-700",
    bgActiveColour: "bg-black",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-black",
  },
  white: {
    bgColour: "bg-transparent",
    bgHoverColour: "hover:bg-gray-400",
    bgActiveColour: "bg-gray-400",
    bgActiveHoverColour: "hover:bg-transparent",
    borderColour: "border-gray-400",
  },
};

export const Button = ({
  onClick,
  size = "medium",
  variant = "basic",
  icon,
  iconPosition = "left",
  iconOnly = false,
  label,
  fullWidth = false,
  className,
  isActive = false,
  noBorder = false,
  disabled,
  "data-testid": dataTestId,
}: ButtonProps) => {
  const getButtonSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-2 py-1";
      case "medium":
        return "px-3 py-2";
      case "large":
        return "px-4 py-2";
    }
  };
  const getTextSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-base";
      case "large":
        return "text-xl";
    }
  };

  const getStatusClasses = () => {
    const {
      bgActiveColour,
      bgActiveHoverColour,
      bgColour,
      bgHoverColour,
      borderColour,
    } = statusClasses[variant];

    return clsx(
      borderColour,
      isActive
        ? ["text-black hover:text-text", bgActiveColour, bgActiveHoverColour]
        : ["text-text hover:text-black", bgColour, bgHoverColour]
    );
  };

  const getIconClasses = () => {
    if (iconOnly) {
      return "mr-2";
    } else {
      return iconPosition === "left" ? "mr-2" : "ml-2";
    }
  };
  
  return (
    <button
      data-testid={dataTestId}
      disabled={disabled}
      className={clsx([
        "inline-flex items-center h-min justify-center rounded-md font-body transition-all duration-200",
        noBorder ? "" : "border",
        getStatusClasses(),
        getButtonSizeClasses(),
        fullWidth ? "w-full" : "",
        getTextSizeClasses(),
        className,
      ])}
      onClick={onClick}>
      {icon && iconPosition === "left" && (
        <span className={getIconClasses()}>{icon}</span>
      )}
      {!iconOnly && <p>{label}</p>}
      {icon && iconPosition === "right" && (
        <span className={getIconClasses()}>{icon}</span>
      )}
    </button>
  );
};
