//create a sliding switch style checkbox component styled with tailwind

import React from "react";
import { Text } from "./Text";
import { clsx } from "clsx";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (e: boolean) => void;
  disabled?: boolean;
  "data-testid"?: string;
};

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  "data-testid": dataTestId,
}: CheckboxProps) => {
  return (
    <div className="mb-4">
      <label 
          data-testid={dataTestId}>
        <Text>{label}</Text>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
        <span
          className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
            checked ? "bg-primary" : "bg-[#CCCCCE]"
          }`}>
          <span
            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
              checked ? "translate-x-6" : ""
            }`}></span>
        </span>
      </label>
    </div>
  );
};
