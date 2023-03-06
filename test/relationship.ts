import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { namehash } from 'ethers/lib/utils'
import { keccak256 } from 'js-sha3'
import { utils } from 'ethers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { deployer, owner } = await getNamedAccounts()
  console.log(`deployer\t${deployer}`)
  console.log(`owner\t\t${owner}`)
  console.log(`=========================================================`)
  const registry = await ethers.getContract('ENSRegistry', owner)
  console.log(`ENSRegistry\t\t\t${registry.address}`)
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
  const lambOracle = await ethers.getContract('LambPriceOracle', owner)
  console.log(
    `LambPriceOracle\t\t\t${
      lambOracle.address
    }\tOwner ${await lambOracle.owner()}`,
  )
  const stableOracle = await ethers.getContract('StablePriceOracle', owner)
  console.log(`StablePriceOracle\t\t${stableOracle.address}`)
  const controller = await ethers.getContract('ETHRegistrarController', owner)
  console.log(
    `ETHRegistrarController\t\t${
      controller.address
    }\tOwner ${await controller.owner()}`,
  )
  const resolver = await ethers.getContract('PublicResolver', owner)
  console.log(`PublicResolver\t\t\t${resolver.address}`)
  console.log(`=========================================================`)
  console.log(
    `[eth]\t\towner (${await registry.owner(
      namehash('eth'),
    )}) resolver (${await registry.resolver(namehash('eth'))})`,
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
    `[resolver.eth]\towner (${await registry.owner(
      namehash('resolver.eth'),
    )}) resolver (${await registry.resolver(namehash('resolver.eth'))})`,
  )
  console.log(
    `[lambda.eth]\towner (${await registry.owner(
      namehash('lambda.eth'),
    )}) resolver (${await registry.resolver(namehash('lambda.eth'))})`,
  )
  const name = 'lambda'
  const label = '0x' + keccak256(utils.toUtf8Bytes(name))
  const tokenId = ethers.BigNumber.from(label)
  const nftOwner = await registrar.ownerOf(tokenId)
  console.log(`The owner of NFT from ${name} is ${nftOwner}`)
}

func(require('hardhat'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
