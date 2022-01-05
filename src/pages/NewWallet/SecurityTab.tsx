import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NewWalletPDFData } from "../../types";
import { Button, Checkbox } from "../../components";
import createPdf from "./createPDF";
import routes from "../../router/routes";

interface Props {
  pdfData: NewWalletPDFData;
  walletId: string;
}

const SecurityTab: React.FC<Props> = ({ pdfData, walletId }) => {
  const [condition1, setCondition1] = useState(false);
  const [condition2, setCondition2] = useState(false);
  const canProceed = condition1 && condition2;
  return <div id="security-tab-content">
    <div className="flex justify-between items-center border-solid border border-gray-200 p-5 mb-6 rounded">
      <span className="uppercase text-secondary">Keycard</span>
      <Button
        name="download-pdf"
        type="button"
        onClick={(): void => { createPdf(pdfData); }}
      >
        Download PDF
      </Button>
    </div>
    <div className="form-field">
      <Checkbox name="condition-1" checked={condition1} onChange={(e: React.ChangeEvent<HTMLInputElement>):void => setCondition1(e.target.checked)}>
        I have printed my keycard and stored it in a safe location.
      </Checkbox>
    </div>
    <div className="form-field">
      <Checkbox name="condition-2" checked={condition2} onChange={(e: React.ChangeEvent<HTMLInputElement>):void => setCondition2(e.target.checked)}>
        I have deleted my keycard from my computer.
      </Checkbox>
    </div>
    <div className="flex justify-end mt-8">
      {
        canProceed ? (
          <Link to={`${routes.newWallet}/${walletId}`}>
            <Button name="submit-btn" type="button">Finish</Button>
          </Link>
        ) : (
          <Button name="submit-btn" type="button" disabled>Finish</Button>
        )
      }
    </div>
  </div>
}

export default SecurityTab;
