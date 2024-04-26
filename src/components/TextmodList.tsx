import { useTextmods } from "@/hooks/useTextmods";
import { Text } from "@/components/ui";
import { Loader } from "./Loader";
import { TextmodCard } from "./TextmodCard";

type UseTextmodListProps = {
  userId?: string;
  orderBy?: "newest" | "oldest" | "top";
  lastDate?: Date;
  limit?: number;
};

export const TextmodList = ({limit, orderBy, userId, lastDate}:UseTextmodListProps) => {

  const {data, error, isLoading} = useTextmods({limit, orderBy, userId, lastDate});
  
    return (
        <div>
            {isLoading && <Loader />}
            {error && <p>Error: {error.message}</p>}
            {data && data.map((textmod) => (
                <TextmodCard key={textmod.id}
                  commentCount={textmod.mod_comments[0].count} 
                  creatorName={textmod.username} 
                  downvotes={
                  textmod.mod_votes.filter(({upvote}) => !upvote).length} 
                  textmod={textmod} 
                  upvotes={textmod.mod_votes.filter(({upvote}) => upvote).length}
                  createdDate={textmod.createdDate} /> 
            ))}
        </div>
    );
};