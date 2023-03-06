import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { owner } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry', owner)
  const domain = 'lambda.eth'
  const ttl = await registry.ttl(namehash(domain))
  console.log(`TTL of ${domain} is ${ttl}`)
}

func(require('hardhat'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
