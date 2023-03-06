import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { deployer, owner } = await getNamedAccounts()
  const registry = await ethers.getContract('ENSRegistry', owner)

  const name = 'lambda.eth'
  const oldOwner = await registry.owner(namehash(name))
  console.log(`The owner of ${name} is ${oldOwner}`)
  const tx = await registry.setOwner(namehash(name), deployer)
  console.log(
    `Transferring ownership of ${name} to ${deployer} (tx: ${tx.hash})...`,
  )
  await tx.wait()
  const ownership = await registry.owner(namehash(name))
  console.log(`The new owner of ${name} is ${ownership}`)
}

func(require('hardhat'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
