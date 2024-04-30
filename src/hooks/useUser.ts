import { Database } from "@/utils/schema";
import { supabaseAtom } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";

const userAtom = atom<User | null>(null);
const userDataAtom = atom<Array<
  Database["public"]["Tables"]["profiles"]["Row"]
> | null>(null);

export const useUser = () => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [userData, setUserData] = useAtom(userDataAtom);
  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["userData", currentUser?.id ?? ""],
    queryFn: async () => {
      console.log("UseUSer - useQuery", "Start", { currentUser, userData });
      if (userData && userData.length > 0) {
        return userData;
      }
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        throw error;
      }

      if (user === null) {
        console.warn("No user found");
        return null;
      }

      setCurrentUser(user);

      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id);

      if (dbError) {
        console.error("Error fetching records:", dbError);
        throw dbError;
      }

      
      setUserData(data);
      return data;
    },
  });

  return {
    user: currentUser,
    userData: data === null ? undefined : data,
    error: error,
    isLoading: isLoading && currentUser === null && userData === null,
    refetch: refetch,
    clear: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: [currentUser.id] });
        setCurrentUser(null);
      }
    },
  };
};
