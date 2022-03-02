import React from "react";
import { HashLink } from "react-router-hash-link";
import { Collapsible } from "../../components";
import { MultisigDiagram } from "../../components/MultisigDiagram";


const FAQ: React.FC = () => {
  return <section>
    <h1 className="text-5xl text-center mb-12">FAQ</h1>
    <div className="mt-8">
      <div className="w-2 h-2 rounded inline-block mr-8 my-1 bg-orange-900" />
      <div className="text-2xl md:text-3xl font-bold font-catamaran inline">Overview</div>
      <div className="ml-10 my-4">
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">What is RINO?</h3>}>
          <p>
            RINO is a new type of Monero wallet. We are a non-custodial, enterprise-grade, multisig wallet.
            <b> Non-custodial</b> means we don’t have any way to spend your money. The keys that can actually spend
            your money stay in your control - always. <b>Enterprise-grade</b> means we offer rock solid support and
            that we will soon roll out professional features to support businesses, such as multi-user wallets with fine grained
            permissions and spending approvals, daily spending limits etc. <b>Multisig</b> (multi-signature) is
            the cryptographic magic that makes it all possible (<HashLink smooth className="theme-link" to="#multisig">details below</HashLink>).
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Why use RINO?</h3>}>
          <p className="mb-4">With RINO you get all the convenience of an online wallet AND the safety of a non-custodial wallet.</p>
          <p className="mb-4">
            Other online wallets offer convenient features such as 2fa, notifications, etc by taking
            custody of your money. Which means you have to trust the wallet provider not to steal
            your money or to disappear (or both!).
          </p>
          <p className="mb-4">
            RINO is a non-custodial wallet, so it's simply not possible for us to spend your money.
            But at the same time, RINO allows you super convenient access from any device AND
            puts you in control on how and when your precious moneroj can be spent.
            How does RINO manage to give you the best of both worlds? With the magic of multisig cryptography.
          </p>
          <p className="mb-4">
            With other wallets, if someone steals your password, all your funds are gone.
            With RINO and 2FA, your funds are safe even if your password is compromised.
            Lots more cool features coming soon. Shared multi-user wallets with fine-grained
            permissions and approvals, spending limits, notifications of incoming transactions.
          </p>
        </Collapsible>
      </div>
    </div>
    <div className="mt-8">
      <div className="w-2 h-2 rounded inline-block mr-8 my-1 bg-orange-900" />
      <div className="text-2xl md:text-3xl font-bold font-catamaran inline">Getting Started</div>
      <div className="ml-10 my-4">
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Quick version - tl;dr</h3>}>
          <p>1. Register an account, confirm your email address, and log in.</p>
          <p>2. Create a wallet. Store your Wallet Recovery Document safely!</p>
          <p>3. Receive some moneroj to your RINO wallet - just like a normal wallet!</p>
          <p className="mb-4">4. Set up spending controls - right now that's 2FA. More coming soon (daily limits, sharing etc.)</p>
          <p><b>For daily RINO use:</b> your password; your 2FA device.</p>
          <p className="mb-4"><b>Store safely:</b> Account Recovery Document; Wallet Recovery Document.</p>
        </Collapsible>
        <div id="details">
          <Collapsible collapsedDefault={location.hash !== "#details"} className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">More Detailed Instructions</h3>}>
            <p className="mb-4">
              Creating a RINO wallet is easy.
            </p>
            <h4 className="mb-4 text-xl font-catamaran font-bold">
              1. Register
            </h4>
            <p className="mb-4">
              Start by registering an account, confirming your email address, and logging in.
              The standard stuff, no different from any other service.
            </p>
            <p className="mb-4">
              When you log in for the first time, the system will create an Account Recovery Document for you.
              You must not lose it! You will need the Account Recovery Document to recover your account if you ever
              forget your password.
            </p>
            <h4 className="mb-4 text-xl font-catamaran font-bold">
              2. Create a Wallet
            </h4>
            <p className="mb-4">
              After you have safely stored your Account Recovery Document, you can create your first wallet:
              click the big button that says CREATE WALLET. Generating a new wallet takes a little while,
              possibly up to about a minute. Once the wallet is generated, the system will create another
              document - the Wallet Recovery Document. This document is very important; it allows
              access to your funds without any need to use the RINO website.
            </p>
            <h4 className="mb-4 text-xl font-catamaran font-bold">
              3. Send and Receive Funds
            </h4>
            <p className="mb-4">
              Using the wallet is similar to using any other crypto wallet. One RINO plus
              point - your wallet balance is updated in near real-time: with RINO, you
              don't have any annoying delays waiting for the wallet to sync.
            </p>
            <h4 className="mb-4 text-xl font-catamaran font-bold">
              4.  Set up 2FA
            </h4>
            <p className="mb-4">
              To get the full protection of RINO, we recommend enabling 2FA in your
              account settings page. This way, no-one can spend your moneroj even
              if they somehow manage to steal your password.
            </p>
          </Collapsible>
        </div>
      </div>
    </div>
    <div className="mt-8">
      <div className="w-2 h-2 rounded inline-block mr-8 my-1 bg-orange-900" />
      <div className="text-2xl md:text-3xl font-bold font-catamaran inline">Troubleshooting</div>
      <div className="ml-10 my-4">
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">How can I reset my password if I forgot it?</h3>}>
          <p>
            This is what the Account Recovery Document is for. When you create
            your RINO account, we ask you to download and store your Account
            Recovery Document. To reset your password, follow the detailed
            instructions on the document. We’re sorry but this is the only
            way you can reset your password if you don’t remember it (if
            you know your password and just want to change it, then you
            don’t need the Account Recovery Document - you can just edit
            your account settings). 
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">How can I recover my funds if RINO is inaccessible?</h3>}>
          <p>
            This is what the Wallet Recovery Document is for. You have one
            of these documents for each of your RINO wallets. Each time you
            create a wallet in RINO, we ask you to download and store safely
            a dedicated Wallet Recovery Document for that specific wallet.
            To recover funds in a particular wallet, locate your Wallet Recovery
            Document specific to that wallet. Follow the detailed instructions
            in the document.
          </p>
        </Collapsible>
      </div>
    </div>
    <div className="mt-8">
      <div className="w-2 h-2 rounded inline-block mr-8 my-1 bg-orange-900" />
      <div className="text-2xl md:text-3xl font-bold font-catamaran inline">The Nitty Gritty</div>
      <div className="ml-10 my-4">
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Why do I need an Account Recovery Document?</h3>}>
          <p>
            At RINO we encrypt everything we can to protect your data from the world, and even from us!
            We use your password to encrypt your essential data on RINO. And we don’t know your password
            (it lives in your browser). That’s great for security, but it means that if you lose your
            password we can’t simply send you a password reset link, as your new password would not be
            able to decrypt your data.
          </p>

          <p>
            If you know your password then you can change it to a new, different password. However,
            if you have lost your password, the only way to recover your account access and set up a
            new password is using the Account Recovery Document that we generate for you when you first
            create your account. Moral of the story - store your Account Recovery Document in a safe place,
            anyone that has access to it can reset your password.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Can RINO steal my money?</h3>}>
          <p>
            No. It’s mathematically impossible. See <HashLink smooth className="theme-link" to="#multisig">below</HashLink> for
            a full description of how multisig works.
            The main thing to understand is that each wallet has three keys. Two out of the three keys
            are required to send money, and RINO only has access to one of three keys.
            You, the user, are always in full control of the other two keys. So you can spend money without
            needing RINO to sign anything with its key (you always have the option to access your funds
            directly using the Wallet Recovery Document). But RINO can’t spend money without you checking
            and signing as part of the normal RINO-usage flow.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Can I delete a wallet?</h3>}>
          <p>
          Yes you can. Deleted wallets can’t be restored in RINO, so just be sure before you delete 
          - all your transaction meta data will be deleted irreversibly.
          </p>
          <p>
            Note that even though you will no longer be able to access a deleted wallet on the RINO website,
            you can still recover funds from a deleted wallet using your Wallet Recovery Document.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Can RINO see my transactions?</h3>}>
          <p>
            Yes. We have to be able see your transactions to deliver some of our key features - no wallet
            sync wait times - accessing your wallet and its history across multiple devices, etc. But note
            that because of the great properties of Monero itself we don’t know anything about where your
            money is coming from. And if you ask everyone you send money to to always use new subaddresses
            (as they should be doing anyway), then we have no way of ever knowing who you are sending money to either.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Why should I believe you?</h3>}>
          <p>
            All RINO code that is executed in the web browser is <a className="theme-link" href='https://github.com/rino-wallet/' target="_blank">open source</a>.
            Anyone can inspect it and check that it does exactly what it’s supposed to. Additionally, we went to great lengths
            to ensure that all relevant code is built in a deterministic way: you can simply build the code yourself to verify
            that what we’re serving you on our website is exactly what’s been published. By just checking a few hashes you can
            verify that the frontend code served on <a className="theme-link" href='https://rino.io' target="_blank">https://rino.io</a> is
            indeed the exact same as the code available on our open-source repository.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">How much does it cost to use RINO?</h3>}>
          <p className="mb-4">
            At the moment RINO is free. However, while we do want to support the community as much as possible,
            now and in the future - check out our <a className="theme-link" href="https://community.rino.io" target="_blank">community contributions</a> which will always be
            free - we do plan on running RINO in the future as a money making business.
          </p>
          <p className="mb-4">
            Honestly, right now we don’t know exactly what our charging model is going to look like.
            We are going to roll out lots of cool features, and we might charge for some or all of them.
            We hope to keep a free tier in some form or other, but it will depend a lot on how the
            business develops. For example, if we have a lot of business customers, maybe we can keep
            it free for the community - we’ll have to see.
          </p>
          <p className="mb-4">
            The good news is that you always have a choice - any time you don’t like any of our decisions
            you can just use your recovery keys and take your money elsewhere, without even having to use
            the RINO website. So it’s our job to keep you happy, and make sure that we offer the right
            combination of features at the right price to keep you all sticking around.
          </p>
        </Collapsible>
        <div id="multisig">
          <Collapsible collapsedDefault={location.hash !== "#multisig"} className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">What is multi-signature?</h3>}>
            <div className="my-6">
              <MultisigDiagram dark />
            </div>
            <p className="mb-4">
              A RINO “2-of-3” multisig wallet has three keys. Any two of the three keys are required to
              spend the money in the wallet. Here comes the special sauce: RINO retains only one of the
              keys, and therefore has no way to spend your money. You keep two of the three keys - the
              User Key and the Recovery Key. You stash your two keys safely offline (they are on the Wallet
              Recovery Document). For day to day usage, we keep an encrypted version of your user key.
              Your User Key stays with us - but…. in encrypted form - we have no way of decrypting it.
              When you use our service, we send you the encrypted User Key, and it gets decrypted locally
              in your browser.
            </p>
            <p className="mb-4">When you want to spend your funds, you have two options.</p>
            <ul>
              <li className="mb-4">
                Option A - Using the RINO service. Log in to RINO, navigate to your wallet and spend away.
                When you use normal RINO workflow in this way, under the hood it’s the RINO key and the User
                key that are being used together to spend your funds
              </li>
              <li>
                Option B - Bypass the RINO service and use your Wallet Recover Document to spend your funds.
                This option does not require any interaction with RINO at all. When you use this option you
                are using your User Key and your Recovery Key to spend the funds.
              </li>
            </ul>
          </Collapsible>
        </div>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">What if my computer is compromised during wallet creation?</h3>}>
          <p className="mb-4">
            It’s not great. Right now we offer convenient in-browser wallet creation
            which means your funds <b>are at risk</b> if your computer is compromised.
          </p>
          <p>
            Airgapped wallet creation is a feature in the pipeline that would protect
            you against this problem - drop us a line at <a className="theme-link" href="mailto:support@rino.io">support@rino.io</a> to let us
            know if this is a priority for you.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">What if my computer is compromised when using the wallet?</h3>}>
          <p className="mb-4">
            The benefit of RINO is that even if your computer is compromised, attackers cannot
            spend funds without access to your 2FA device. In future RINO will give even more
            fine grained controls to make you even safer - daily limits, wallet sharing with
            multiple people having to approve transactions, etc.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">What about feature x?</h3>}>
          <p>
            Get in touch with us at <a className="theme-link" href="mailto:support@rino.io">support@rino.io</a>.
            Features in the pipeline are targeted at enterprise such as shared wallets,
            different user privileges, daily spending limits. However, we’re always
            happy to hear about your needs.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Do you have an SDK? An API?</h3>}>
          <p>
            Yes, we do. Let us finish testing it and you can start having fun :)
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">I’m a business. I want to use RINO as my backend. Can you help?</h3>}>
          <p>
            Absolutely. <br/>
            Get in touch with us at <a className="theme-link" href="mailto:enterprise@rino.io">enterprise@rino.io</a>.
            We are building more features dedicated to enterprise wallet hosting.
            Let’s talk about pricing / how we can help. Features in the pipeline
            are shared wallets, different user privileges, daily spending limits.
          </p>
        </Collapsible>
        <Collapsible className="mb-4" title={<h3 className="text-xl mdtext-2xl font-bold font-catamaran">Why do I need a username?</h3>}>
          <p>
            Your username is a unique non-changeably identifier for your account.
            Having the username fixed means that you can change your email address if you want.
            And the username will also be useful for some of the cool new features we have in
            the pipeline like wallet sharing.
          </p>
          <p>
            You can’t ever change your username, as it is used for some low level cryptographic
            operations associated with your account (for the technically minded - we use it as
            a salt in the key derivation function).
          </p>
        </Collapsible>
      </div>
    </div>
  </section>
}

export default FAQ;
