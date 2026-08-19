import { Tag } from "@/utils/tags";

const tagColour = (tag: Tag) => {
  switch (tag) {
    case "Items":
      return "border-2 border-blue-700 bg-blue-300 text-blue-900 hover:bg-blue-100";
    case "Heroes":
      return "border-2 border-green-700 bg-green-300 text-green-900 hover:bg-green-100";
    case "Monsters":
      return "border-2 border-yellow-700 bg-yellow-300 text-yellow-900 hover:bg-yellow-100";
    case "Total Conversion":
      return "border-2 border-purple-700 bg-purple-300 text-purple-800 hover:bg-purple-100";
    case "Story":
      return "border-2 border-pink-700 bg-pink-300 text-pink-900 hover:bg-pink-100";
    case "Bosses":
      return "border-2 border-red-700 bg-red-300 text-red-900 hover:bg-red-100";
    case "WIP":
      return "border-2 border-gray-700 bg-gray-300 text-gray-900 hover:bg-gray-100";
    case "Tool":
      return "border-2 border-teal-700 bg-teal-300 text-teal-900 hover:bg-teal-100";
    case "Sandbox":
      return "border-2 border-orange-700 bg-orange-300 text-orange-900 hover:bg-orange-100";
    case "Mode":
      return "border-2 border-indigo-700 bg-indigo-300 text-indigo-900 hover:bg-indigo-100";
    case "Spells":
      return "border-2 border-lime-700 bg-lime-300 text-lime-900 hover:bg-lime-100";
  }
};

type TagChipProps = {
  tag: Tag;
  selected?: boolean;
  onClick?: (tag: Tag) => void;
};

export const TagChip = ({ tag, selected, onClick }: TagChipProps) => (
  <div
    className={`flex items-center justify-center ${tagColour(tag)} rounded-full px-2 py-1 cursor-pointer ${
      selected ? "border-4 border-dotted !bg-white" : ""
    } transition-all duration-200 ease-in-out`}
    onClick={() => onClick && onClick(tag)}>
    <span className={`text-sm ${selected ? "font-bold" : "font-semibold"}`}>
      {tag}
    </span>
  </div>
);
