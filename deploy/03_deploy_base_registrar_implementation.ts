import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { keccak256 } from 'js-sha3'
import { namehash } from 'ethers/lib/utils'

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const bri = await deploy('BaseRegistrarImplementation', {
    from: deployer,
    args: [registry.address, namehash('eth')],
    log: true,
  })
  if (!bri.newlyDeployed) return

  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const tx1 = await registrar.transferOwnership(owner, { from: deployer })
  console.log(
    `Transferring ownership of registrar to owner (tx: ${tx1.hash})...`,
  )
  await tx1.wait()

  // TEMP
  // const tx00 = await registry
  //     .connect(await ethers.getSigner(owner))
  //     .setSubnodeOwner(ZERO_HASH, '0x' + keccak256('eth'), owner)
  // await tx00.wait()
  // const tx01 = await registry
  //     .connect(await ethers.getSigner(owner))
  //     .setSubnodeOwner(namehash('eth'), '0x' + keccak256('resolver'), owner)
  // console.log(
  //     `Setting owner of resolver.eth to owner on registry (tx: ${tx01.hash})...`
  // )
  // await tx01.wait()
  //
  // const tx02 = await registry
  //     .connect(await ethers.getSigner(owner))
  //     .setOwner(namehash('eth'), registrar.address)
  // await tx02.wait()
  // END

  const tx2 = await registry
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner(ZERO_HASH, '0x' + keccak256('eth'), registrar.address)
  console.log(
    `Setting owner of eth node to registrar on registry (tx: ${tx2.hash})...`,
  )
  await tx2.wait()

  console.log(
    `BaseRegistrarImplementation deployed at (addr: ${registrar.address})`,
  )
}

func.id = 'registrar'
func.tags = ['BaseRegistrarImplementation']
func.dependencies = ['registry']

export default func
