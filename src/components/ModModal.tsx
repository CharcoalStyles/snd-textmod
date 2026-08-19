import { useState } from "react";
import { Button, Modal, Text } from "./ui";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { ModForm, TextmodFormData } from "./ModForm";
import { useUser } from "@/hooks/useUser";
import { Database } from "@/utils/schema";
import { Tag } from "@/utils/tags";

type ModModalProps = {
  preFill?: Omit<TextmodFormData, 'mod'>;
  mod?: string;
  tags?: Tag[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  description: string;
};

export const ModModal = ({
  preFill,
  mod,
  tags,
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
            tags={tags}
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
                tags: submittedTags,
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
                    last_modified: new Date().toISOString(),
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

                const { data: savedMods, error: saveError } = await supabase
                  .from("mods")
                  .upsert(submitData)
                  .select();

                if (saveError || !savedMods?.[0]) {
                  setError(saveError?.message);
                  setIsSaving(false);
                  return;
                }

                const modId = savedMods[0].id;
                const existingTags = tags || [];
                const newTags = submittedTags || [];
                const tagsToAdd = newTags.filter(
                  (t) => !existingTags.includes(t)
                );
                const tagsToRemove = existingTags.filter(
                  (t) => !newTags.includes(t)
                );

                if (tagsToAdd.length > 0) {
                  const { error: tagError } = await supabase
                    .from("mod_tags")
                    .upsert(tagsToAdd.map((tag) => ({ mod_id: modId, tag })));
                  if (tagError) {
                    setError(tagError.message);
                    setIsSaving(false);
                    return;
                  }
                }

                if (tagsToRemove.length > 0) {
                  const { error: tagError } = await supabase
                    .from("mod_tags")
                    .delete()
                    .eq("mod_id", modId)
                    .in("tag", tagsToRemove);
                  if (tagError) {
                    setError(tagError.message);
                    setIsSaving(false);
                    return;
                  }
                }

                const { data: session } = await supabase.auth.getSession();
                const modTextRes = await fetch(
                  `/api/modText/${modId}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session.session?.access_token}`,
                    },
                    body: JSON.stringify({ modText: d.mod }),
                  }
                );

                if (!modTextRes.ok) {
                  setError("Failed to save mod text.");
                  setIsSaving(false);
                  return;
                }

                onSubmit && onSubmit();
                setIsSaving(false);
                onClose();
              }
            }}
            disabled={isSaving}
          />
        </div>
      </Modal>
    </>
  );
};
