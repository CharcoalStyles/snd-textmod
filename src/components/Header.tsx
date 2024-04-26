import { Button } from "@/components/ui";
import { SbAuth, UserBadge } from "@/components";
import React, { PropsWithChildren, useState } from "react";
import { useUser } from "@/hooks/useUser";

export const Header = ({ children }: PropsWithChildren) => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoading } = useUser();

  return (
    <>
      <div className="flex flex-row p-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex-grow">
          {children}
          </div>
          {isLoading ? (
            <div data-testid="loading-fragment"></div>
          ) : (
            <div
              data-testid="auth-userbadge"
              className="flex justify-end content-center flex-shrink"
            >
              {user ? (
                (() => {
                  return <UserBadge />;
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
    </>
  );
};

export default Header;
