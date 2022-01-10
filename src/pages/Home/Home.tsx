import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import LogoWhite from "./images/logo_white.svg";
import landingBackground from "./images/background.jpg";
import routes from "../../router/routes";
import { ScrollArrow } from "../../components/ScrollArrow";
import { MultisigDiagram } from "../../components/MultisigDiagram";

const minWindowHeight = 700;

const HomePage: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    function onResize(): void {
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    return (): void => {
      window.removeEventListener("resize", onResize);
    }
  }, []);
  return (
    <div>
      <div
        className="text-white md:bg-center pt-40 pb-14 md:py-0 md:h-screen md:bg-cover relative"
        style={{
          backgroundImage: `url(${landingBackground})`,
          minHeight: windowHeight <  minWindowHeight ? `${minWindowHeight}px` : "auto",
        }}
      >
        <div className="top-1/2 left-0 w-full md:absolute">
          <div className="max-w-screen-lg m-auto p-5 md:flex md:items-center md:transform md:-translate-y-1/2 md:-mt-10">
            <div className="w-1/2 pr-20 hidden md:block">
              <img className="w-full" src={LogoWhite} alt="logo" />
            </div>
            <div className="md:pl-10 mt-10 font-catamaran font-bold text-4xl text-center md:mt-10 md:w-1/2 md:text-left md:whitespace-nowrap md:text-3xl md:text-default">
              Enterprise-Grade Monero Wallet. <br /> Convenient. Secure. Non-custodial.
          </div>
          </div>
        </div>
        <div className="bottom-10 left-0 w-full mt-10 md:mt-0 md:absolute">
          <div className="max-w-screen-xl m-auto px-5">
            <MultisigDiagram />
            <ScrollArrow />
          </div>
        </div>
      </div>
      <div className="container m-auto p-5">
        <div className="mt-8 container">
          <h1 className="text-5xl font-bold font-catamaran text-center mb-12 mt-24">Why RINO?</h1>
          <div className="mt-8">
            <div className="w-2 h-2 rounded inline-block mr-8 my-2 bg-orange-900"/>
            <div className="text-2xl font-bold font-catamaran inline">Unique combination of convenience and security</div>
            <div className="ml-10 my-4">
              <p><b>
                The convenience of an online wallet with the safety of a non-custodial wallet:
              </b></p>
                <ul className="list-disc ml-8">
                  <li className="mt-4">enable 2fa;</li>
                  <li>get notifications;</li>
                  <li className="mb-4">access your wallet(including your transaction notes) on multiple devices;</li>
                </ul>
                Other wallets can offer these features, but only by taking custody of your money.<br />
                RINO uses <b>multisig</b> to give you the best of both worlds.
            </div>
          </div>
          <div className="mt-16">
            <div className="w-2 h-2 rounded inline-block mr-8 my-2 bg-orange-900"/>
            <div className="text-2xl font-bold font-catamaran inline">Keep your independence</div>
            <div className="ml-10 my-4">
              <p>
                <b>You don't have to trust us - we don't have custody of your money.</b>
              </p>
            </div>
            <div className="ml-10 my-4">
              <p>
                Check out the <HashLink smooth className="theme-text-primary font-bold" to={`${routes.faq}#multisig`}>FAQ on how multisig works</HashLink>.
              </p>
            </div>
            <div className="ml-10 my-4">
              <p>We use reproducible builds to guarantee that we really do what we promise.</p>
            </div>
          </div>
          <div className="mt-16">
            <div className="w-2 h-2 rounded inline-block mr-8 my-2 bg-orange-900"/>
            <div className="text-2xl font-bold font-catamaran inline">2FA control</div>
            <div className="ml-10 my-4">
              <p>
                With RINO, even if someone spies on your password, they still can't get your money, because you are protected with 2FA on your phone.
              </p>
            </div>
          </div>
          <div className="mt-16">
            <div className="w-2 h-2 rounded inline-block mr-8 my-2 bg-orange-900"/>
            <div className="text-2xl font-bold font-catamaran inline">More cool features coming soon:</div>
            <div className="ml-10 my-4">
              <ul className="list-disc ml-8 mb-4">
                <li>shared wallets;</li>
                <li>spending limits;</li>
                <li>email notifications of incoming transaction;</li>
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-5xl font-bold font-catamaran text-center mb-12 mt-24">Getting started</h1>
            <div className="md:grid grid-cols-2 gap-5">
              <div>
                <div className="flex items-center flex-row mb-4">
                  <span className="text-7xl font-bold font-catamaran theme-text-primary mx-6">1</span>
                  <p>Register an account, confirm your email address, and log in.</p>
                </div>
                <div className="flex items-center flex-row mb-4">
                  <span className="text-7xl font-bold font-catamaran theme-text-primary mx-6">2</span>
                  <p>Create a wallet. Remember to store your wallet recovery document safely!</p>
                </div>
              </div>
              <div>
                <div className="flex items-center flex-row mb-4">
                  <span className="text-7xl font-bold font-catamaran theme-text-primary mx-6">3</span>
                  <p>Receive some money to your RINO wallet - just like a normal wallet!</p>
                </div>
                <div className="flex items-center flex-row mb-4">
                  <span className="text-7xl font-bold font-catamaran theme-text-primary mx-6">4</span>
                  <p>Enable 2FA on your account for even better security.</p>
                </div>
              </div>
            </div>
            <div className="mx-20 mt-12 mb-20 text-center">
              <p>That's it! There is no Step 5 🙂 Check out the <a className="theme-text-primary" href={routes.faq}>FAQ</a> for more details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
