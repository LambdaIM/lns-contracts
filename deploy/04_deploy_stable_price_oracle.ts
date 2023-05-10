import {DeployFunction} from 'hardhat-deploy/types'
import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {ethers} from 'hardhat'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const lambOracle = await deploy('LAMBPriceOracle', {
    from: deployer,
    args: ['138800'], // 1e8
    log: true,
  })
  if (owner !== deployer) {
    const loc = await ethers.getContract('LAMBPriceOracle', deployer)
    const tx = await loc.transferOwnership(owner)
    console.log(
      `Transferring ownership of LAMBPriceOracle to ${owner} (tx: ${tx.hash})...`,
    )
    await tx.wait()
  }
  console.log(`LAMBPriceOracle deployed at (addr: ${lambOracle.address})`)

  const stableOracle = await deploy('StablePriceOracle', {
    from: deployer,
    args: [
      lambOracle.address,
      [0, 0, 3169242627000, 316924263000, 63384853000], // [0, 0, 100, 10, 2]USD (1e18)
    ],
    log: true,
  })

  console.log(`StablePriceOracle deployed at (addr: ${stableOracle.address})`)
}

func.id = 'price-oracle'
func.tags = ['StablePriceOracle']

export default func
