import React from "react";
import { piconeroToMonero, getWalletColor } from "../../utils";
import { Placeholder } from "../../components";

const WalletPlaceholder: React.FC = () => (
  <div className="flex-1 min-w-0 text-left">
    <div>
      <Placeholder />
    </div>
    <div className="mt-3">
      <Placeholder />
    </div>
  </div>
)
interface Props {
  balance: string;
  name: string;
  unlocked?: string;
  showArrow?: boolean;
  id: string;
}

export const WalletCard: React.FC<Props> = ({
  balance,
  unlocked,
  name,
  showArrow,
  id,
}) => {
  const gradient = getWalletColor(id);
  return (
    <div className="bg-custom-pink-100 border border-custom-pink-200 rounded flex items-stretch h-20 cursor-pointer">
      <div className={`w-10 flex-shrink-0 ${gradient}`} />
      <div className="flex flex-1 min-w-0 p-4 items-center">
        {
          !name ? <WalletPlaceholder /> : (
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs uppercase text-secondary whitespace-nowrap overflow-hidden overflow-ellipsis h-4">{name}</div>
              <div className="text-xl uppercase h-7">
                {piconeroToMonero(balance)} XMR
              </div>
              {
                !!unlocked && (
                  <div className="text-xs uppercase text-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis h-4">
                    Unlocked: {unlocked} XMR
                  </div>
                )
              }
            </div>
          )
        }
        {
          showArrow && (
            <div className="w-6 text-4xl font-semibold text-red-300 opacity-40">
              &#x3e;
            </div>
          )
        }
      </div>
    </div>
  )
}