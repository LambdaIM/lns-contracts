import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const registry = await ethers.getContract('LNSRegistry', owner)
  const controller = await ethers.getContract('LAMBRegistrarController', owner)
  const reverseRegistrar = await ethers.getContract('ReverseRegistrar', owner)
  // const registrar = await ethers.getContract('BaseRegistrarImplementation', owner)

  const publicResolver = await deploy('PublicResolver', {
    from: deployer,
    args: [registry.address, controller.address, reverseRegistrar.address],
    log: true,
  })
  if (!publicResolver.newlyDeployed) return

  const tx = await reverseRegistrar.setDefaultResolver(publicResolver.address)
  console.log(
    `Setting default resolver on ReverseRegistrar to PublicResolver (tx: ${tx.hash})...`,
  )
  await tx.wait()

  if (
    (await registry.owner(ethers.utils.namehash('resolver.lamb'))) === owner
  ) {
    const pr = (await ethers.getContract('PublicResolver')).connect(
      await ethers.getSigner(owner),
    )
    const resolverHash = ethers.utils.namehash('resolver.lamb')
    const tx2 = await registry.setResolver(resolverHash, pr.address)
    console.log(
      `Setting resolver for resolver.lamb to PublicResolver (tx: ${tx2.hash})...`,
    )
    await tx2.wait()

    const tx3 = await pr['setAddr(bytes32,address)'](resolverHash, pr.address)
    console.log(
      `Setting address for resolver.lamb to PublicResolver (tx: ${tx3.hash})...`,
    )
    await tx3.wait()
  } else {
    console.log(
      'resolver.lamb is not owned by the owner address, not setting resolver',
    )
  }
  console.log(`PublicResolver deployed at (addr: ${controller.address})`)
}

func.id = 'resolver'
func.tags = ['PublicResolver']
func.dependencies = [
  'LNSRegistry',
  'LAMBRegistrarController',
  'ReverseRegistrar',
]

export default func
