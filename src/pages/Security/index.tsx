import React from "react";
import routes from "../../router/routes";

const Security: React.FC = () => {
  return <section>
    <h1 className="text-3xl mb-3">Coordinated disclosure policy</h1>
    <p className="mb-3">
      At RINO we give great importance to the security and privacy of all our stakeholders, it is part of our job to do our best to ensure all our systems are well protected and the data we hold is safe.
    </p>
    <p className="mb-3">
      An important component of this task is to discover any kind of mal-function or mis-configuration in our systems that may affect or compromise RINO and its users. On this matter we acknowledge the importance of the work being done by independent security researchers and we are willing to work with them to achieve this goal as long as everybody acts in good faith.
    </p>
    <p className="mb-3">
      We try to respond, investigate and address any bug/vulnerability report in a timely fashion, in order to be responsible to our users and to respect the effort of the person making the report.
    </p>
    <p className="mb-3">
      Below you can find all the details about how to correctly make a report.
    </p>
    <h2 className="text-xl mb-3">Process</h2>
    <p className="mb-3">
      To initiate the reporting process you should gather all the information you collected about the vulnerability in an email message and send it to <a className="text-primary" href="mailto:security@rino.io">security@rino.io</a>.
    </p>
    <p className="mb-3">Please make your description as detailed as possible, you should try to include:</p>
    <ul className="list-inside list-disc mb-3">
      <li>The components that are affected</li>
      <li>Any preconditions you believe to be required</li>
      <li>The steps you took to trigger the bug</li>
    </ul>
    <p className="mb-3">
      For high severity issues that can easily be exploited, we would appreciate if the email content is encrypted first. You can get our PGP public key <a className="text-primary" href={routes.security_pgp_key} target="_blank" rel="noreferrer noopener">here</a> and confirm it has the following fingerprint: 45F1609889F596FA8715C86A4C885C751EEFDA9A
    </p>
    <p className="mb-3">
      Note: You can also include information about your PGP key, to keep all further discussion private.
    </p>
    <h2 className="text-xl mb-3">Our commitment</h2>
    <p className="mb-3">We respect your work, so you can count on us to:</p>
    <ul className="list-inside list-disc mb-3">
      <li>
        Respond in a timely manner, acknowledging your report as soon as we receive it and letting you know about the status of our internal investigation in the first 48h
      </li>
      <li>
        Provide you with a real timeline for the resolution of the problem
      </li>
      <li>
        Notify you when it is solved or when there is any delay
      </li>
      <li>
        Acknowledge your contribution publicly.
      </li>
    </ul>
    <h2 className="text-xl mb-3">
      Actions we do not allow
    </h2>
    <p className="mb-3">
      While we welcome most bug and vulnerability reports, we expect them to be found in a responsible way, so there are certain conducts we explicitly do not allow such as:
    </p>
    <ul className="list-inside list-disc mb-3">
      <li>
        Intentional attempts to cause denial of service to our production systems
      </li>
      <li>
        Performing actions that negatively affect RINO and/or its users, including accessing, modifying or destroying information that does not belong to you.
      </li>
      <li>
        Any kind of non-technical attacks such as social engineering or phishing
      </li>
      <li>
        Spamming in public zones within the service (chat rooms, forums, etc)
      </li>
    </ul>
    <h2 className="text-xl mb-3">Acknowledgements and Rewards</h2>
    <p className="mb-3">
      All accepted reports will automatically be acknowledged by us on a dedicated public page for this matter (<a className="text-primary" href={routes.acknowledgments} target="_blank" rel="noreferrer noopener">acknowledgments</a>). This acknowledgement will contain the author’s name (or identifier), date and the type of bug/vulnerability found.
    </p>
    <p className="mb-3">
      In case you do not want to be added to the page, please mention it on the email exchanges during the reporting process.
    </p>
    <p className="mb-3">
      Other kinds of prizes might be awarded, the decision will be made by a dedicated internal team and will be based on the following criteria:
    </p>
    <ul className="list-inside list-disc mb-3">
      <li>Severity: The possible damage to RINO and its users</li>
      <li>Impact: The amount of affected users</li>
      <li>Exploitability: How easy would be to exploit such vulnerability</li>
      <li>Report quality: Overall level of detail and clarity of the report</li>
    </ul>
    <p className="mb-3">
      We don’t expect to award this extra prizes on all cases, it is intended for exceptional reports.
    </p>
  </section>
}

export default Security;
