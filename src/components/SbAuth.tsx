import { useState, useEffect } from "react";
import { SignUp, MagicLink } from "@supabase/auth-ui-react";
import { ThemeSupa, ViewType } from "@supabase/auth-ui-shared";
import { useUser } from "@/hooks/useUser";
import { supabaseAtom } from "@/utils/supabase";
import { useAtom } from "jotai";
import { Modal, Text } from "@/components/ui";

type SbAuthProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function SbAuth({ isOpen, view, onClose }: SbAuthProps) {
  const [supabase] = useAtom(supabaseAtom);
  const { user } = useUser();
  const [authView, setAuthView] = useState<ViewType>(view || "sign_in");

  useEffect(() => {
    setAuthView(view || "sign_in");
  }, [view]);

  useEffect(() => {
    supabase.auth.getSession();
  }, []);

  if (user) {
    return null;
  }

  if (!user) {
    return isOpen ? (
      <Modal
        data-testid="auth-modal"
        isOpen={isOpen}
        onClose={() => onClose && onClose()}>
        <div data-testid="sb-auth-modal">
          <MagicLink supabaseClient={supabase} appearance={
            {
              theme: ThemeSupa,
            }
          } redirectTo="/new-user" providers={[]} />
         
        </div>
      </Modal>
    ) : null;
  }
}