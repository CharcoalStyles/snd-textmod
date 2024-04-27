import { useState } from "react";
import { Button, Input, Modal, Text, TextArea } from "./ui";
import { Database } from "@/utils/schema";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";

type NewTextmodData = { description: string; mod: string; name: string };

export const AddNewMod = () => {
  const [supabase] = useAtom(supabaseAtom);
  const [modalOpen, setModalOpen] = useState(false);

  const [hasFormError, setHasFormError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<NewTextmodData>({
    name: "",
    description: "",
    mod: "",
  });

  return (
    <>
      <Button
        variant="secondary"
        size="medium"
        label="Add new TextMod"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}>
        <div>
          <div className="mb-4">
            <Text variant="primary" fontSize="2xl" fontType="heading" tag="h2">
              Add new TextMod
            </Text>
            <Text fontType="body">
              Add a new textmod to the database. Name and TextMod are required
              fields. Description is highly recommended.
            </Text>
          </div>
          <form
            onInvalid={() => {
              setHasFormError(true);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setIsSaving(true);
              supabase.from('mods').insert(formData).then(({error, status}) => {
                setModalOpen(false);
              })
            }}>
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(v) => {
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
                disabled={isSaving}
                label={isSaving ? "Submitting..." : "Submit"}
                type="submit"
              />
              <Button
                variant="secondary"
                disabled={isSaving}
                label={"Cancel"}
                type="button"
                onClick={() => {
                  if (!isSaving) {
                    setModalOpen(false);
                  }
                }}
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
