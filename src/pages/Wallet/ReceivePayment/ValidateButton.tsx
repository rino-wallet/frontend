import React, {useState} from "react";
import { Button } from "../../../components";
import { Subaddress } from "../../../types";

interface Props {
  subaddress: Subaddress;
  validateAddress: (address: string, index: number) => Promise<void>;
}

export const ValidateButton: React.FC<Props> = ({ subaddress, validateAddress }) => {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Button
      
      onMouseEnter={(): void => { setHover(true); }}
      onMouseLeave={(): void => { setHover(false); }}
      size={Button.size.SMALL}
      variant={subaddress.isValid ? Button.variant.GREEN : Button.variant.GRAY}
      loading={loading}
      onClick={(): void => {
        setLoading(true);
        validateAddress(subaddress.address, subaddress.index)
          .finally(() => {
            setTimeout(() => { setLoading(false); }, 300);
          });
      }}
      className="whitespace-nowrap"
    >
      {subaddress.isValid ? (hover ? "Re-validate" : "Validated") : "Validate"}
    </Button>
  )
}