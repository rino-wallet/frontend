import React from "react";

const UnsupportedBrowser: React.FC = () => (
  <section className="text-white">
    <h2 className="text-2xl font-bold mb-4">Unsupported browser</h2>
    <p className="mb-3">Your web browser apparently does not support all required features.</p>
    <p>We are sorry, but there is nothing we can do. Please try with a more modern browser.</p>
  </section>
);

export default UnsupportedBrowser;
