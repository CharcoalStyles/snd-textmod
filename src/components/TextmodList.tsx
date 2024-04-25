import { useTextmods } from "@/hooks/useTextmods";
import { Text } from "@/components/ui";
import { Loader } from "./Loader";

type UseTextmodListProps = {
  userId?: string;
  orderBy?: "newest" | "oldest" | "top";
  limit?: number;
};

export const TextmodList = ({limit, orderBy, userId}:UseTextmodListProps) => {

  const {data, error, isLoading} = useTextmods({limit, orderBy, userId});
  
    return (
        <div>
            {isLoading && <Loader />}
            {error && <p>Error: {error.message}</p>}
            {data && data.map((textmod) => (
                <div key={textmod.id}>
                    <Text fontSize="2xl" variant="primary" >{textmod.name}</Text>
                    <Text fontSize="xl">{textmod.description}</Text>
                    <Text fontSize="base">Ups: {textmod.mod_votes.filter(({upvote}) => upvote).length}</Text>
                    <Text fontSize="base">Downs: {textmod.mod_votes.filter(({upvote}) => !upvote).length}</Text>

                </div>
            ))}
        </div>
    );
};