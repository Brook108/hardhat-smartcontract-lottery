const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASEFEE = ethers.parseEther("0.25") // 0.25 from 'Premium' in 'https://docs.chain.link/vrf/v2/subscription/supported-networks'
const GASPRICELINK = 1000000000

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const args = [BASEFEE, GASPRICELINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args
        })
        log("Mocks Deployed!")
        log("-------------------------")
    }
}

module.exports.tags = ["all", "mocks"]