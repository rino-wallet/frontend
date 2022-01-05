import React from "react";
import { Spinner } from "../../components";

interface Props {
  stage: string;
}

const CreatingWallet: React.FC<Props> = ({ stage }) => {
  return (
    <div id="creating-wallet" className="fixed w-full h-full bg-white inset-0 z-10 flex justify-center items-center">
      <div className="w-screen max-w-sm m-auto p-5">
        <div className="text-xl mb-3">Creating your wallet...</div>
        <div className="text-base mb-3">Hold on, please. This process can take up to about a minute.</div>
        <div id="creating-wallet-step">{stage}</div>
        <div className="flex justify-center my-16">
          <Spinner size={85} />
        </div>
      </div>
    </div>
  )
}

export default CreatingWallet;
