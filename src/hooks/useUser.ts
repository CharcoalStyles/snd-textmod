import { supabaseAtom } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {useAtom } from "jotai";

export const useUser = () => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();

  const { data: session, isLoading: authLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => supabase.auth.getSession().then(res => res.data.session),
    refetchOnWindowFocus: false,
  });

  const user = session?.user ?? null;

  const { data: userData, error, isLoading: dataLoading } = useQuery({
    enabled: !!user,
    queryKey: ['userData', user ? user.id : 'no-user'],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!user) {
    return {
      user: null,
      userData: null,
      error: null,
      isLoading: authLoading,
      refetch: () => queryClient.invalidateQueries({ queryKey: ['session'] }),
      clear: () => queryClient.setQueryData(['session'], null),
    };
  }

  return {
    user,
    userData: userData || undefined,
    error,
    isLoading: authLoading || (dataLoading && !userData),
    refetch: () => queryClient.invalidateQueries({ queryKey: ['userData'] }),
    clear: () => {
      queryClient.removeQueries({ queryKey: ['userData'] });
      queryClient.setQueryData(['session'], null);
    },
  };
};
