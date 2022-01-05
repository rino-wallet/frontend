import React, {ReactNode, useEffect, useLayoutEffect, useRef, useState} from "react";
import { ReactComponent as ArrowOpen } from "./arrow-open.svg";
import { ReactComponent as ArrowClose } from "./arrow-close.svg";

type Props = {
  collapsedDefault?: boolean;
  title?: ReactNode;
  className?: string;
}

export const Collapsible: React.FC<Props> = ({
  collapsedDefault = true,
  title = "",
  className = "",
  children,
}) => {
  const [collapsed, setCollapsed] = useState(collapsedDefault);
  const [style, setStyle] = useState({height: "0px", overflow: "hidden"});

  const targetRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const toggleCollapse = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setCollapsed(!collapsed);
  };
  useEffect(() => setCollapsed(collapsedDefault), [collapsedDefault])
  useLayoutEffect(() => {
    if (childRef.current) {
      if (!collapsed) {
        setStyle({
          overflow: "hidden",
          height: childRef.current?.getBoundingClientRect().height + "px",
        });
        setTimeout(() => {
          setStyle({
            overflow: "visible",
            height: childRef.current?.getBoundingClientRect().height + "px",
          });
        }, 300)
      } else {
        setStyle({
          overflow: "hidden",
          height: "0",
        });
      }
    }
  }, [collapsed]);
  return (
    <div className={className}>
      <button
        className="inline flex items-start text-sm"
        onClick={toggleCollapse}
      >
        <div className="w-6 flex justify-center mt-1 mr-4">
          {collapsed ? <ArrowClose /> : <ArrowOpen />}
        </div>
        {title}
      </button>
      <div
        ref={targetRef}
        style={style}
        className="transition-all duration-300 ease-in pl-10"
      >
        <div ref={childRef}>{children}</div>
      </div>
    </div>
  )
}
