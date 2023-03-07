import { Interface } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const { makeInterfaceId } = require('@openzeppelin/test-helpers')

function computeInterfaceId(iface: Interface) {
  return makeInterfaceId.ERC165(
    Object.values(iface.functions).map((frag) => frag.format('sighash')),
  )
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const registrar = await ethers.getContract(
    'BaseRegistrarImplementation',
    owner,
  )
  const priceOracle = await ethers.getContract('StablePriceOracle', owner)
  const reverseRegistrar = await ethers.getContract('ReverseRegistrar', owner)

  const controller = await deploy('LAMBRegistrarController', {
    from: deployer,
    args: [
      registrar.address,
      priceOracle.address,
      60,
      86400,
      reverseRegistrar.address,
    ],
    log: true,
  })
  if (!controller.newlyDeployed) return

  if (owner !== deployer) {
    const c = await ethers.getContract('LAMBRegistrarController', deployer)
    const tx = await c.transferOwnership(owner)
    console.log(
      `Transferring ownership of LAMBRegistrarController to ${owner} (tx: ${tx.hash})...`,
    )
    await tx.wait()
  }

  const tx1 = await reverseRegistrar.setController(controller.address, true)
  console.log(
    `Adding LAMBRegistrarController as a controller of ReverseRegistrar (tx: ${tx1.hash})...`,
  )
  await tx1.wait()

  const tx2 = await registrar.addController(controller.address)
  console.log(
    `Adding LAMBRegistrarController as controller on registrar (tx: ${tx2.hash})...`,
  )
  await tx2.wait()

  const artifact = await deployments.getArtifact('ILAMBRegistrarController')
  const interfaceId = computeInterfaceId(new Interface(artifact.abi))
  const provider = new ethers.providers.StaticJsonRpcProvider(
    ethers.provider.connection.url,
    {
      ...ethers.provider.network,
      ensAddress: (await ethers.getContract('LNSRegistry')).address,
    },
  )
  const resolver = await provider.getResolver('lamb')
  if (resolver === null) {
    console.log(
      'No resolver set for .lamb; not setting interface for LAMB Registrar Controller',
    )
    console.log(
      `LAMBRegistrarController deployed at (addr: ${controller.address})`,
    )
    return
  }
  const resolverContract = await ethers.getContractAt(
    'PublicResolver',
    resolver.address,
  )
  const tx3 = await resolverContract.setInterface(
    ethers.utils.namehash('lamb'),
    interfaceId,
    controller.address,
  )
  console.log(
    `Setting LAMBRegistrarController interface ID ${interfaceId} on .lamb resolver (tx: ${tx3.hash})...`,
  )
  await tx3.wait()
  console.log(
    `LAMBRegistrarController deployed at (addr: ${controller.address})`,
  )
}

func.id = 'controller'
func.tags = ['RegistrarController']
func.dependencies = [
  'LNSRegistry',
  'BaseRegistrarImplementation',
  'StablePriceOracle',
  'ReverseRegistrar',
]
export default func
