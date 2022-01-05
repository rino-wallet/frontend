import React from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { Button, Check } from "../../components";
import routes from "../../router/routes";
import { PageTemplate } from "../../modules/index";


const WalletCreated: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <PageTemplate title="Wallet Created">
      <div className="p-5">
        <div className="text-xl mb-3">Success!</div>
        <div className="flex justify-center my-16">
          <Check size={85} />
        </div>
        <Link className="flex justify-end" to={`${generatePath(routes.wallet, { id })}/transactions`}>
          <Button
            name="submit-btn"
            type="button"
          >
            Start Using
          </Button>
        </Link>
      </div>
    </PageTemplate>
  )
}

export default WalletCreated;
