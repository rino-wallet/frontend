import React, { ReactChild, useEffect } from "react";
import { BindHotKeys, Panel } from "../../components";
import { useRef } from "react";
import classNames from "classnames";

interface Props {
  title: ReactChild | string;
  onClose?: (value?: any) => void;
  className?: string;
}

const Modal: React.FC<Props> & { Actions: typeof Actions; Body: typeof Body  } = ({ children, title, onClose, className= "" }) => {
  const ref = useRef<HTMLDivElement>(null)
  const refOverlay = useRef<HTMLDivElement>(null)
  const handleClose = onClose || ((): void => undefined);
  useEffect(() => {
    const checkIfClickedOutside = (e: any): void => {
      if (ref.current && !ref.current.contains(e.target) && e.target === refOverlay.current) {
        handleClose()
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return (): void => {
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, []);
  return (
    <BindHotKeys callback={(): void => undefined} rejectCallback={handleClose}>
      <div ref={refOverlay} className={classNames("fixed w-full h-full theme-bg-overlay inset-0 z-10 flex items-center", className)} >
        <div ref={ref} className="container mx-auto p-5 mt:p-0 md:max-w-lg md:rounded-3xl">
          <Panel title={title}>
            {children}
          </Panel>
        </div>
      </div>
    </BindHotKeys>
  )
}


export const Actions: React.FC = ({ children }) => {
  return (
    <Panel.Actions>
      {children}
    </Panel.Actions>
  )
}

export const Body: React.FC = ({ children }) => {
  return (
    <Panel.Body>
      {children}
    </Panel.Body>
  )
}

Modal.Actions = Actions;
Modal.Body = Body;

export { Modal };