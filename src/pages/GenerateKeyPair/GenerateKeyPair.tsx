import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { SetUpKeyPairPayload, SetUpKeyPairResponse, User } from "../../types";
import { Spinner, Check } from "../../components";
import routes from "../../router/routes";
import { generateUserKeyPairInfo, verifyPassword } from "../../utils";
import { Button } from "../../components";
import createPdf from "./createPDF";

interface Props {
  setupKeyPair: (payload: SetUpKeyPairPayload) => Promise<SetUpKeyPairResponse>;
  user: User;
  password: string;
}

interface KeypairData {
  privateKeyEK: string;
  privateKeyRK: string;
  publicKey: string;
  signature: string;
  recoveryKey: string;
}

async function createKeyPair(email: string, password: string): Promise<KeypairData> {
  const derivedKeys = await verifyPassword(password, email);
  const {
    recoveryKey,
    publicKey,
    privateKeyEK,
    privateKeyRK,
    signature,
  } = await generateUserKeyPairInfo(email, password, derivedKeys);
  return {
    privateKeyEK,
    privateKeyRK,
    publicKey,
    signature,
    recoveryKey,
  }
}

const RenderSuccess: React.FC<{ recoveryKey: string }> = ({ recoveryKey }) => {
  const { push } = useHistory();
  return (
    <section>
      <header className="mb-5">
        <h1 className="text-xl">Success!</h1>
      </header>
      <div className="mb-10">
        <p className="mb-4">Save your recovery key:</p>
        <p id="recovery-key">{recoveryKey}</p>
      </div>
      <div className="flex justify-center mb-8">
        <Check size={85} />
      </div>
      <div className="flex justify-end">
        <Link to={routes.wallets}>
          <Button onClick={(): void => { push(routes.wallets); }}>Continue</Button>
        </Link>
      </div>
    </section>
  )
}

const RenderPending: React.FC = () => {
  return (
    <section>
      <header className="mb-5">
        <h1 className="text-xl">Hold on!</h1>
      </header>
      <div className="mb-10">
        <p className="mb-4">We are creating a key pair for your new wallet. It only takes a few seconds.</p>
        <p>Please do not close the browser window now, or we would need to start over the next time you log in.</p>
      </div>
      <div className="flex justify-center mb-8">
        <Spinner size={85} />
      </div>
    </section>
  )
}

const GenerateKeyPairPage: React.FC<Props> = ({ setupKeyPair, user, password }) => {
  const { push } = useHistory();
  const [recoveryKey, setRecoveryKey] = useState("");
  const keysSet = user && user.isKeypairSet;
  async function submitData(data: KeypairData): Promise<void> {
    try {
      await setupKeyPair({
        enc_private_key: data.privateKeyEK,
        enc_private_key_backup: data.privateKeyRK,
        public_key: data.publicKey,
        signature: data.signature,
      });
    } catch(err) {
      console.log(err);
    }
  }
  async function generateKeypairAndSubmit(): Promise<void> {
    const keypairData = await createKeyPair(user?.email, password);
    setRecoveryKey(keypairData.recoveryKey);
    await submitData(keypairData);
    createPdf({ recoveryKey: keypairData.recoveryKey, email: user?.email })
  }
  useEffect(() => {
    if (!password) {
      push(routes.wallets);
    }
    if (!keysSet) {
      generateKeypairAndSubmit();
    }
  }, [user, password]);
  return keysSet ? <RenderSuccess recoveryKey={recoveryKey} /> : <RenderPending />;
};

export default GenerateKeyPairPage;
