import { Text, TagChip } from "@/components/ui";
import { getModText } from "@/utils/modText";
import { Tag } from "@/utils/tags";
import Link from "next/link";
import { useRouter } from "next/router";
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
  lastModified?: Date | null;
  tags?: Tag[];
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
  lastModified,
  tags,
}: TextmodCardProps) => {
  const router = useRouter();
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
                  getModText(id).then((data) => {
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
          {tags && tags.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap mt-1">
              {tags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onClick={() => router.push(`/search?tags=${tag}`)}
                />
              ))}
            </div>
          )}
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
            {lastModified && lastModified.getTime() !== createdDate.getTime()
              ? `Modified ${lastModified.toDateString()}`
              : createdDate.toDateString()}
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
