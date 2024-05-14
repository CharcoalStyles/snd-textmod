import { Button, Input, Text, TextArea } from "./ui";
import { useEffect, useState } from "react";
import FileInput from "./ui/FileInput";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";

export type TextmodFormData = {
  id?: number;
  description: string;
  mod: string;
  name: string;
  mainImage?: File;
  mainImageUrl?: string;
  secondaryImages?: File[];
  secondaryImageUrls?: string[];
};

type ModFormProps = {
  preFill?: TextmodFormData;
  onSubmit: (data: TextmodFormData) => void;
  onCancel: () => void;
  disabled?: boolean;
  outerError?: string;
};

export const ModForm = ({
  disabled,
  onCancel,
  onSubmit,
  preFill,
  outerError
}: ModFormProps) => {  
  const [formData, setFormData] = useState<TextmodFormData>(
    preFill || {
      name: "",
      description: "",
      mod: "",
      mainImage: undefined,
      secondaryImages: [],
    }
  );
  const [error, setError] = useState<string | null>(null);
  const maxNameLength = 100;

  useEffect(() => {
    if (outerError) {
      setError(outerError);
    }
  }, [outerError]);

  return (
    <div>
      {error && <Text variant="danger">{error}</Text>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (formData.name.length > maxNameLength) {
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
                if (v.length > maxNameLength) {
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
              rows={5}
              value={formData.mod}
              onChange={(v) => {
                setFormData((prev) => ({ ...prev, mod: v }));
              }}
            />
            {formData.mainImageUrl && (
               <div className="flex flex-row justify-center">
               <img
                 src={formData.mainImageUrl}
                 alt="main image"
                 width={150}
                 height={150}
                 className="rounded-lg"
               />
               <div>
                 <Button
                   variant="danger"
                   label="Remove"
                   onClick={() => {
                     setFormData((prev) => ({
                       ...prev,
                       mainImage: undefined,
                       mainImageUrl: undefined,
                     }));
                   }}
                   />
               </div>
             </div>
            )}
            {formData.mainImage && (
               <div className="flex flex-row justify-center">
               <img
                 src={URL.createObjectURL(formData.mainImage)}
                 alt="main image"
                 width={150}
                 height={150}
                 className="rounded-lg"
               />
               <div>
                 <Button
                   variant="danger"
                   label="Remove"
                   onClick={() => {
                     setFormData((prev) => ({
                       ...prev,
                       mainImage: undefined,
                       mainImageUrl: undefined,
                     }));
                   }}
                   />
               </div>
             </div>
            )}
            {!formData.mainImage && !formData.mainImageUrl && (
            <FileInput
              label="Main Image"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, mainImage: e.target.files?.[0] }));
              }}
            />
            )}
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
