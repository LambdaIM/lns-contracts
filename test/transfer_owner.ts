import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

async function main() {
  const { getNamedAccounts } = require('hardhat')
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
