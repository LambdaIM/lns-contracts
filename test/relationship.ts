import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'
import { keccak256 } from 'js-sha3'
import { utils } from 'ethers'

async function main() {
  const { getNamedAccounts } = require('hardhat')
  const { deployer, owner } = await getNamedAccounts()
  console.log(`deployer\t${deployer}`)
  console.log(`owner\t\t${owner}`)
  console.log(`=========================================================`)
  const registry = await ethers.getContract('LNSRegistry', owner)
  console.log(`LNSRegistry\t\t\t${registry.address}`)
  const reverse = await ethers.getContract('ReverseRegistrar', owner)
  console.log(
    `ReverseRegistrar\t\t${reverse.address}\tOwner ${await reverse.owner()}`,
  )
  const registrar = await ethers.getContract(
    'BaseRegistrarImplementation',
    owner,
  )
  console.log(
    `BaseRegistrarImplementation\t${
      registrar.address
    }\tOwner ${await registrar.owner()}`,
  )
  const lambOracle = await ethers.getContract('LAMBPriceOracle', owner)
  console.log(
    `LAMBPriceOracle\t\t\t${
      lambOracle.address
    }\tOwner ${await lambOracle.owner()}`,
  )
  const stableOracle = await ethers.getContract('StablePriceOracle', owner)
  console.log(`StablePriceOracle\t\t${stableOracle.address}`)
  const controller = await ethers.getContract('LAMBRegistrarController', owner)
  console.log(
    `LAMBRegistrarController\t\t${
      controller.address
    }\tOwner ${await controller.owner()}`,
  )
  const resolver = await ethers.getContract('PublicResolver', owner)
  console.log(`PublicResolver\t\t\t${resolver.address}`)
  console.log(`=========================================================`)
  console.log(
    `[lamb]\t\towner (${await registry.owner(
      namehash('lamb'),
    )}) resolver (${await registry.resolver(namehash('lamb'))})`,
  )
  console.log(
    `[reverse]\towner (${await registry.owner(
      namehash('reverse'),
    )}) resolver (${await registry.resolver(namehash('reverse'))})`,
  )
  console.log(
    `[addr.reverse]\towner (${await registry.owner(
      namehash('addr.reverse'),
    )}) resolver (${await registry.resolver(namehash('addr.reverse'))})`,
  )
  console.log(
    `[resolver]\towner (${await registry.owner(
      namehash('resolver'),
    )}) resolver (${await registry.resolver(namehash('resolver'))})`,
  )
  console.log(
    `[resolver.lamb]\towner (${await registry.owner(
      namehash('resolver.lamb'),
    )}) resolver (${await registry.resolver(namehash('resolver.lamb'))})`,
  )
  console.log(
    `[test.lamb]\towner (${await registry.owner(
      namehash('test.lamb'),
    )}) resolver (${await registry.resolver(namehash('test.lamb'))})`,
  )
  const name = 'test'
  const label = '0x' + keccak256(utils.toUtf8Bytes(name))
  const tokenId = ethers.BigNumber.from(label)
  const nftOwner = await registrar.ownerOf(tokenId)
  console.log(`The owner of NFT from ${name} is ${nftOwner}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
