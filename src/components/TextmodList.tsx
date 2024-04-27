import { useTextmodsQuery } from "@/hooks/useTextmodsQuery";
import { Text } from "@/components/ui";
import { Loader } from "./Loader";
import { TextmodCard } from "./TextmodCard";
import { Database } from "@/utils/schema";
import { useTextModsCalculated } from "@/hooks/useTextModsCalculated";

type QueryProps = {
  userId?: string;
  orderBy?: "newest" | "oldest" | "top";
  lastDate?: Date;
  limit?: number;
};

type UseTextmodListProps = {
  query?: QueryProps;
  table?: keyof Database["public"]["Tables"];
};

export const TextmodList = ({ table, query }: UseTextmodListProps) => {
  if (table) {
    return <TableList table={table}  />;
  }
  if (query) {
    return <QueryList {...query} />;
  }
  return null;
};

const TableList = ({table}: {table : keyof Database["public"]["Tables"]}) => {
  const { data, error, isLoading } = useTextModsCalculated(table);

  return (
    <div>
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data &&
        data.map((textmod) => <TextmodCard key={textmod.id} {...textmod} />)}
    </div>
  );
}

const QueryList = ({ lastDate, limit, orderBy, userId }: QueryProps) => {
  const { data, error, isLoading } = useTextmodsQuery({
    limit,
    orderBy,
    userId,
    lastDate,
  });

  return (
    <div>
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data &&
        data.map((textmod) => <TextmodCard key={textmod.id} {...textmod} />)}
    </div>
  );
};
