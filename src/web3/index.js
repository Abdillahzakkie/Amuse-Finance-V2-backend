const Web3 = require("web3");
require("dotenv/config");

const connectWeb3 = () => {
	try {
		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
				`wss://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyApiKey}`
			)
		);
		return { web3 };
	} catch (error) {
		return error;
	}
};

module.exports = { connectWeb3 };
