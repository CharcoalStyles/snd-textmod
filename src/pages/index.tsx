import { Header } from "@/components";
import { TextmodList } from "@/components/TextmodList";
import { Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="h-screen pb-14 bg-right bg-cover w-screen">
      <Header>
        <a
          className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
          href="#"
        >
          <Text fontSize="5xl" fontType="heading" tag="h1" variant="primary">
            Slice &amp; Dice Textmod DB
          </Text>
        </a>
      </Header>
      <div className="mt-10">
        <TextmodList />
      </div>
    </main>
  );
}
