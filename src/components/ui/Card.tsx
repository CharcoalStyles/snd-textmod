import { Text } from "@/components/ui";
import clsx from "clsx";
import React from "react";

export type CardProps = {
  title: string | React.ReactNode;
  variant?: "base" | "primary" | "secondary";
  fullWidth?: boolean;
  noHeightLimit?: boolean;
  horizontal?: boolean;
  onClick?: () => void;
};

const generateStyle = (variant: CardProps["variant"]) => {
  const styles: Array<string> = [];

  switch (variant) {
    case "primary":
      styles.push("border-primary hover:bg-gradient-to-t hover:from-primary");
      break;
    case "secondary":
      styles.push(
        "border-secondary hover:bg-gradient-to-t hover:from-secondary"
      );
      break;
    default:
      styles.push(
        "border-slate-400 hover:border-slate-300 hover:bg-gradient-to-t hover:from-slate-700"
      );
      break;
  }

  return styles;
};

export const Card = ({
  title,
  variant = "base",
  onClick,
  children,
  fullWidth = false,
  horizontal = false,
  noHeightLimit = false,
}: React.PropsWithChildren<CardProps>) => {
  return (
    <div
      data-testid={`card-${title}`}
      className={clsx([
        "flex justify-between items-center p-4 transition-colors bg-transparent border-2 rounded-2xl cursor-pointer",
        fullWidth ? "w-full" : "max-w-48",
        horizontal ? "flex-row " : "flex-col",
        noHeightLimit ? "h-auto" : "max-h-52",
        ...generateStyle(variant),
      ])}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <div data-testid="heading" className="w-full pb-2">
        {typeof title === "string" ? (
          <Text fontType="heading" fontSize="xl" closeLines>
            {title}
          </Text>
        ) : (
          title
        )}
      </div>
      {children}
    </div>
  );
};

const trimString = (str: string, length: number) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};
