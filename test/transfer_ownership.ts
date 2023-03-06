import { ethers } from 'hardhat'
import { keccak256 } from 'js-sha3'
import { utils } from 'ethers'

async function main() {
  const { getNamedAccounts } = require('hardhat')
  const { deployer, owner } = await getNamedAccounts()

  const registrar = await ethers.getContract(
    'BaseRegistrarImplementation',
    owner,
  )

  // lambda.lamb
  const name = 'lambda'
  const label = '0x' + keccak256(utils.toUtf8Bytes(name))
  const tokenId = ethers.BigNumber.from(label)
  const oldOwner = await registrar['ownerOf(uint256)'](tokenId)
  console.log(`The owner of NFT from ${name} is ${oldOwner}`)

  const expires = await registrar.nameExpires(tokenId)
  const timestamp = ethers.BigNumber.from(expires).toNumber()
  const date = new Date(timestamp * 1000)
  console.log(
    `The expires of ${name} is ${timestamp} as ${date.toLocaleString()}`,
  )

  const tx = await registrar['safeTransferFrom(address,address,uint256)'](
    oldOwner,
    deployer,
    tokenId,
  )
  console.log(
    `Transferring NFT ownership of ${name} from ${oldOwner} to ${deployer} (tx: ${tx.hash})...`,
  )
  await tx.wait()

  const newOwner = await registrar.ownerOf(tokenId)
  console.log(`The new owner of NFT which from ${name} is ${newOwner}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
