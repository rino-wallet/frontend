import React from "react";
import classNames from "classnames";
import LogoSmall from "./logo_small.svg";
import LogoBig from "./logo_big.svg";
import LogoBigWhite from "./logo_big_white.svg";
import LogoBigStagenet from "./logo_big_stagenet.svg";
import LogoBigWhiteStagenet from "./logo_big_white_stagenet.svg";
import LogoBigEnterprise from "./logo_big_enterprise.svg";
import LogoBigStagenetEnterprise from "./logo_big_stagenet_enterprise.svg";
import { getNetworkType } from "../../utils";
import { useAccountType } from "../../hooks";

type Props = {
  className?: string;
  small?: boolean;
  white?: boolean;
};

export const Logo: React.FC<Props> = ({ className, small, white }) => {
  const stagenet = getNetworkType() === "stagenet";
  const { isEnterprise } = useAccountType();
  return (
    <div className={classNames("inline-flex w-12 h-12", className, { "w-12 h-12": small, "w-32": !small })}>
      {
        (small && white) && <img src={LogoSmall} alt="logo" />
      }
      {
        (small && !white) && <img src={LogoSmall} alt="logo" />
      }
      {
        (!small && !white && !stagenet && !isEnterprise) && <img src={LogoBig} alt="logo" />
      }
      {
        (!small && white && !stagenet) && <img src={LogoBigWhite} alt="logo" />
      }
      {
        (!small && !white && stagenet && !isEnterprise) && <img src={LogoBigStagenet} alt="logo" />
      }
      {
        (!small && white && stagenet) && <img src={LogoBigWhiteStagenet} alt="logo" />
      }
      {/* enterprise logos */}
      {
        (!small && !white && !stagenet && isEnterprise) && <img src={LogoBigEnterprise} alt="logo" data-qa-selector="enterprise-logo" />
      }
      {
        (!small && !white && stagenet && isEnterprise) && <img src={LogoBigStagenetEnterprise} alt="logo" data-qa-selector="enterprise-logo" />
      }
    </div>
  );
};
