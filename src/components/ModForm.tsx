import { Button, Input, Text, TextArea } from "./ui";
import { useState } from "react";
import { Resource } from "sst";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import FileInput from "./ui/FileInput";

export type TextmodData = {
  id?: number;
  description: string;
  mod: string;
  name: string;
  mainImageUrl?: string;
  secondaryImagesUrl?: string[];
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
      mainImageUrl: "",
      secondaryImagesUrl: [],
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File>();
  const maxNameLength = 100;

  return (
    <div>
      {error && <Text variant="danger">{error}</Text>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (formData.name.length > maxNameLength) {
            return;
          }

          if (mainImage) {
            const command = new PutObjectCommand({
              Key: crypto.randomUUID(),
              Bucket: Resource.MyBucket.name,
            });
            const url = await getSignedUrl(new S3Client(), command);
            setFormData((prev) => ({ ...prev, mainImageUrl: url }));

            const res = await fetch(url, {
              method: "PUT",
              body: mainImage,
              headers: {
                "Content-Type": mainImage.type,
                "Content-Disposition": `attachment; filename="${mainImage.name}"`,
              },
            });
            if (!res.ok) {
              throw new Error("Failed to upload image");
            }
            else {
              console.log("Uploaded image");
              formData.mainImageUrl = url;
            }
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
            <FileInput
              label="Main Image"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const x = e.target.files?.[0];
                //  fetch("url", {
                //   body:  e.target.files?.[0],
                //   method: "PUT",
                //   headers: {
                //     "Content-Type":  e.target.files?.[0].type,
                //     "Content-Disposition": `attachment; filename="${ e.target.files?.[0].name}"`,
                //   },
                // });
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
