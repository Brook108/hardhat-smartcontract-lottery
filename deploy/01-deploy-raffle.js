const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verity } = require("../utils/verify")

const FUND_AMOUNT = ethers.parseEther("1")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target

        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        //console.log(transactionReceipt)
        //console.log("events:", transactionReceipt.events)
        //console.log("logs:", transactionReceipt.logs[0].topics[1])
        subscriptionId = BigInt(transactionReceipt.logs[0].topics[1])
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinatorV2']
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const hashKey = networkConfig[chainId]["hashKey"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    args = [vrfCoordinatorV2Address, entranceFee, hashKey, subscriptionId, callbackGasLimit, interval]


    console.log("chainid:", chainId)
    console.log("args:", args)
    console.log("deployer:", deployer)
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("------------------")
}

module.exports.tags = ["all", "raffle"]