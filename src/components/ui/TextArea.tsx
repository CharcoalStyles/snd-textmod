import { Text } from "@/components/ui";
import clsx from "clsx";
import { TextareaHTMLAttributes, useState } from "react";

export type TextAreaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: string) => void;
  disabled?: boolean;
  showErrors?: boolean;
  "data-testid"?: string;
} & Pick<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "cols" | "rows" | "required"
>;

export const TextArea = ({
  label,
  disabled,
  value,
  onChange,
  placeholder,
  cols,
  rows,
  required,
  showErrors,
  "data-testid": dataTestId,
}: TextAreaProps) => {
  return (
    <label>
      {label && <Text>{label}</Text>}
      <textarea
        data-testid={dataTestId}
        className={clsx(
          "shadow appearance-none border font-body rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4",
          showErrors && required && "invalid:bg-red-300"
        )}
        value={value}
        cols={cols}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
      />
    </label>
  );
};
