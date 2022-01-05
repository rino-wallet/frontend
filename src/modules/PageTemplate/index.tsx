import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components"

interface Props {
  title: ReactNode;
  backButtonRoute?: string;
  goBackCallback?: () => void;
  children?: ReactNode;
}

export const PageTemplate: React.FC<Props> = ({ title, backButtonRoute, children, goBackCallback }) => {
  return (
    <section>
      <header className="flex items-center space-x-3 mb-8 w-full">
        {
          backButtonRoute && (
            <Link to={backButtonRoute}>
              <Button
                name="back-button"
                onClick={(): void => {
                  if (typeof goBackCallback === "function") {
                    goBackCallback();
                  }
                }}
                rounded
              >
                <div className="w-5 h-5 leading-5 text-2xl">&#x3c;</div>
              </Button>
            </Link>
          )
        }
        {
          (typeof goBackCallback === "function") && (
            <Button
              onClick={goBackCallback}
              rounded
            >
              <div className="w-5 h-5 leading-5 text-2xl">&#x3c;</div>
            </Button>
          )
        }
        <h1 className="text-2xl flex-1">{title}</h1>
      </header>
      {children}
    </section>
  )
}