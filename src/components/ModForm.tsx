import { Button, Input, Text, TextArea } from "./ui";
import { useState } from "react";

export type TextmodData = {
  id?: number;
  description: string;
  mod: string;
  name: string;
};

type ModFormProps = {
  preFill?: TextmodData;
  onSubmit: (data: TextmodData) => void;
  onCancel: () => void;
  disabled?: boolean;
};

export const ModForm = ({
  disabled,
  onCancel,
  onSubmit,
  preFill,
}: ModFormProps) => {
  const [formData, setFormData] = useState<TextmodData>(
    preFill || {
      name: "",
      description: "",
      mod: "",
    }
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error && <Text variant="danger">{error}</Text>}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (formData.name.length > 20) {
            return;
          }
          onSubmit(formData);
        }}>
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Name"
              value={formData.name}
              onChange={(v) => {
                if (v.length > 100) {
                  setError("Name is too long");
                }
                setFormData((prev) => ({ ...prev, name: v }));
              }}
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(v) => {
                setFormData((prev) => ({ ...prev, description: v }));
              }}
            />
            <TextArea
              label="TextMod"
              value={formData.mod}
              onChange={(v) => {
                setFormData((prev) => ({ ...prev, mod: v }));
              }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="primary"
            disabled={disabled}
            label={disabled ? "Submitting..." : "Submit"}
            type="submit"
          />
          <Button
            variant="secondary"
            disabled={disabled}
            label={"Cancel"}
            type="button"
            onClick={() => {
              onCancel();
            }}
          />
        </div>
      </form>
    </div>
  );
};
