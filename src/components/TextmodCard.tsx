import { Text } from "@/components/ui";
import { getModTextmod } from "@/utils/supabase";
import Link from "next/link";
import { useState } from "react";

export type TextmodCardProps = {
  id: number;
  name: string;
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
  commentCount,
  creator,
  downvotes,
  upvotes,
  createdDate,
}: TextmodCardProps) => {
  const [copyText, setCopyText] = useState("Copy");

  return (
    <div className="w-full flex flex-col border border-secondary">
      <div className="flex flex-col p-2">
        <div>
          <div className="flex flex-row">
            <div className="flex-grow">
              <Link href={`/textmod/${id}`}>
                <Text
                  onHover
                  showHoverable
                  fontSize="2xl"
                  fontType="heading"
                  variant="accent">
                  {name}
                </Text>
              </Link>
            </div>
            <div>
              <Text
                onHover
                showHoverable
                onClick={() => {
                  setCopyText("Loading!");
                  getModTextmod(id).then((data) => {
                    if (data) {
                      navigator.clipboard.writeText(data);
                      setCopyText("Copied!");
                    } else {
                      setCopyText("Error");
                    }
                    setTimeout(() => {
                      setCopyText("Copy");
                    }, 2000);
                  });
                }}>
                {copyText}
              </Text>
            </div>
          </div>
          <div className="break-words">
            <Text fontSize="xl" fontType="body">
              {description}
            </Text>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="flex flex-row justify-between">
          <Link href={`/user/${creator.slug}`}>
            <Text tag="span" fontType="body" showHoverable onHover>
              {creator.name}
            </Text>
          </Link>
          <Text tag="span" fontType="body">
            {createdDate.toDateString()}
          </Text>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between flex-row">
            <Link href={`/textmod/${id}`}>
              <Text fontSize="base" fontType="body" onHover showHoverable>
                Comments: {commentCount}
              </Text>
            </Link>
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
