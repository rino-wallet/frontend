import React, {useState} from "react";
import { Button } from "../../../components";
import { Subaddress } from "../../../types";

interface Props {
  subaddress: Subaddress;
  validateAddress: (subaddress: Subaddress) => Promise<void>;
}

export const ValidateButton: React.FC<Props> = ({ subaddress, validateAddress }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size={Button.size.TINY}
      variant={subaddress.isValid ? Button.variant.GREEN : Button.variant.GRAY}
      loading={loading}
      onClick={(): void => {
        if (!subaddress.isValid) {
          setLoading(true);
          validateAddress(subaddress)
            .finally(() => {
              setTimeout(() => { setLoading(false); }, 300);
            });
        }
      }}
      className="whitespace-nowrap"
    >
      {subaddress.isValid ? "Validated" : "Validate"}
    </Button>
  )
}