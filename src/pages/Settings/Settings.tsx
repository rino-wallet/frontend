import React, { useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, UpdateUserPayload, UserResponse } from "../../types";
import {
  Button, Icon, Panel, Switch,
} from "../../components";
import { enable2FA, disable2FA, info2FA } from "../../modules/2FAModals";
import { PageTemplate, showSuccessModal } from "../../modules/index";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import { ReactComponent as RewardsIcon } from "./rewardsIcon.svg";
import routes from "../../router/routes";
import { useAccountType } from "../../hooks";

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
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();
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
    <PageTemplate title={t("settings.title")}>
      {showEmailModal && <ChangeEmail goBackCallback={(): void => { setShowEmailModal(false); }} />}
      {showPasswordModal && <ChangePassword goBackCallback={(): void => { setShowPasswordModal(false); }} />}
      <div>
        {
          !isEnterprise && (
            <Link to={generatePath(routes.rewards, { type: "referrals" })}>
              <Panel className="mt-10">
                <div className="flex items-center py-6 px-8">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <RewardsIcon />
                  </div>
                  <div className="flex-1 pl-6">
                    <span className="text-4xl font-bold font-lato">{t("settings.start.rewards")}</span>
                  </div>
                  <div className="flex flex-col justify-center w-6 text-4xl font-semibold ">
                    &#x3e;
                  </div>
                </div>
              </Panel>
            </Link>
          )
        }
      </div>
      <section className="py-8">
        <h2 className="text-3xl text-base font-bold mb-6 flex items-center">
          Account
        </h2>
        <div className="">
          <div>
            <div className="mb-5">
              <div className="flex items-center break-all">
                <div className="w-24 theme-text-secondary text-sm">{t("settings.username")}</div>
                <div className="font-bold">{user.username}</div>
              </div>
            </div>
            <div className="mb-5 flex items-center break-all">
              <div className="w-24 theme-text-secondary text-sm">{t("settings.useremail")}</div>
              <div className="inline-flex items-center break-all font-bold">
                {
                  showEmail ? (
                    <div>
                      {user.email}
                      {" "}
                      <div data-qa-selector="show-email-btn" className="inline-flex ml-3">
                        <Button size={Button.size.SMALL} onClick={(): void => setShowEmail(false)}>{t("settings.hide")}</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {hideEmail(user.email)}
                      {" "}
                      <div data-qa-selector="show-email-btn" className="inline-flex ml-3">
                        <Button size={Button.size.SMALL} onClick={(): void => setShowEmail(true)}>{t("settings.reveal")}</Button>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div className="md:flex items-start justify-start">
            <div className="sm:flex sm:space-x-3">
              <Button
                className="block w-full mb-3 sm:w-auto sm:mb-0"
                name="change-email-btn"
                type="button"
                onClick={(): void => setShowEmailModal(true)}
                size={Button.size.SMALL}
              >
                {t("settings.change.email")}
              </Button>
              <Button
                className="block w-full mb-3 sm:w-auto sm:mb-0"
                name="change-password-btn"
                type="button"
                onClick={(): void => setShowPasswordModal(true)}
                size={Button.size.SMALL}
              >
                {t("settings.change.password")}
              </Button>
              <Button
                className="block w-full mb-3 sm:w-auto sm:mb-0"
                name="logout-all-btn"
                type="button"
                onClick={signOutAll}
                size={Button.size.SMALL}
              >
                {t("settings.logout.all")}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8">
        <h2 className="text-base text-3xl font-bold mb-6 flex items-center">
          {t("settings.two.factor.auth")}
        </h2>
        <div className="mb-6">
          {
            user.is2FaEnabled
              ? (
                <div className="text-green-500">
                  <Icon name="security-on" />
                  {" "}
                  <span className="uppercase text-lg font-bold" data-qa-selector="two-fa-status">{t("settings.enabled")}</span>
                </div>
              )
              : (
                <div className="text-red-500">
                  <Icon name="security-off" />
                  {" "}
                  <span className="uppercase text-lg font-bold" data-qa-selector="two-fa-status">{t("settings.disabled")}</span>
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
                      title: t("settings.modal.2fa.disabled.title"),
                      // eslint-disable-next-line
                      message: (close: () => void) => (
                        <div>
                          <p className="mb-3">{t("settings.modal.2fa.disabled.row1")}</p>
                          <p className="mb-3">
                            {t("settings.modal.2fa.disabled.row2")}
                            {" "}
                            &#40;
                          </p>
                          <button
                            className="theme-text-primary"
                            type="button"
                            name="set-up-2fa-again"
                            onClick={(): void => {
                              close();
                              setTimeout(onClickEnable2FA, 0);
                            }}
                          >
                            {t("settings.modal.2fa.disabled.setup")}
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
              size={Button.size.SMALL}
            >
              {t("settings.disable.2fa")}
            </Button>
          ) : (
            <Button
              name="enable2FA"
              type="button"
              variant={Button.variant.GREEN}
              onClick={onClickEnable2FA}
              size={Button.size.SMALL}
            >
              {t("settings.enable.2fa")}
            </Button>
          )
        }
      </section>
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          {t("settings.notifications")}
        </h2>
        <Switch
          disabled={pendingUpdateUser}
          checked={user.txNotifications}
          id="tx-notifications"
          onChange={(e): void => { updateUser({ tx_notifications: e.target.checked }); }}
        >
          <span className="text-base">{t("settings.email.notifications")}</span>
        </Switch>
      </section>
    </PageTemplate>
  );
};

export default SettingsPage;
