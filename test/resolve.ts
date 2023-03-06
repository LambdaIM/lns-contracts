import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { owner } = await getNamedAccounts()
  const registry = await ethers.getContract('ENSRegistry', owner)
  const domain = 'lambda.eth'
  const resolver = await registry.resolver(namehash(domain))
  console.log(`resolver of ${domain} ${resolver}`)
  const resolverContract = (
    await ethers.getContractAt('PublicResolver', resolver)
  ).connect(await ethers.getSigner(owner))
  const addr = await resolverContract['addr(bytes32)'](namehash(domain))
  console.log(`${domain} ==>> ${addr}`)
}

func(require('hardhat'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
