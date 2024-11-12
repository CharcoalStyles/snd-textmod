import { Text } from "@/components/ui";
import Link from "next/link";

export const Footer = () => (
  <footer className="fixed w-screen h-min-6 px-8 bg-secondary z-50 bottom-0 flex flex-row gap-2 justify-center">
    <Link href="https://www.charcoalstyles.com">
      <Text variant="black" onHover showHoverable>
        charcoalstyles.com
      </Text>
    </Link>
    |
    <Link href="https://ko-fi.com/charcoalstyles">
      <Text variant="black" onHover showHoverable>
        Ko-Fi
      </Text>
    </Link>
    |
    <Link href="https://formbricks.charcoalstyles.com/s/cm3e2fg9g000c8n9e1omsasnv">
      <Text variant="black" onHover showHoverable>
        Feedback
      </Text>
    </Link>
    |
    <Link href="https://github.com/CharcoalStyles/snd-textmod">
      <Text variant="black" onHover showHoverable>
        GitHub
      </Text>
    </Link>
  </footer>
);
