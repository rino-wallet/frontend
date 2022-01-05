import React, { ReactChild } from "react";
import { PageTemplate } from "../../modules/index";

interface Props {
  children: ReactChild;
  title: ReactChild | string;
  goBackCallback?: () => void;
}

export const Modal: React.FC<Props> = ({ children, title, goBackCallback }) => {
  return (
    <div className="fixed w-full h-full bg-white inset-0 z-10 flex text-sm">
      <div className="container md:max-w-lg mx-auto p-8">
        <PageTemplate goBackCallback={goBackCallback} title={title}>
          {children}
        </PageTemplate>
      </div>
    </div>
  )
}
