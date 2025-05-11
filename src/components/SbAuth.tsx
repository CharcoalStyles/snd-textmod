import { useEffect } from "react";
import { MagicLink } from "@supabase/auth-ui-react";
import { ThemeSupa, ViewType } from "@supabase/auth-ui-shared";
import { useUser } from "@/hooks/useUser";
import { supabaseAtom } from "@/utils/supabase";
import { useAtom } from "jotai";
import { Modal } from "@/components/ui";

type SbAuthProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function SbAuth({ isOpen, onClose }: SbAuthProps) {
  const [supabase] = useAtom(supabaseAtom);
  const { user } = useUser();

  useEffect(() => {
    supabase.auth.getSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <MagicLink
            supabaseClient={supabase}
            
            appearance={{
              theme: ThemeSupa,
              style:{
                input:{
                  color: "white",
                }
              }
            }}
            redirectTo="new-user"
            providers={[]}
          />
        </div>
      </Modal>
    ) : null;
  }
}
