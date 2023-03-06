import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

async function main() {
  const { getNamedAccounts } = require('hardhat')
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
