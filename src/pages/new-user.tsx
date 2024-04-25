import React, { useEffect, useState } from "react";
import { Button, Text } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";

const NewUserPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [supabase] = useAtom(supabaseAtom);
  const { user, userData, isLoading, error, refetch } = useUser();
  const [ucOne, setUcOne] = useState(true);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      console.warn("Error fetching user details:", error);
      router.push("/");
    }
  }, [error]);

  useEffect(() => {
    if (!isLoading) {
      if (ucOne) {
        setUcOne(false);
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (user === null) {
          console.warn("No user found, redirecting to login");
          router.push("/");
        }

        if (userData) {
          console.warn("User already has profile, redirecting to dashboard");
          router.push("/");
        }
      }, 500);
    }
  }, [isLoading, user]);

  if (loading || !user) {
    return (
      <div
        data-testid="loader"
        className="flex items-center justify-center h-screen">
        <Text fontSize="2xl" variant="primary" fontType="body">
          Getting everything ready...
        </Text>
      </div>
    );
  }

  return (
    <NewUserForm
      onSubmit={(result) => {
        if (!user) return;

        setLoading(true);
        supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: result.username,
          })
          .then(({ error, status }) => {
            if (error) {
              console.error("Error inserting user:", error);
              return;
            }
            if (status !== 201) {
              console.error("Error inserting user:", status);
              return;
            }
            queryClient.invalidateQueries({ queryKey: [user.id] });
            setLoading(false);
            router.push("/");
          });
      }}
    />
  );
};

export default NewUserPage;

type NewUserFormProps = {
  onSubmit: (result: { username: string }) => void;
};

const NewUserForm = ({ onSubmit }: NewUserFormProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "") return;

    onSubmit({ username });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Text fontSize="3xl" fontType="heading" variant="primary">
        Welcome!
      </Text>
      <div className="text-left">
        <Text fontSize="xl" fontType="body">
          With an account you can:
        </Text>
        <ul className="from-neutral-300 list-outside list-disc">
          <li>
            <Text fontSize="xl"> - Share your textmods</Text>
          </li>
          <li>
            <Text fontSize="xl"> - Vote on other's textmods</Text>
          </li>
          <li>
            <Text fontSize="xl"> - Comment on textmods</Text>
          </li>
          <li>
            <Text fontSize="xl"> - And more (to come)!</Text>
          </li>
        </ul>
      </div>
      <div className="pt-4 flex flex-col">
        <form className="pt-4 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="usernameInput">
            <Text>Username:</Text>
          </label>
          <input
            type="text"
            id="usernameInput"
            placeholder="Tann"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 mb-2"
          />
          <Button variant="secondary" label="Submit" />
        </form>
      </div>
    </div>
  );
};
