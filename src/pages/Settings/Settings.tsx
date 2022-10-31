import React, { useState } from "react";
import { User, UpdateUserPayload, UserResponse } from "../../types";
import { Button, Icon, Switch } from "../../components";
import { enable2FA, disable2FA, info2FA } from "../../modules/2FAModals";
import { PageTemplate, showSuccessModal } from "../../modules/index";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

interface Props {
  user: User;
  pendingUpdateUser: boolean;
  updateUser: (payload: UpdateUserPayload) => Promise<UserResponse>
  signOutAll: () => Promise<void>
}

function hideEmail(email: string): string {
  const indx = email.indexOf("@");
  const part1 = email.slice(0, indx);
  return email.replace(part1, part1.split("").reduce((a) => `${a}*`, ""));
}

const SettingsPage: React.FC<Props> = ({
  user,
  updateUser,
  signOutAll,
  pendingUpdateUser,
}) => {
  const [showEmail, setShowEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  function onClickEnable2FA(): void {
    enable2FA()
      .then(() => {
        info2FA();
        // eslint-disable-next-line
      }, (err: any) => { console.log(err); });
  }
  return (
    <PageTemplate title="Settings">
      {showEmailModal && <ChangeEmail goBackCallback={(): void => { setShowEmailModal(false); }} />}
      {showPasswordModal && <ChangePassword goBackCallback={(): void => { setShowPasswordModal(false); }} />}
      <section className="py-8">
        <h2 className="text-3xl text-base font-bold mb-6 flex items-center">
          Account
        </h2>
        <div className="">
          <div>
            <div className="mb-5">
              <div className="flex items-center break-all">
                USERNAME:
                {" "}
                {user.username}
              </div>
            </div>
            <div className="mb-5">
              EMAIL:
              {" "}
              <div className="inline-flex items-center break-all">
                {
                  showEmail ? (
                    <div>
                      {user.email}
                      {" "}
                      <div data-qa-selector="show-email-btn" className="inline-flex">
                        <Button size={Button.size.SMALL} onClick={(): void => setShowEmail(false)}>Hide</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {hideEmail(user.email)}
                      {" "}
                      <div data-qa-selector="show-email-btn" className="inline-flex">
                        <Button size={Button.size.SMALL} onClick={(): void => setShowEmail(true)}>Reveal</Button>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div className="md:flex items-start justify-start">
            <div className="flex space-x-3">
              <Button
                name="change-email-btn"
                type="button"
                onClick={(): void => setShowEmailModal(true)}
                size={Button.size.MEDIUM}
              >
                Change email
              </Button>
              <Button
                name="change-password-btn"
                type="button"
                onClick={(): void => setShowPasswordModal(true)}
                size={Button.size.MEDIUM}
              >
                Change password
              </Button>
              <Button
                name="logout-all-btn"
                type="button"
                onClick={signOutAll}
                size={Button.size.MEDIUM}
              >
                Logout from all sessions
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8">
        <h2 className="text-base text-3xl font-bold mb-6 flex items-center">
          Two-factor Authentication
        </h2>
        <div className="mb-6">
          {
            user.is2FaEnabled
              ? (
                <div className="text-green-500">
                  <Icon name="security-on" />
                  {" "}
                  <span className="uppercase text-lg font-bold" data-qa-selector="two-fa-status">Enabled</span>
                </div>
              )
              : (
                <div className="text-red-500">
                  <Icon name="security-off" />
                  {" "}
                  <span className="uppercase text-lg font-bold" data-qa-selector="two-fa-status">Disabled</span>
                </div>
              )
          }
        </div>
        {
          user.is2FaEnabled ? (
            <Button
              type="button"
              variant={Button.variant.RED}
              onClick={(): void => {
                disable2FA()
                  .then(() => {
                    showSuccessModal({
                      title: "2FA Disabled",
                      // eslint-disable-next-line
                      message: (close: () => void) => (
                        <div>
                          <p className="mb-3">You have successfully disabled Two-factor Authentication.</p>
                          <p className="mb-3">But your account is now less secure :&#40;</p>
                          <button
                            className="theme-text-primary"
                            type="button"
                            name="set-up-2fa-again"
                            onClick={(): void => {
                              close();
                              setTimeout(onClickEnable2FA, 0);
                            }}
                          >
                            Set up 2FA again
                          </button>
                        </div>
                      ),
                    });
                  }, (err: any) => {
                    // eslint-disable-next-line
                    console.log(err);
                  });
              }}
              name="disable2FA"
              size={Button.size.MEDIUM}
            >
              Disable 2fa
            </Button>
          ) : (
            <Button
              name="enable2FA"
              type="button"
              variant={Button.variant.GREEN}
              onClick={onClickEnable2FA}
              size={Button.size.MEDIUM}
            >
              Enable 2fa
            </Button>
          )
        }
      </section>
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          Notifications
        </h2>
        <Switch
          disabled={pendingUpdateUser}
          checked={user.txNotifications}
          id="tx-notifications"
          onChange={(e): void => { updateUser({ tx_notifications: e.target.checked }); }}
        >
          <span className="text-base">Email notifications for incoming transactions</span>
        </Switch>
      </section>
    </PageTemplate>
  );
};

export default SettingsPage;
