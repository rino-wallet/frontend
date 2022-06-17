import React from "react";
import { Spinner } from "../../components";

interface Props {
  stage: string;
}
const CreatingWallet: React.FC<Props> = ({ stage }) => (
  <div id="creating-wallet">
    <div className="flex items-center text-xl mb-3">
      <span className="mr-4">Creating your wallet...</span>
      {" "}
      <Spinner size={18} />
    </div>
    <div className="text-base mb-3">Hold on, please. This process can take up to about a minute.</div>
    <div id="creating-wallet-step">
      {stage}
      ...
    </div>
  </div>
);

export default CreatingWallet;
