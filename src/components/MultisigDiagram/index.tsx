import React from "react";
import classNames from "classnames";
import Backup from "./images/icon_backupkey.svg";
import BackupBlack from "./images/icon_backupkey_black.svg";
import Client from "./images/icon_client.svg";
import ClientBlack from "./images/icon_client_black.svg";
import Rino from "./images/icon_rino.svg";
import RinoWhite from "./images/icon_rino_white.svg";

type Props = {
  dark?: boolean;
};

export const MultisigDiagram: React.FC<Props> = ({ dark }) => {
  const backupIcon = dark ? BackupBlack : Backup;
  const clientIcon = dark ? ClientBlack : Client;

  return (
    <div className="md:flex">
      <div className="whitespace-nowrap mb-8" style={{ width: "26%" }}>
        <div className="flex space-x-4 items-end mb-2 md:justify-start">
          <div className="w-16 h-16 flex-shrink-0">
            <img src={backupIcon} alt="" />
          </div>
          <div>
            <p className="text-2xl font-bold">Recovery Key</p>
            <p className="text-base">
              You keep it offline.
            </p>
          </div>
        </div>
        <div className={classNames(
          "flex-1 border-l-2 border-b-2 relative ml-10 h-14 hidden md:block",
          dark ? "border-gray-300" : "border-gray-200",
        )}
        >
          <div className={classNames(
            "w-2 h-2 absolute right-0 bottom-0 transform rotate-45 translate-y-2/4",
            dark ? "bg-gray-300" : "bg-gray-200",
          )}
          />
        </div>
      </div>
      <div className="whitespace-nowrap mb-8">
        <div className="flex space-x-4 items-end mb-2 md:-ml-10 md:justify-center">
          <div className="w-16 h-16 flex-shrink-0">
            <img src={clientIcon} alt="" />
          </div>
          <div>
            <p className="text-2xl font-bold">User Key</p>
            <p className="text-base">
              Only ever decrypted in your browser.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-end hidden md:flex hidden md:block">
          <p className="text-sm text-right px-4 -mb-2">
            Recover Funds.
            {" "}
            <br />
            No dependency on RINO.
          </p>
          <div className={classNames(
            "border-r-2 border-b-2 relative w-8 h-14",
            dark ? "border-gray-300" : "border-gray-200",
          )}
          >
            <div className={classNames(
              "w-2 h-2 absolute left-0 bottom-0 transform rotate-45 translate-y-2/4",
              dark ? "bg-gray-300" : "bg-gray-200",
            )}
            />
          </div>
          <div className="w-4" />
          <div className={classNames(
            "border-l-2 border-b-2 relative w-8 h-14",
            dark ? "border-gray-300" : "border-gray-200",
          )}
          >
            <div className={classNames(
              "w-2 h-2 absolute right-0 bottom-0 transform rotate-45 translate-y-2/4",
              dark ? "bg-gray-300" : "bg-gray-200",
            )}
            />
          </div>
          <p className="text-sm px-4 -mb-2">
            Spend Funds using RINO.
            {" "}
            <br />
            Convenient access + spending controls.
          </p>
        </div>
      </div>
      <div className="whitespace-nowrap mb-8" style={{ width: "26%" }}>
        <div className="flex space-x-4 items-end mb-2 md:justify-end md:text-default">
          <div className="w-16 h-16 flex-shrink-0">
            {
                  // On dark mode we want to always display the dark Rino Icon.
                  // On default mode, we want to display the light Rino Icon, unless the
                  // screen is small.
                  dark
                    ? <img src={Rino} alt="" />
                    : (
                      <div>
                        <img className="md:block hidden" src={Rino} alt="" />
                        <img className="md:hidden" src={RinoWhite} alt="" />
                      </div>
                    )
                }
          </div>
          <div>
            <p className="text-2xl font-bold">RINO Key</p>
            <p className="text-base">
              We have this one.
            </p>
          </div>
        </div>
        <div className={classNames(
          "flex-1 border-r-2 border-b-2 relative mr-20 h-14 mr-20 hidden md:block",
          dark ? "border-gray-300" : "border-gray-200",
        )}
        >
          <div className={classNames(
            "w-2 h-2 absolute left-0 bottom-0 transform rotate-45 translate-y-2/4",
            dark ? "bg-gray-300" : "bg-gray-200",
          )}
          />
        </div>
      </div>
    </div>
  );
};
