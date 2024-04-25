import { Database } from "@/utils/schema";
import { supabaseAtom } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

const userAtom = atom<User | null>(null);
const userDataAtom = atom<
  Array<Database["public"]["Tables"]["profiles"]["Row"]> | null
>(null);

export const useUser = () => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [userData, setUserData] = useAtom(userDataAtom);

  useEffect(()=>{
    if (currentUser === null) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user === null) {
          return;
        }
        setCurrentUser(user);
        if (!isLoading) refetchUserData();
      });
    }
  }, []);
  
  const { error, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ["userData", currentUser?.id ?? ""],
    queryFn: async () => {
      if (userData && userData.length > 0) {
        return userData;
      }

      if (currentUser === null) {
        console.warn("No user found");
        return null;
      }
      
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id);

      if (dbError) {
        console.error("Error fetching records:", dbError);
        throw dbError;
      }

      setUserData(data);
      return data;
    },
  });

  const refetchUserData = () => {
    refetch().then(({ data }) => {
      if (data) setUserData(data);
    });
  };

  return {
    user: currentUser,
    userData,
    error,
    isLoading : isLoading && currentUser === null && userData === null,
    refetch: refetchUserData,
    clear: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: [currentUser.id] });
        setCurrentUser(null);
      }
    },
  };
}