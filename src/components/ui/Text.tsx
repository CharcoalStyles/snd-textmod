import React, { PropsWithChildren, useMemo } from "react";
import { clsx } from "clsx";

type TextProps = {
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fontSize?: "sm" | "base" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  fontType?: "heading" | "body";
  variant?: "base" | "primary" | "secondary" | "accent" | "success" | "danger";
  onHover?: boolean;
  closeLines?: boolean;
  "data-testid"?: string;
  onClick?: () => void;
};

export const textSizes: Array<TextProps["fontSize"]> = [
  "sm",
  "base",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
];

export const variants: Array<TextProps["variant"]> = [
  undefined,
  "primary",
  "secondary",
  "accent",
  "success",
  "danger",
];

export const fontTypes: Array<TextProps["fontType"]> = ["heading", "body"];

export const Text = ({
  tag = "p",
  fontSize = "base",
  fontType = "body",
  onHover = false,
  closeLines=false,
  variant,
  children,
  onClick,
  "data-testid": dataTestId,
}: PropsWithChildren<TextProps>) => {
  const className = useMemo(() => {
    const colour = () => {
      switch (variant) {
        case "primary":
          return `text-primary ${
            onHover ? "hover:text-primary-highlight" : ""
          }`;
        case "secondary":
          return `text-secondary ${
            onHover ? "hover:text-secondary-highlight" : ""
          }`;
        case "accent":
          return `text-accent ${onHover ? "hover:text-accent-highlight" : ""}`;
        case "success":
          return `text-green-500 ${onHover ? "hover:text-green-600" : ""}`;
        case "danger":
          return `text-red-500 ${onHover ? "hover:text-red-600" : ""}`;
        default:
          return `text-text ${onHover ? "hover:text-slate-400" : ""}`;
      }
    };
    const size = () => {
      switch (fontSize) {
        case "sm":
          return "text-sm";
        case "base":
          return "text-base";
        case "xl":
          return "text-xl";
        case "2xl":
          return "text-2xl";
        case "3xl":
          return "text-3xl";
        case "4xl":
          return "text-4xl";
        case "5xl":
          return "text-5xl";
        default:
          return "text-base";
      }
    };

    return clsx([
      colour(),
      size(),
      {
        "font-heading": fontType === "heading",
        "font-body": fontType === "body",
        "hover:underline": onHover,
        "leading-4": closeLines,
      },
    ]);
  }, [fontSize, fontType, variant, onHover]);

  switch (tag) {
    case "h1":
      return <h1 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h1>;
    case "h2":
      return <h2 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h2>;
    case "h3":
      return <h3 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h3>;
    case "h4":
      return <h4 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h4>;
    case "h5":
      return <h5 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h5>;
    case "h6":
      return <h6 onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</h6>;
    default:
      return <p onClick={() => onClick && onClick()} data-testid={dataTestId} className={className}>{children}</p>;
  }
};
