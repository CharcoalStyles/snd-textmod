import { Button, Text } from "./ui";
import { useEffect, useRef, useState } from "react";
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

    if (isLoading || !userData) {
      timeoutRef.current = setTimeout(() => {
        refetch();
      }, 500);
      return;
    }

    if (userData && userData.username) {
      setLoading(false);
      setLabel(`${userData.username}`);
    } else {
      if (user) {
        router.push("/new-user");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            label="Profile"
            variant="primary"
            fullWidth
            noBorder
            onClick={() => {
              router.push(
                `/user/${userData!.username.toLowerCase().replace(" ", "-")}`
              );
            }}
          />
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
