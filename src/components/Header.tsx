import { Button, Text } from "@/components/ui";
import { SbAuth, UserBadge } from "@/components";
import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { AddNewMod } from "./AddNewMod";
import Link from "next/link";

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoading } = useUser();

  return (
    <div className="sticky">
      <div className=" flex flex-row p-4 h-32 z-40">
        <div className="w-full flex items-center justify-between">
          <div className="flex-grow">
            <Link
              className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              href="/">
              <Text
                fontSize="4xl"
                scale
                fontType="heading"
                tag="h1"
                variant="primary">
                Slice &amp; Dice TextMod DB
              </Text>
            </Link>
          </div>
          {!isLoading && (
            <div className="flex justify-end content-center flex-shrink">
              {user ? (
                (() => {
                  return (
                    <div className="ml-2 flex flex-row gap-4">
                      <AddNewMod />
                      <UserBadge />
                    </div>
                  );
                })()
              ) : (
                <Button
                  variant="primary"
                  label="Login"
                  size="large"
                  className="mr-4"
                  onClick={() => {
                    setShowAuth(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <SbAuth
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
        }}
      />
    </div>
  );
};

export default Header;
