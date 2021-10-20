require("dotenv/config")
const got = require('got');
const ethers = require("ethers");
const address = process.env.CONTRACT_ADDRESS;
const openseaDomain = process.env.OPENSEA_DOMAIN;
const api = process.env.INFURA_URL

const abi = [
  "event BlockheadReconfigured(uint256 tokenId)",
];

console.log("Connecting with API", api)
const provider = new ethers.providers.WebSocketProvider(api)
const contract = new ethers.Contract(address, abi, provider);
contract.on("BlockheadReconfigured", async (args) => {
    console.log("BlockheadReconfigured: ", args.toNumber())
    const tokenId = args.toNumber()
    const url = `https://${openseaDomain}/api/v1/asset/${address}/${tokenId}/?force_update=true`
    console.log("Pinging", url)
    const response = await got(url)
    console.log("Pinged for", JSON.parse(response.body).token_id)
})

