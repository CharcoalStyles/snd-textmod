import { Text } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TextmodCardProps = {
  id: number;
  name: string;
  mod: string;
  description: string;
  creator: {
    name: string;
    slug: string;
  };
  commentCount: number;
  upvotes: number;
  downvotes: number;
  createdDate: Date;
};

export const TextmodCard = ({
  id,
  description,
  name,
  mod,
  commentCount,
  creator,
  downvotes,
  upvotes,
  createdDate,
}: TextmodCardProps) => {
  const [copyText, setCopyText] = useState("Copy");
  const router = useRouter();

  return (
    <div className="w-full flex flex-col border border-secondary">
      <div className="flex flex-col p-2">
        <div>
          <div className="flex flex-row">
            <div className="flex-grow">
              <Text
                onHover
                showHoverable
                onClick={() => {
                  router.push(`/textmod/${id}`);
                }}
                fontSize="2xl"
                fontType="heading"
                variant="accent">
                {name}
              </Text>
            </div>
            <div>
              <Text
                onHover
                showHoverable
                onClick={() => {
                  navigator.clipboard.writeText(mod);
                  setCopyText("Copied!");
                  setTimeout(() => {
                    setCopyText("Copy");
                  }, 2000);
                }}>
                {copyText}
              </Text>
            </div>
          </div>
          <Text fontSize="xl" fontType="body">
            {description}
          </Text>
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="flex flex-row justify-between">
          <Text
            tag="span"
            fontType="body"
            showHoverable
            onHover
            onClick={() => {
              router.push(`/user/${creator.slug}`);
            }}>
            {creator.name}
          </Text>
          <Text tag="span" fontType="body">
            {createdDate.toDateString()}
          </Text>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between flex-row">
            <Text
              fontSize="base"
              fontType="body"
              onHover
              showHoverable
              onClick={() => {
                router.push(`/textmod/${id}`);
              }}>
              Comments: {commentCount}
            </Text>
            <div className="flex flex-row justify-between w-1/6">
              <Text fontSize="xl" variant="success" fontType="heading">
                ↑{upvotes}
              </Text>
              <Text fontSize="xl" variant="danger" fontType="heading">
                ↓{downvotes}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
