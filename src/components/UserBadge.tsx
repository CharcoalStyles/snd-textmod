import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
// import { getSupabase } from "@/utils/supabase";
import clsx from "clsx";
import { useUser } from "@/hooks/useUser";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export const UserBadge = () => {
  const [supabase] = useAtom(supabaseAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, refetch, clear } = useUser();

  const [label, setLabel] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      setLabel(`${userData.username}`);
    } else {
      refetch();
    }
  }, [userData]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <Button
          variant="accent"
          size="medium"
          label={label}
          isActive={menuOpen}
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        />
        <div
          className={clsx(
            "dropdown-menu absolute h-auto border border-slate-600 bg-black w-full p-2",
            menuOpen ? "block" : "hidden"
          )}
        >
          <Button
            label="Logout"
            fullWidth
            noBorder
            onClick={() => {
              clear();
              supabase.auth.signOut();
            }}
          />
        </div>
      </div>
    </div>
  );
};
