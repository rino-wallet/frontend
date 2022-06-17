import React, { ReactChild, useEffect, useRef } from "react";
import classNames from "classnames";
import { BindHotKeys, Panel, Icon } from "../../components";

interface Props {
  title: ReactChild | string;
  onClose?: (value?: any) => void;
  className?: string;
  showCloseIcon?: boolean;
}

const Modal: React.FC<Props> & { Actions: typeof Actions; Body: typeof Body } = ({
  children, title, onClose, className = "", showCloseIcon,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const refOverlay = useRef<HTMLDivElement>(null);
  const handleClose = onClose || ((): void => undefined);
  useEffect(() => {
    const checkIfClickedOutside = (e: any): void => {
      if (ref.current && !ref.current.contains(e.target) && e.target === refOverlay.current) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return (): void => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);
  return (
    <BindHotKeys callback={(): void => undefined} rejectCallback={handleClose}>
      <div ref={refOverlay} className={classNames("fixed w-full h-full theme-bg-overlay inset-0 z-20 flex items-center", className)}>
        <div ref={ref} className="container mx-auto p-5 mt:p-0 md:max-w-lg md:rounded-3xl">
          <Panel className="relative" title={<div className="mt-3">{title}</div>}>
            {
              showCloseIcon && (
                <button type="button" className="text-gray-300 absolute top-5 right-5" name="close" onClick={onClose}>
                  <Icon name="cross" />
                </button>
              )
            }
            {children}
          </Panel>
        </div>
      </div>
    </BindHotKeys>
  );
};

export const Actions: React.FC = ({ children }) => (
  <Panel.Actions>
    {children}
  </Panel.Actions>
);

export const Body: React.FC = ({ children }) => (
  <Panel.Body>
    {children}
  </Panel.Body>
);

Modal.Actions = Actions;
Modal.Body = Body;

export { Modal };
