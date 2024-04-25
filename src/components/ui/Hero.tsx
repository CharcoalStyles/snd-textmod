import React from "react";
import { Text } from "@/components/ui/Text";

type HeroProps = {
  title: string;
  subtitle: string;
  image: string;
};

export const Hero: React.FC<HeroProps> = ({ title, subtitle, image }) => {
  return (
    <div className="bg-gradient-to-r from-slate-950 to-slate-800 ">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Text fontSize="4xl" fontType="heading" variant="accent">
            {title}
          </Text>
          <Text fontSize="2xl" fontType="body">
            {subtitle}
          </Text>
        </div>
        {/* <div className="mt-10">
          <img className="mx-auto h-40 sm:h-56 md:h-64 lg:h-80" src={image} alt="Hero" />
        </div> */}
      </div>
    </div>
  );
}; 
