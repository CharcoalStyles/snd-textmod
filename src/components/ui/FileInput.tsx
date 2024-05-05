import clsx from "clsx";
import React, { ComponentPropsWithRef } from "react";
import { Text } from "./Text";

type Props = ComponentPropsWithRef<"input"> & {
  label: string;
};
const FileInput = ({label, ...props}: Props) => {
  return (
    <label>
      {label && <Text>{label}</Text>}
      <input
        {...props}
        className={clsx(
          "file:bg-black file:text-primary hover:file:bg-primary-highlight",
          "file:px-4 file:py-2 file:mr-4 file:border-none",
          "hover:cursor-pointer border rounded-lg text-accent"
        )}
        type="file"
      />
    </label>
  );
};

export default FileInput;
