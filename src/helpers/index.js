require("dotenv/config");

const web3Subscribe = async (web3) => {
	try {
		if (!web3) return;
		console.log("Running web3 subscribe event...");
		web3.eth
			.subscribe("newBlockHeaders")
			.on("data", async (block) => {
				console.log(`New block recieved. Block #${block.number}`);
			})
			.on("error", async (error) => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
		return error;
	}
};
module.exports = { web3Subscribe };
