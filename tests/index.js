// api stubs
require("./fixture/apiStubs");

// Store tests
require("./store/changeEmailSlice.js");
require("./store/walletSlice.js");
require("./store/otpSlice.js");
require("./store/sessionSlice.js");
require("./store/transactionListSlice.js");
require("./store/walletListSlice.js");
require("./store/subaddressListSlice.js");
require("./store/transactionDetailsSlice.js");

// // Wallet tests
require("./wallet/walletService.js");

// // Utils tests
require("./utils/keypairs.js");
require("./utils/piconeroToMonero.js");
require("./utils/pollTask.js");
require("./utils/transformError.js");
require("./utils/moneroToPiconero.js");
