import { Text } from "@/components/ui";
import clsx from "clsx";
import { InputHTMLAttributes, useState } from "react";

export type InputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: string) => void;
  disabled?: boolean;
  showErrors?: boolean;
  "data-testid"?: string;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "type" | "required">;

export const Input = ({
  label,
  disabled,
  value,
  onChange,
  placeholder,
  type,
  required,
  showErrors,
  "data-testid": dataTestId,
}: InputProps) => {
  return (
    <label>
      {label && <Text>{label}</Text>}
      <input
        data-testid={dataTestId}
        className={clsx(
          "shadow appearance-none border font-body rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4",
          showErrors && required && "invalid:bg-red-300",
        )}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
      />
    </label>
  );
};
