import { useTextmodsQuery } from "@/hooks/useTextmodsQuery";
import { Loader } from "./Loader";
import { TextmodCard, TextmodCardProps } from "./TextmodCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type QueryProps = {
  userName?: string;
  orderBy?: "newest" | "oldest" | "top" | "lastUpdated";
  lastDate?: Date;
  limit?: number;
};

type UseTextmodListProps = {
  query?: QueryProps;
  cacheUrl?: string;
};

export const TextmodList = ({ query, cacheUrl }: UseTextmodListProps) => {
  if (query) {
    return <QueryList {...query} />;
  }
  if (cacheUrl) {
    return <CacheList cacheUrl={cacheUrl} />;
  }
  return null;
};

const QueryList = ({ lastDate, limit, orderBy, userName }: QueryProps) => {
  const { data, error, isLoading } = useTextmodsQuery({
    limit,
    orderBy,
    userName,
    lastDate,
  });

  return (
    <div>
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data &&
        data.map((textmod) => <RenderCard key={textmod.id} textmod={textmod} />)}
    </div>
  );
};

const CacheList = ({ cacheUrl }: { cacheUrl: string }) => {
  const fullUrl = `api/${cacheUrl}`;
  const { data, error, isLoading } = useQuery({
    queryKey: ["cache", cacheUrl],
    queryFn: async () => {
      const { data, status } = await axios.get<Array<TextmodCardProps>>(fullUrl);
      if (status !== 200) {
        throw new Error("Error fetching data");
      }
      const fixed = data.map((row) => {
        return {
          ...row,
          createdDate: new Date(row.createdDate),
          lastModified: row.lastModified ? new Date(row.lastModified) : null,
        };
      });
      return fixed;
    },
  });
  return (
    <div>
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data &&
        data.map((textmod) => <RenderCard key={textmod.id} textmod={textmod} />)}
    </div>
  );
} 

const RenderCard = ({ textmod }:{textmod:TextmodCardProps}) => {
  return <div className="mb-1"><TextmodCard key={textmod.id} {...textmod} /></div>;
}