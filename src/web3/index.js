const Web3 = require("web3");
require("dotenv/config");

const connectWeb3 = (_rpcURL) => {
	try {
		const web3 = new Web3(new Web3.providers.WebsocketProvider(_rpcURL));
		return { web3 };
	} catch (error) {
		return error;
	}
};

module.exports = { connectWeb3 };
