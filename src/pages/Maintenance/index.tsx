import React from "react";

const Maintenance: React.FC = () => (
  <section className="text-white">
    <h2 className="text-2xl font-bold mb-4">RINO is down for maintenance.</h2>
    <p>
      There could be more updates on our Twitter:
      {" "}
      <a className="text-primary" target="_blank" rel="noreferrer" href="https://twitter.com/RINOwallet">@RINOwallet</a>
    </p>
  </section>
);

export default Maintenance;
