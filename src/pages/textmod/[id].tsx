/* eslint-disable @next/next/no-img-element */
import { Header, Loader } from "@/components";
import { Comments } from "@/components/Comments";
import { Footer } from "@/components/Footer";
import { ModModal } from "@/components/ModModal";
import { Button, Modal, Text, TagChip } from "@/components/ui";
import { useTextMod } from "@/hooks/useTextMod";
import { Database } from "@/utils/schema";
import { supabase } from "@/utils/supabase";
import { getModText } from "@/utils/modText";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarClock,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { dateFormatter } from "@/utils/date";

const findUserVote = (
  user: ReturnType<typeof useUser>,
  votes?: Array<Database["public"]["Tables"]["mod_votes"]["Row"]>,
) => {
  if (!user?.user || !votes) return undefined;

  return votes.find((v) => v.user_id === user.user.id);
};

const handleVoteClick = async (
  modId: number,
  isUpvote: boolean,
  refetch: () => void,
  vote?: Database["public"]["Tables"]["mod_votes"]["Row"],
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
  const id = router.query.id!
    ? Number.parseInt(router.query.id as string)
    : undefined;
  const { data, error, isLoading, refetch } = useTextMod(id);
  const [showTextMod, setShowTextMod] = useState(false);
  const [showSplitTextMod, setShowSplitTextMod] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const sbUser = useUser();
  const [modText, setModText] = useState<string>();
  const [copyText, setCopyText] = useState("Copy Full TextMod");

  useEffect(() => {
    if (!id) return;
    getModText(id).then((text) => {
      setModText(text ?? "");
    });
  }, [id]);

  // Slice & Dice's paste box has a size limit, so split large mods into
  // ≤50,000 character chunks on comma boundaries for separate copying.
  const splitModText = useMemo(() => {
    if (!modText) return [];
    const parts = modText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const chunks: string[] = [];
    let current = "";
    parts.forEach((part) => {
      if (current.length + part.length > 50_000) {
        chunks.push(current);
        current = part;
      } else {
        current += (current ? "," : "") + part;
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }, [modText]);

  const userVote = findUserVote(sbUser, data?.votes);
  const { user } = sbUser;

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
              <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col">
                  <p className="text-primary  text-2xl md:text-4xl font-heading leading-10 my-2 md:my-6">
                    {data.name}
                  </p>
                  <div className="-mt-3 md:-mt-5 flex flex-row gap-2">
                    <Text fontSize="3xl" scale>
                      By:
                    </Text>
                    <Link href={`/user/${data.creator.slug}`}>
                      <Text
                        fontSize="3xl"
                        scale
                        fontType="body"
                        showHoverable
                        onHover>
                        {data.creator.name}
                      </Text>
                    </Link>
                  </div>
                  <div className="flex flex-row gap-3 mt-1">
                    <div className="flex flex-row items-center gap-1 text-text">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <Text fontSize="base" fontType="body">
                        {dateFormatter.format(data.createdDate)}
                      </Text>
                    </div>
                    {data.lastModified && (
                      <div className="flex flex-row items-center gap-1 text-text">
                        <CalendarClock className="w-4 h-4 shrink-0" />
                        <Text fontSize="base" fontType="body">
                          {dateFormatter.format(data.lastModified)}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row items-end gap-3">
                  <div
                    className="flex flex-row items-center gap-1 text-green-500 hover:cursor-pointer"
                    onClick={() => {
                      sbUser !== null &&
                        id &&
                        handleVoteClick(id, true, refetch, userVote);
                    }}>
                    <ArrowBigUp className="w-5 h-5 md:w-8 md:h-8 shrink-0" />
                    <Text
                      fontSize="3xl"
                      scale
                      variant="success"
                      fontType="heading">
                      {data.votes.filter((v) => v.upvote).length}
                    </Text>
                  </div>
                  <div
                    className="flex flex-row items-center gap-1 text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      sbUser !== null &&
                        id &&
                        handleVoteClick(id, false, refetch, userVote);
                    }}>
                    <ArrowBigDown className="w-5 h-5 md:w-8 md:h-8 shrink-0" />
                    <Text
                      fontSize="3xl"
                      scale
                      variant="danger"
                      fontType="heading">
                      {data.votes.filter((v) => !v.upvote).length}
                    </Text>
                  </div>
                  {user && user.id === data.creator.id && (
                    <div className="flex flex-row gap-2 mt-1">
                      <Text
                        variant="accent"
                        fontSize="base"
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
                        fontSize="base"
                        showHoverable
                        onHover
                        onClick={() => {
                          supabase
                            .from("mods")
                            .delete()
                            .eq("id", data.id)
                            .then(({ error }) => {
                              if (error) {
                                console.error("Error deleting comment:", error);
                              } else {
                                router.push("/");
                              }
                            });
                        }}
                        fontType="body">
                        Delete
                      </Text>
                    </div>
                  )}
                </div>
              </div>
              {data.tags.length > 0 && (
                <div className="flex flex-row gap-2 flex-wrap mt-2">
                  {data.tags.map((tag) => (
                    <TagChip
                      key={tag}
                      tag={tag}
                      onClick={() => router.push(`/search?tags=${tag}`)}
                    />
                  ))}
                </div>
              )}
              <div className="my-2">
                <Text fontSize="xl" fontType="body">
                  {data.description}
                </Text>
              </div>

              {data.mainImage && (
                <div className="flex flex-row justify-center">
                  <img
                    src={data.mainImage}
                    alt="main image"
                    className="rounded-lg object-scale-down max-h-96 max-w-full"
                  />
                </div>
              )}

              <div className="w-full flex flex-col border-y-2 border-gray-400 p-4 mb-4">
                <div className="flex flex-row gap-8">
                  <Button
                    variant="accent"
                    label={copyText}
                    fullWidth
                    onClick={() => {
                      navigator.clipboard.writeText(modText || "");
                      setCopyText("Copied!");
                      setTimeout(() => {
                        setCopyText("Copy Full TextMod");
                      }, 2000);
                    }}
                  />
                  <Button
                    variant="secondary"
                    fullWidth
                    label={
                      showTextMod ? "Hide Full TextMod" : "Show Full TextMod"
                    }
                    onClick={() => {
                      setShowTextMod(!showTextMod);
                    }}
                  />
                  {splitModText.length > 1 && (
                    <Button
                      variant="basic"
                      fullWidth
                      label={
                        showSplitTextMod
                          ? "Hide Split TextMod Sections"
                          : "Show Split TextMod"
                      }
                      onClick={() => {
                        setShowSplitTextMod(!showSplitTextMod);
                      }}
                    />
                  )}
                </div>

                {showSplitTextMod && (
                  <div className="h-fit p-2 my-4 border-gray-600 overflow-auto w-full  border  scrollbar scrollbar-thumb-secondary transition-height">
                    <div className="flex flex-col gap-2">
                      {splitModText.map((part, i) => (
                        <Button
                          key={i}
                          fullWidth
                          variant="secondary"
                          label={`Part ${i + 1} (${part.length} characters)`}
                          onClick={() => {
                            navigator.clipboard.writeText(part);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                  mainImageUrl: data.mainImage ? data.mainImage : undefined,
                }}
                mod={modText}
                tags={data.tags}
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
                    {modText ? (
                      <Text fontType="body">{modText}</Text>
                    ) : (
                      <div className="w-full text-center">
                        <Loader size="2xl" color="secondary" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="accent"
                    label="Copy"
                    onClick={() => {
                      navigator.clipboard.writeText(modText || "");
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
