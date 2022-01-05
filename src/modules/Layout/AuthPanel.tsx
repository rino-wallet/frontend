import React from "react";
import { Panel } from "../../components";


interface Props {
  children: React.ReactChild;
  title: string;
}

export const AuthPanel: React.FC<Props> = ({ children, title }) => {
  return (
    <Panel className="mt-6 md:mt-12">
      <h1 className="text-center text-4xl mb-12 font-catamaran">{title}</h1>
      {children}
    </Panel>
  );
};
