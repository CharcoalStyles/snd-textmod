import { Text } from "@/components/ui";
import Link from "next/link";

export const Footer = () => (
  <footer className="fixed w-screen h-min-6 px-4 bg-secondary z-50 bottom-0 flex flex-row gap-2 justify-center">
    <Link
      href="https://www.charcoalstyles.com"
      data-umami-event="charcoalstyles">
      <Text variant="black" onHover showHoverable>
        Made by Charcoal
      </Text>
    </Link>
    |
    <Link href="https://ko-fi.com/charcoalstyles" data-umami-event="kofi">
      <Text variant="black" onHover showHoverable>
        Ko-Fi
      </Text>
    </Link>
    |
    <Link
      href="https://formbricks.charcoalstyles.com/s/cm3e2fg9g000c8n9e1omsasnv"
      data-umami-event="feedback">
      <Text variant="black" onHover showHoverable>
        Feedback
      </Text>
    </Link>
    |
    <Link
      href="https://github.com/CharcoalStyles/snd-textmod"
      data-umami-event="github">
      <Text variant="black" onHover showHoverable>
        GitHub
      </Text>
    </Link>
    |
    <Text variant="black" >
      v1.2 
    </Text>
  </footer>
);
