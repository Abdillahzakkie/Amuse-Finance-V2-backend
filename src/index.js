const express = require("express");
const cors = require("cors");
const { web3Subscribe } = require("./helpers");
require("dotenv/config");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.status(200).json("Hello, world!"));

app.listen(port, async () => {
	console.log(`Server listening on PORT: http://127.0.0.1:${port}`);

	await web3Subscribe("ethereum");
});
