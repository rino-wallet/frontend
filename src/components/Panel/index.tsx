import React, { ReactNode } from "react";

const PanelBody: React.FC = ({ children }) => (
  <div className="m-10 mt-8">
    {children}
  </div>
);

const PanelActions: React.FC = ({ children }) => (
  <div className="py-5 px-10 theme-bg-panel-second flex justify-end space-x-3 rounded-bl-medium rounded-br-medium">
    {children}
  </div>
);

type Props = {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
};

export const Panel: React.FC<Props> & { Body: typeof PanelBody; Actions: typeof PanelActions } = (props) => {
  const { children, className, title } = props;
  return (
    <div className={`theme-bg-panel border-solid border theme-border rounded-medium ${className}`}>
      { title && <h2 className="mx-10 my-4 text-2xl font-bold flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap">{title}</h2> }
      {children}
    </div>
  );
};

Panel.Body = PanelBody;
Panel.Actions = PanelActions;
