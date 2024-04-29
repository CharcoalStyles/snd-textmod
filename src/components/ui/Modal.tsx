import { useState, useEffect, PropsWithChildren } from "react";
// import PureModal from "react-pure-modal";
import ReactModal from "react-modal";
import { Text } from "@/components/ui";
import clsx from "clsx";

type SbAuthProps = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  className?: string | ReactModal.Classes;
  overLayClassName?: string | ReactModal.Classes;
  variant?: "primary" | "secondary" | "accent" | "success" | "error";
};

const getBorderColour = (
  variant: "primary" | "secondary" | "accent" | "success" | "error"
) => {
  switch (variant) {
    case "primary":
      return "border-primary";
    case "secondary":
      return "border-secondary";
    case "accent":
      return "border-accent";
    case "success":
      return "border-success";
    case "error":
      return "border-error";
    default:
      return "border-primary";
  }
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overLayClassName,
  variant = "primary",
}: SbAuthProps) {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      onRequestClose={() => {
        onClose && onClose();
      }}
      overlayClassName={clsx(
        "fixed inset-0 bg-black bg-opacity-50",
        overLayClassName
      )}
      className={clsx(
        "mx-auto mt-32 px-12 py-8 w-full max-w-xl absolute inset-x-0 bg-black border",
        getBorderColour(variant),
        className
      )}>
      {children}
    </ReactModal>
  );
}
