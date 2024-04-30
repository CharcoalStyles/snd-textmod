import { Text } from "@/components/ui";

export const Footer = () => (
  <footer className="fixed w-screen h-min-6 px-8 bg-secondary z-50 bottom-0 flex flex-row gap-2 justify-center">
    <Text
      variant="black"
      onHover
      showHoverable
      onClick={() => {
        window.open("https://www.charcoalstyles.com", "_blank");
      }}>
      charcoalstyles.com
    </Text>
    |
    <Text
      variant="black"
      onHover
      showHoverable
      onClick={() => {
        window.open("https://ko-fi.com/charcoalstyles", "_blank");
      }}>
      Ko-Fi
    </Text>
    |
    <Text
      variant="black"
      onHover
      showHoverable
      onClick={() => {
        window.open(
          "mailto:aaron@charcoalstyles.com?subject=SnD TextMod DB Feedback",
          "_blank"
        );
      }}>
      Feedback
    </Text>
  </footer>
);
