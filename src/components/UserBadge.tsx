import { Button, Text } from "./ui";
import { useEffect, useRef, useState } from "react";
// import { getSupabase } from "@/utils/supabase";
import clsx from "clsx";
import { useUser } from "@/hooks/useUser";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "./Loader";

export const UserBadge = () => {
  const [supabase] = useAtom(supabaseAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, user, isLoading, refetch, clear } = useUser();
  const [loading, setLoading] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [label, setLabel] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isLoading || !userData || userData.length === 0) {
      timeoutRef.current = setTimeout(() => {
        refetch();
      }, 500);
      return;
    }

    if (userData) {
      setLoading(false);
      setLabel(`${userData[0].username}`);
    } else {
      if (user) {
        router.push("/new-user");
      } else {
        refetch();
      }
    }
  }, [userData, isLoading]);

  if (loading) {
    return <Loader color="primary" size="sm" />;
  }

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
            "dropdown-menu text-center absolute h-auto border border-slate-600 bg-black w-full p-2",
            menuOpen ? "block" : "hidden"
          )}>
          <Button
            label="Logout"
            fullWidth
            noBorder
            onClick={() => {
              clear();
              supabase.auth.signOut();
            }}
          />
          <hr />
          <div className="mt-2">
            <Text fontSize="sm">v. 1.0.1</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
