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

  const [loading, setLoading] = useState(true);
  const [supabase] = useAtom(supabaseAtom);
  const { user, userData, isLoading, error } = useUser();
  const [ucOne, setUcOne] = useState(true);
  const [submitError, setSubmitError] = useState<string>();

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

      setLoading(true);
      timeoutRef.current = setTimeout(() => {

        if (user === null || (userData !== undefined && userData.length > 0)) {

          router.push("/");
        } else {
          setLoading(false);
        }
      }, 500);
    }
  }, [isLoading, user, userData]);

  if (loading || !user || userData === undefined || userData.length > 0) {
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
      error={submitError}
      onSubmit={async (result) => {
        if (!user) return;

        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", result.username);

        if (error) {
          console.error("Error fetching profiles:", error);
          setLoading(false);
          setSubmitError("Error creating user");
          return;
        }

        if (data && data.length > 0) {
          setLoading(false);
          setSubmitError("Username already taken");
          return;
        }

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
  error?: string;
};

const NewUserForm = ({ onSubmit, error }: NewUserFormProps) => {
  const [username, setUsername] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    //show error if the username contains characters that are not allowed
    if (username.match(/[^a-zA-Z0-9]/)) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [username]);

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
            <Text fontSize="xl"> - Vote on other&apos;s textmods</Text>
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
        <Text fontSize="xl" fontType="body" variant="base">
          Letters and numbers only
        </Text>
        {error && (
          <Text fontSize="xl" fontType="body" variant="danger">
            {error}
          </Text>
        )}
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
          <Button disabled={disableSubmit} variant="secondary" label="Submit" />
        </form>
      </div>
    </div>
  );
};
