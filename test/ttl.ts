import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

async function main() {
  const { getNamedAccounts } = require('hardhat')
  const { owner } = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry', owner)
  const domain = 'lambda.eth'
  const ttl = await registry.ttl(namehash(domain))
  console.log(`TTL of ${domain} is ${ttl}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
