import { Button, Modal, Text, TextArea } from "@/components/ui";
import { supabaseAtom } from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";

type CommentProps = {
  modId: number;
  comments: Array<{
    id: number;
    comment: string;
    creator: {
      id: string;
      username: string;
    };
    createdDate: Date;
  }> | null;
  onUpdate: () => void;
};

export const Comments = ({ comments, onUpdate, modId }: CommentProps) => {
  const user = useUser();
  const [supabase] = useAtom(supabaseAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <Text fontSize="2xl" fontType="heading">
            Comments
          </Text>
          <Button
            label="Add a comment"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
        <div className="flex flex-row gap-2 justify-between flex-wrap">
          {comments &&
            comments.map((c) => (
              <div
                key={c.id}
                className="basis-72 max-w-96 flex-grow flex flex-col border border-text p-2 my-2">
                <div className="flex flex-row justify-between">
                  <div>
                    {c.comment.split("~n").map((l) => (
                      <Text key={l} fontSize="xl" fontType="body">
                        {l}
                      </Text>
                    ))}
                  </div>
                  {user && user.id === c.creator.id && (
                    <Text
                      variant="danger"
                      showHoverable
                      onHover
                      onClick={() => {
                        supabase
                          .from("mod_comments")
                          .delete()
                          .eq("id", c.id)
                          .then(({ error }) => {
                            if (error) {
                              console.error("Error deleting comment:", error);
                            } else {
                              onUpdate();
                            }
                          });
                      }}
                      fontSize="sm"
                      fontType="body">
                      Delete
                    </Text>
                  )}
                </div>
                <div className="flex flex-row justify-between">
                  <Text fontType="body">
                    By{" "}
                    <Link
                      href={`/user/${c.creator.username
                        .toLowerCase()
                        .replace(" ", "-")}`}>
                      {c.creator.username}
                    </Link>
                  </Text>
                  <Text fontType="body">{c.createdDate.toDateString()}</Text>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}>
        <div>
          <Text fontSize="2xl" fontType="heading">
            Add a comment
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.warn("submit");
              if (user && comment.trim().length > 10) {
                supabase
                  .from("mod_comments")
                  .insert({
                    comment: comment.replace(/\n/g, "~n"),
                    mod_id: modId,
                    user_id: user.id,
                  })
                  .then(({ error }) => {
                    if (error) {
                      console.error("Error adding comment:", error);
                    } else {
                      onUpdate();
                      setIsOpen(false);
                    }
                  });
              }
            }}>
            {!user && (
              <Text fontType="body">You must be logged in to comment</Text>
            )}
            <TextArea
              label="Comment"
              disabled={!user}
              value={comment}
              onChange={(v) => {
                setComment(v);
              }}
            />
            <div className="flex justify-end">
              <Button label="Add comment" />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
