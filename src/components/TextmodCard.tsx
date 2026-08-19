import { Text, TagChip } from "@/components/ui";
import { getModText } from "@/utils/modText";
import { Tag } from "@/utils/tags";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Calendar,
  MessageCircle,
  Clock,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { dateFormatter } from "@/utils/date";

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

const daysAgo = (date: Date) => {
  const days = Math.round((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
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
  const isModified =
    lastModified && lastModified.getTime() !== createdDate.getTime();

  return (
    <div className="w-full flex flex-col border border-secondary">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex flex-row justify-between items-start">
          <div>
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
            <div>
              <div className="flex flex-row gap-1 ">
                {" "}
                <Text tag="p" fontSize="base" fontType="body">
                  By:
                </Text>
                <Link href={`/user/${creator.slug}`}>
                  <Text
                    tag="span"
                    fontSize="base"
                    fontType="body"
                    showHoverable
                    onHover>
                    {creator.name}
                  </Text>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-center gap-1 text-green-500">
              <ArrowBigUp className="w-5 h-5 shrink-0" />
              <Text fontSize="xl" variant="success" fontType="heading">
                {upvotes}
              </Text>
            </div>
            <div className="flex flex-row items-center gap-1 text-red-500">
              <ArrowBigDown className="w-5 h-5 shrink-0" />
              <Text fontSize="xl" variant="danger" fontType="heading">
                {downvotes}
              </Text>
            </div>
          </div>
        </div>
        <div className="break-words">
          <Text fontSize="xl" fontType="body">
            {description}
          </Text>
        </div>
        <div className="flex flex-row justify-between items-center flex-wrap gap-2">
          <div className="flex flex-row gap-2 flex-wrap">
            {tags?.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                onClick={() => router.push(`/search?tags=${tag}`)}
              />
            ))}
          </div>

          <Text
            fontSize="base"
            fontType="body"
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
      <div className="flex flex-row justify-between items-center p-2 border-t border-secondary">
        <div className="flex flex-row gap-3">
          <div className="flex flex-row items-center gap-1 text-text">
            <Calendar className="w-5 h-5 shrink-0" />
            <Text tag="span" fontSize="base" fontType="body">
              {dateFormatter.format(createdDate)}
            </Text>
          </div>
          <div className="flex flex-row items-center gap-1 text-text">
            <MessageCircle className="w-5 h-5 shrink-0" />
            <Text tag="span" fontSize="base" fontType="body">
              {commentCount}
            </Text>
          </div>
        </div>
        {isModified && (
          <div className="flex flex-row items-center gap-1 text-text">
            <Clock className="w-5 h-5 shrink-0" />
            <Text tag="span" fontSize="base" fontType="body">
              Modified {daysAgo(lastModified as Date)}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
