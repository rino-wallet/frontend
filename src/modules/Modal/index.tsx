import React, { ReactNode, useEffect, useRef } from "react";
import classNames from "classnames";
import { BindHotKeys, Panel, Icon } from "../../components";
import { UI_SIZE } from "../../components/Button";

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "md:max-w-2xl",
  [UI_SIZE.MEDIUM]: "md:max-w-xl",
  [UI_SIZE.SMALL]: "md:max-w-lg",
  [UI_SIZE.TINY]: "md:max-w-md",
};
interface Props {
  title: ReactNode | string;
  onClose?: (value?: any) => void;
  className?: string;
  showCloseIcon?: boolean;
  size?: UI_SIZE;
}

const Modal: React.FC<Props> & { Actions: typeof Actions; Body: typeof Body; size: typeof UI_SIZE; } = ({
  children, title, onClose, className = "", showCloseIcon, size = UI_SIZE.SMALL,
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
        <div ref={ref} className={classNames("container mx-auto p-5 mt:p-0 md:rounded-3xl", SIZE_MAPS[size])}>
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

Modal.size = UI_SIZE;

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
