import { TextmodCardProps } from "@/components/TextmodCard";
import { Database } from "@/utils/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UseTextModsCalculatedProps = keyof Database["public"]["Tables"];

export const useTextModsCalculated = (table: UseTextModsCalculatedProps) => {

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["calcMods", table],
    queryFn: async () => {
      const { data } = await axios.get(`/api/table/${table}`);

      if (!data) {
        throw new Error("No data found");
      }

      const fixed = data.data.map((row: TextmodCardProps) => {
        return {
          ...row,
          createdDate: new Date(row.createdDate),
        }
      });

      return fixed as TextmodCardProps[];
    },
  });

  return { data, error, isLoading, refetch };
};
