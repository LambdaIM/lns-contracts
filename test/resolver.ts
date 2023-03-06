import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'

async function main() {
  const { getNamedAccounts } = require('hardhat')
  const { owner } = await getNamedAccounts()
  const registry = await ethers.getContract('LNSRegistry', owner)
  const domain = 'lambda.lamb'
  const resolver = await registry.resolver(namehash(domain))
  console.log(`resolver of ${domain} is ${resolver}`)
  const resolverContract = (
    await ethers.getContractAt('PublicResolver', resolver)
  ).connect(await ethers.getSigner(owner))
  const addr = await resolverContract['addr(bytes32)'](namehash(domain))
  console.log(`[resolve] ${domain} ==>> ${addr}`)

  const reverseNode = addr.substring(2) + '.addr.reverse'
  const reverseResolver = await registry.resolver(namehash(reverseNode))
  console.log(`resolver of ${addr} is ${reverseResolver}`)
  const name = await resolverContract.name(namehash(reverseNode))
  console.log(`[reverse] ${addr} ==>> ${name}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
