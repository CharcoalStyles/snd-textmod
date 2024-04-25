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
  "data-testid"?: string;
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overLayClassName,
  "data-testid": testId,
}: SbAuthProps) {
  return (
    <ReactModal
      testId={testId}
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
        "mx-auto mt-32 px-12 py-8 w-2/5 max-w-xl absolute inset-x-0 rounded-xl bg-black border border-slate-600",
        className
      )}>
      {children}
    </ReactModal>
  );
}
