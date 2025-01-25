/* eslint-disable @next/next/no-img-element */
import { Header, Loader } from "@/components";
import { Comments } from "@/components/Comments";
import { Footer } from "@/components/Footer";
import { ModModal } from "@/components/ModModal";
import { Button, Modal, Text } from "@/components/ui";
import { useTextMod } from "@/hooks/useTextMod";
import { Database } from "@/utils/schema";
import { supabase } from "@/utils/supabase";
import { User, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const findUserVote = (
  user?: User,
  votes?: Array<Database["public"]["Tables"]["mod_votes"]["Row"]>
) => {
  if (!user || !votes) return undefined;

  return votes.find((v) => v.user_id === user.id);
};

const handleVoteClick = async (
  modId: number,
  isUpvote: boolean,
  refetch: () => void,
  vote?: Database["public"]["Tables"]["mod_votes"]["Row"]
) => {
  if (vote) {
    // if the user has already voted this vote, delete it

    if (vote.upvote === isUpvote) {
      const { status, error } = await supabase
        .from("mod_votes")
        .delete()
        .eq("id", vote.id);

      if (error) {
        console.error("Error deleting vote:", error);
      }
    } else {
      // if the user has already voted, but is changing their vote
      const { status, error } = await supabase
        .from("mod_votes")
        .update({ upvote: isUpvote })
        .eq("id", vote.id);

      if (error) {
        console.error("Error updating vote:", error);
      }
    }
  } else {
    // if the user has not voted, add a vote
    const { status, error } = await supabase.from("mod_votes").insert({
      mod_id: modId,
      upvote: isUpvote,
    });

    if (error) {
      console.error("Error inserting vote:", error);
    }
  }

  refetch();
  return;
};

export default function TextModPage() {
  const router = useRouter();
  const id = router.query.id
    ? Number.parseInt(router.query.id as string)
    : undefined;
  const { data, error, isLoading, refetch } = useTextMod(id);
  const [showTextMod, setShowTextMod] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const user = useUser();

  console.log("data", data);

  const userVote = findUserVote(user !== null ? user : undefined, data?.votes);

  return (
    <main className="h-screen min-h-screen w-screen contain-content">
      <Header />
      <div className="h-screen p-2 w-screen overflow-y-auto scrollbar scrollbar-thumb-primary">
        <div className="mt-10 px-4 mx-auto w-full md:w-2/3 flex flex-col">
          {isLoading && (
            <div className="w-full text-center">
              <Loader size="2xl" color="secondary" />
            </div>
          )}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <>
              <div className="flex flex-row justify-between">
                <div>
                  <Text
                    fontSize="4xl"
                    scale
                    variant="primary"
                    fontType="heading">
                    {data.name}
                  </Text>
                  <div className="-mt-3 md:-mt-5 flex flex-row gap-2">
                    <Text fontSize="3xl" scale>
                      By: 
                    </Text>
                    <Link href={`/user/${data.creator.slug}`}>
                      <Text fontSize="3xl" scale fontType="body" showHoverable onHover>
                        {data.creator.name}
                      </Text>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-between text-right mt-5">
                  <div>
                    <Text scale fontType="body">
                      Added: {data.createdDate.toDateString()}
                    </Text>
                    <div className="flex flex-row justify-between">
                      {user && user.id === data.creator.id && (
                        <>
                          <Text
                            variant="accent"
                            showHoverable
                            onHover
                            onClick={() => {
                              setShowEditModal(true);
                            }}
                            fontType="body">
                            Edit
                          </Text>

                          <Text
                            variant="danger"
                            showHoverable
                            onHover
                            onClick={() => {
                              supabase
                                .from("mods")
                                .delete()
                                .eq("id", data.id)
                                .then(({ error }) => {
                                  if (error) {
                                    console.error(
                                      "Error deleting comment:",
                                      error
                                    );
                                  } else {
                                    router.push("/");
                                  }
                                });
                            }}
                            fontType="body">
                            Delete
                          </Text>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-end gap-2">
                    <Text
                      fontSize="3xl"
                      variant="success"
                      fontType="heading"
                      onHover={user !== null}
                      scale
                      onClick={() => {
                        user !== null &&
                          id &&
                          handleVoteClick(id, true, refetch, userVote);
                      }}>
                      ↑
                      {
                        data.votes.filter((v: { upvote: boolean }) => v.upvote)
                          .length
                      }
                    </Text>
                    <Text
                      fontSize="3xl"
                      variant="danger"
                      fontType="heading"
                      onHover={user !== null}
                      scale
                      onClick={() => {
                        user !== null &&
                          id &&
                          handleVoteClick(id, false, refetch, userVote);
                      }}>
                      ↓
                      {
                        data.votes.filter((v: { upvote: boolean }) => !v.upvote)
                          .length
                      }
                    </Text>
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex flex-col md:flex-row text-center gap-4">
                <div className="flex-grow text-left">
                  <Text fontSize="xl" fontType="body">
                    {data.description}
                  </Text>
                </div>
                <div className="w-full md:flex-shrink md:w-fit">
                  <div className="flex flex-row gap-2 justify-end">
                    <Button
                      variant="accent"
                      label="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(data.mod!);
                      }}
                    />
                    <Button
                      variant="secondary"
                      label={showTextMod ? "Hide" : "Show"}
                      onClick={() => {
                        setShowTextMod(!showTextMod);
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              {data.mainImage && (
                <div className="flex flex-row justify-center">
                  <img
                    src={data.mainImage}
                    alt="main image"
                    className="rounded-lg object-scale-down max-h-96 max-w-full"
                  />
                </div>
              )}

              {id && (
                <Comments
                  modId={id}
                  comments={data.comments}
                  onUpdate={() => {
                    refetch();
                  }}
                />
              )}
              <ModModal
                description="Edit your TextMod. Name and TextMod are required fields. Description is highly recommended."
                title="Edit TextMod"
                preFill={{
                  id: data.id,
                  name: data.name ? data.name : "",
                  description: data.description ? data.description : "",
                  mod: data.mod ? data.mod : "",
                  mainImageUrl: data.mainImage ? data.mainImage : undefined,
                }}
                isOpen={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                }}
                onSubmit={() => {
                  refetch();
                  setShowEditModal(false);
                }}
              />
              <Modal
                isOpen={showTextMod}
                onClose={() => {
                  setShowTextMod(false);
                }}>
                <div className="break-all flex flex-col gap-4">
                  <div className="max-h-96 w-full overflow-y-auto scrollbar scrollbar-thumb-secondary">
                    <Text fontType="body">{data.mod}</Text>
                  </div>
                  <Button
                    variant="accent"
                    label="Copy"
                    onClick={() => {
                      navigator.clipboard.writeText(data.mod!);
                    }}
                  />
                  <Button
                    variant="black"
                    label="Close"
                    onClick={() => {
                      setShowTextMod(false);
                    }}
                  />
                </div>
              </Modal>
            </>
          )}
        </div>

        <div className="h-40"></div>
      </div>

      <Footer />
    </main>
  );
}
