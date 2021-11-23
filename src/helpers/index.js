const axios = require("axios");
const { connectWeb3 } = require("../web3");
require("dotenv/config");

const etherScanAPIKey = process.env.etherScanAPIKey;
const alchemyApiKey = process.env.alchemyApiKey;

const getRpcURL = (_network = "ethereum-mainnet") => {
	let _rpcURL = "";

	if (_network === "ethereum-mainnet")
		_rpcURL = `wss://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;
	else if (_network === "ethereum-rinkeby")
		_rpcURL = `wss://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`;
	else if (_network === "optimism-mainnet")
		_rpcURL = `wss://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (_network === "optimism-kovan")
		_rpcURL = `wss://opt-kovan.g.alchemy.com/v2/${alchemyApiKey}`;
	else _rpcURL = `wss://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;
	return _rpcURL;
};

const { web3 } = connectWeb3(getRpcURL("ethereum-mainnet"));

const toChecksumAddress = (_account) =>
	web3 && web3.utils.toChecksumAddress(_account);

const web3Subscribe = async (_network) => {
	try {
		const { web3: _web3 } = connectWeb3(getRpcURL("ethereum-mainnet"));
		_web3.eth
			.subscribe("newBlockHeaders")
			.on("data", async (block) => {
				const _currentBlock = block.number;
				const _startBlock = _currentBlock - 2000;
				console.log(`New block received. Block #${_currentBlock}`);
				const _account = "0xba3b264d3B2CD86F752187e5E7022563F72249dA";

				// const _response = await getAccountTxnLists(
				// 	toChecksumAddress(_account),
				// 	_startBlock,
				// 	_currentBlock,
				// 	"internal"
				// );
				// console.log("_response", _response);
				// console.log("_response.length", _response.length);
			})
			.on("error", async (error) => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
		return error;
	}
};

const getAccountTxnLists = async (
	_account,
	_startBlock,
	_endBlock,
	_txnType
) => {
	try {
		const _normalTxnURL = `https://api.etherscan.io/api?module=account&action=txlist&address=${_account}&startblock=${_startBlock}&endblock=${_endBlock}&page=1&offset=10000&sort=asc&apikey=${etherScanAPIKey}`;
		const _internalTxnURL = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${_account}&startblock=${_startBlock}&endblock=${_endBlock}&page=1&offset=10000&sort=asc&apikey=${etherScanAPIKey}`;

		const _response = await (
			await axios({
				method: "GET",
				url: _txnType !== "internal" ? _normalTxnURL : _internalTxnURL,
			})
		).data.result;

		const _filteredTxns = _response.map((item) => {
			return {
				blockNumber: item.blockNumber,
				timestamp: item.timeStamp,
				hash: item.hash,
				nonce: item.nonce,
				blockHash: item.blockHash,
				from: item.from,
				to: item.to,
				value: item.value,
				gas: item.gas,
				gasPrice: item.gasPrice,
				isError: item.isError,
				gasUsed: item.gasUsed,
				contractAddress: item.contractAddress,
			};
		});

		return _filteredTxns;
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = {
	getRpcURL,
	// toChecksumAddress,
	web3Subscribe,
	getAccountTxnLists,
};
