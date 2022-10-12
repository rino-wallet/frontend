import WalletService from "./WalletService";

const WalletFactory = (() => {
  let instance: WalletService;

  return {
    getInstance() {
      if (!instance) {
        instance = new WalletService();
      }
      return instance;
    },
  };
})();

export default WalletFactory.getInstance();
