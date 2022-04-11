import React, { useEffect, useState } from "react";
import { createQRCodeImage } from "../../../utils";
import { generatePath, useNavigate } from "react-router-dom";
import { CopyArea, Pagination, enterPasswordModal } from "../../../modules/index";
import { Button, Label, Tooltip } from "../../../components";
import { CreateSubaddressThunkPayload, Subaddress, Wallet, FetchSubaddressesThunkPayload, FetchSubaddressResponse, UseThunkActionCreator, LocalWalletData, PublicWallet } from "../../../types";
import routes from "../../../router/routes";
import { SubaddressItem } from "./SubaddressItem";
import { ValidateButton } from "./ValidateButton";
import { WalletPageTemplate } from "../WalletPageTemplate";


interface Props {
  walletId: string;
  wallet: Wallet | PublicWallet;
  listLoading: boolean;
  subaddressCreating: boolean;
  subaddresses: Subaddress[];
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  viewOnly: boolean;
  fetchSubaddresses: (payload: FetchSubaddressesThunkPayload) => Promise<FetchSubaddressResponse>;
  createSubaddress?: (payload: CreateSubaddressThunkPayload) => Promise<Subaddress>;
  openWallet?: ({ wallet, loginPassword }: { wallet: Wallet, loginPassword: string }) => UseThunkActionCreator<LocalWalletData>;
  validateSubAddress?: (payload: { walletId: string; address: string, index: number, loginPassword: string }) => void;
  walletSubAddress: Subaddress | null;
  isPublicWallet?: boolean;
}

const ReceivePayment: React.FC<Props> = ({
  wallet,
  walletId,
  listLoading,
  subaddressCreating,
  subaddresses,
  pages,
  hasPreviousPage,
  hasNextPage,
  viewOnly,
  createSubaddress,
  fetchSubaddresses,
  openWallet,
  validateSubAddress,
  walletSubAddress,
  isPublicWallet,
}) => {
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  useEffect(() => {
    if (walletSubAddress) {
      createQRCodeImage(walletSubAddress?.address, { errorCorrectionLevel: "H", width: 265 })
        .then((b64String) => {
          setImage(b64String);
        }, () => { setImage(""); });
    }
  }, [walletSubAddress])
  useEffect(() => {
    fetchSubaddresses({ walletId, page });
  }, [page]);
  async function validateAddress(subaddress: Subaddress): Promise<void> {
    if (typeof openWallet === "function" && typeof validateSubAddress === "function") {
      await enterPasswordModal({
        callback: async (password: string) => {
          //@ts-ignore
          await openWallet({ wallet, loginPassword: password });
          await validateSubAddress({ walletId, address: subaddress.address, index: subaddress.index, loginPassword: password });
        }
      })
    }
  }
  return (
    <WalletPageTemplate
      title="Receive"
      goBackCallback={(): void => { navigate(`${generatePath(isPublicWallet ? routes.publicWallet : routes.wallet, { id: walletId })}/transactions`); }}
      id={walletId}
      wallet={wallet}
      isPublicWallet={isPublicWallet}
    >
      <div>
        <div className="mb-8 items-start md:flex">
          <div className="flex justify-center mb-6 order-2" data-qa-selector="address-qr-code">
            {
              image && <img src={image} alt={walletSubAddress?.address} />
            }
          </div>
          <div className="min-w-0 order-1 w-full md:mr-6">
            <Label label={
              <div className="flex items-center" data-qa-selector="validate-current-address">
                <span className="mr-3">Current address</span>
                {
                  walletSubAddress && (
                    <ValidateButton
                      subaddress={walletSubAddress}
                      validateAddress={validateAddress}
                    />
                  )
                }
              </div>
            }>
              <CopyArea value={walletSubAddress?.address || ""} qaSelector="receive-address">
                {walletSubAddress?.address} {walletSubAddress?.isUsed ? <span className="theme-text-secondary font-bold"> (Used)</span> : ""}
              </CopyArea>
            </Label>
            {viewOnly || isPublicWallet ? (
              <Tooltip className="w-full" content={(
                <div className="md:w-48">This functionality is not available in read-only wallets.</div>
              )}>
                <Button
                  className="mt-6"
                  name="create-new-address-btn"
                  disabled
                  block
                >
                  Generate New Address
                </Button>
              </Tooltip>
            ) : (
              <Button
                className="mt-6"
                name="create-new-address-btn"
                onClick={(): void => {
                  if (typeof createSubaddress === "function") {
                    createSubaddress({ walletId })
                      .then(() => {
                        fetchSubaddresses({ walletId, page });
                      })
                  }
                }}
                disabled={subaddressCreating}
                loading={subaddressCreating}
                block
              >
                Generate New Address
              </Button>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-catamaran uppercase text-2xl font-bold mb-8">Previous addresses</h2>
          <ul>
            {
              subaddresses.map((subaddress) => (
                <li key={subaddress.address} className="mb-3">
                  <SubaddressItem subaddress={subaddress} validateAddress={validateAddress} />
                </li>
              ))
            }
          </ul>
          {
            pages > 1 && (
              <Pagination
                loading={listLoading}
                page={page}
                pageCount={pages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onChange={setPage}
              />
            )
          }
        </div>
      </div>
    </WalletPageTemplate>
  )
}

export default ReceivePayment;
