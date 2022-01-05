import React, { useState } from "react";
import { User } from "../../types";
import { Button } from "../../components";
import { enable2FA, disable2FA, info2FA } from "../../modules/2FAModals";
import { PageTemplate, showSuccessModal } from "../../modules/index";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

interface Props {
  user: User;
}

function hideEmail(email: string): string {
  const indx = email.indexOf("@");
  const part1 = email.slice(0, indx);
  return email.replace(part1, part1.split("").reduce((a) => `${a}*`, ""));
}

const ProfilePage: React.FC<Props> = ({ user }) => {
  const [showEmail, setShowEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  function onClickEnable2FA(): void {
    enable2FA()
      .then(() => {
        info2FA()
      }, (err: any) => { console.log(err); });
  }
  return <PageTemplate title="Account Settings">
    { showEmailModal && <ChangeEmail goBackCallback={(): void => { setShowEmailModal(false); }} /> }
    { showPasswordModal && <ChangePassword goBackCallback={(): void => { setShowPasswordModal(false); }} /> }
    <div className="mb-5">
      <div className="text-base mb-1">
        <span className="mr-3">E-mail:</span>
      </div>
      <div className="flex items-center break-all">
        {
          showEmail ? (
            <div>
              {user.email}
              <button className="text-orange-500 ml-2" data-qa-selector="show-email-btn" onClick={(): void => setShowEmail(false)} >Hide</button>
            </div>
          ) : (
            <div>
              {hideEmail(user.email)}
              <button className="text-orange-500 ml-2 " data-qa-selector="show-email-btn" onClick={(): void => setShowEmail(true)}>Reveal</button>
            </div>
          )
        }
      </div>
    </div>
    <div className="flex space-x-3">
      <Button
        name = "change-email-btn"
        type="button"
        onClick={(): void => setShowEmailModal(true)}
        size={Button.size.MEDIUM}
        block
      >
        Change email
      </Button>
      <Button
        name = "change-password-btn"
        type="button"
        onClick={(): void => setShowPasswordModal(true)}
        size={Button.size.MEDIUM}
        block
      >
        Change password
      </Button>
    </div>
    <div className="border-b border-gray-200 my-5 -mx-5" />
    <p className="text-base mb-3 flex items-center">
      Two-factor Authentication
    </p>
    {
      user.is2FaEnabled ? (
        <>
          <div className="uppercase text-green-500 mb-4" data-qa-selector="two-fa-status">Enabled</div>
          <Button
            type="button"
            variant={Button.variant.RED}
            onClick={(): void => {
              disable2FA()
                .then(() => {
                  showSuccessModal({
                    title: "2FA Disabled",
                    message: (close: () => void) => (
                      <div>
                        <p className="mb-3">You have successfully disabled Two-factor Authentication.</p>
                        <p className="mb-3">But your account is now less secure :&#40;</p>
                        <button
                        className="text-primary"
                        type="button"
                        name = "set-up-2fa-again"
                        onClick={(): void => {
                          close();
                          setTimeout(onClickEnable2FA, 0);
                        }}
                      >
                        Set up 2FA again
                      </button>
                      </div>
                    )
                  })
                }, (err: any) => { console.log(err); });
            }}
            size={Button.size.MEDIUM}
            name = "disable2FA"
          >
            Disable 2fa
          </Button>
        </>
      ) : (
        <>
          <div className="uppercase text-red-500 mb-4" data-qa-selector="two-fa-status">Disabled</div>
          <Button
            name = "enable2FA"
            type="button"
            variant={Button.variant.GREEN}
            onClick={onClickEnable2FA}
            size={Button.size.MEDIUM}
          >
            Enable 2fa
          </Button>
        </>
      )
    }
    <div className="border-b border-gray-200 my-5 -mx-5" />
  </PageTemplate>
}

export default ProfilePage;
