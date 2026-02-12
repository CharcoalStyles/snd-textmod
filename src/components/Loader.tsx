import { getTextColor } from "@/utils/tailwind";
import clsx from "clsx";
import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  color?: "primary" | "secondary" | "accent";
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  "3xl": "h-24 w-24",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "accent",
}) => {
  return (
    <div
      data-testid="loader"
      className={clsx(
        sizes[size],
        getTextColor(color),
        "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
      )}
      role="status"
    >
      <span className="absolute m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 ">
        Loading...
      </span>
    </div>
  );
};
