import { Text } from "@/components/ui";
import Link from "next/link";

export const Footer = () => (
  <footer className="fixed w-screen h-min-6 px-4 bg-secondary z-50 bottom-0 flex flex-row gap-1 md:gap-2 justify-center">
    <Link
      href="https://www.charcoalstyles.com"
      data-umami-event="charcoalstyles">
      <Text variant="black" onHover showHoverable>
        Charcoal
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
      href="https://discordapp.com/users/375455152133636099"
      data-umami-event="feedback">
      <Text variant="black" onHover showHoverable>
        Feedback(Discord)
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
      v2.0(r)
    </Text>
  </footer>
);
