import { useState } from "react";
import { Button, Modal, Text } from "./ui";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { ModForm, TextmodData } from "./ModForm";

type ModModalProps = {
  preFill?: TextmodData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  description: string;
};

export const ModModal = ({
  preFill,
  isOpen,
  onClose,
  onSubmit,
  description,
  title,
}: ModModalProps) => {
  const [supabase] = useAtom(supabaseAtom);

  const [isSaving, setIsSaving] = useState(false);

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
            onCancel={() => {
              onClose();
            }}
            onSubmit={(data) => {
              setIsSaving(true);
              supabase
                .from("mods")
                .upsert({ ...data })
                .then(({ error, status }) => {
                  onSubmit && onSubmit();
                  setIsSaving(false);
                  onClose();
                });
            }}
            disabled={isSaving}
          />
        </div>
      </Modal>
    </>
  );
};
