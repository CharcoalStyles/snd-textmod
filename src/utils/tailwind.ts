
export type Variants = "basic" | "primary" | "secondary" | "accent" | "success" | "danger" | "white" | "black";

export const getTextColor = (color: Variants) => {
  switch (color) {
    case "primary":
      return "text-primary";
    case "secondary":
      return "text-secondary";
    case "accent":
      return "text-accent";
    case "success":
      return "text-success";
    case "danger":
      return "text-danger";
    case "white":
      return "text-white";
    case "black":
      return "text-black";
    case "basic":
    default:
      return "text-text";
  }
}