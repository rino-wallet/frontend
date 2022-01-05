import React from "react";

const Acknowledgments: React.FC = () => {
  return <section>
    <h1 className="text-3xl mb-3">Acknowledgments</h1>
    <p className="mb-3">
      RINO would like to thank the following users, researchers and/or organizations
      for finding and properly disclosing security issues in our application and infrastructure,
      that could had otherwise affected our users and our company:
    </p>
    <ul className="list-inside list-disc mb-3">
    </ul>
  </section>
}

export default Acknowledgments;
