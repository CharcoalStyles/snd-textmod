import { useState } from "react";
import { Button, Modal, Text } from "./ui";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { ModForm, TextmodFormData } from "./ModForm";
import { useUser } from "@/hooks/useUser";
import { Database } from "@/utils/schema";

type ModModalProps = {
  preFill?: Omit<TextmodFormData, 'mod'>;
  mod?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  description: string;
};

export const ModModal = ({
  preFill,
  mod,
  isOpen,
  onClose,
  onSubmit,
  description,
  title,
}: ModModalProps) => {
  const [supabase] = useAtom(supabaseAtom);
  const { user } = useUser();

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string>();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}>
        <div>
          <div className="mb-4">
            <Text variant="primary" fontSize="2xl" fontType="heading" tag="h2">
              {title}
            </Text>
            <Text fontType="body">{description}</Text>
          </div>
          <ModForm
            preFill={preFill}
            mod={mod}
            onCancel={() => {
              onClose();
            }}
            outerError={error}
            onSubmit={async (data) => {
              setIsSaving(true);

              const {
                mainImage,
                mainImageUrl,
                secondaryImages,
                secondaryImageUrls,
                ...d
              } = data;

              if (user) {
                if (mainImageUrl === undefined && preFill?.mainImageUrl) {
                  const o = preFill.mainImageUrl.split("/");
                  const filename = o[o.length - 1];

                  const { error } = await supabase.storage
                    .from("images")
                    .remove([`${user.id}/${filename}`]);

                  if (error) {
                    console.error(error);
                  }
                }

                const submitData: Database["public"]["Tables"]["mods"]["Insert"] =
                  {
                    ...d,
                    main_image: mainImage ? null : mainImageUrl ? mainImageUrl : null,
                    // secondary_images: null
                  };

                if (mainImage) {
                  const randomFilename = Math.random()
                    .toString(36)
                    .substring(2, 15);
                  const filename = `${randomFilename}.${mainImage.name
                    .split(".")
                    .pop()}`;

                  const { data, error } = await supabase.storage
                    .from("images")
                    .upload(`${user.id}/${filename}`, mainImage);
                  console.log(data);
                  console.log(error);

                  if (error) {
                    setError(error.message);
                    return;
                  }

                  const { data: imageUrl } = supabase.storage
                    .from("images")
                    .getPublicUrl(data.path);
                  submitData.main_image = imageUrl.publicUrl;
                }

                supabase
                  .from("mods")
                  .upsert(submitData)
                  .then(({ error, status }) => {
                    if (error) {
                      console.error(error);
                      return;
                    }
                    onSubmit && onSubmit();
                    setIsSaving(false);
                    onClose();
                  });
              }
            }}
            disabled={isSaving}
          />
        </div>
      </Modal>
    </>
  );
};
