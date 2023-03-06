import { ethers } from 'hardhat'
import { utils } from 'ethers'

async function main() {
  const { getNamedAccounts } = require('hardhat')
  const { owner } = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController', owner)
  const before = await controller.provider.getBalance(controller.address)
  console.log(`Controller's balance: ${utils.formatEther(before)}`)
  const tx = await controller.withdraw()
  console.log(`Withdrawing (tx: ${tx.hash})`)
  await tx.wait()
  const after = await controller.provider.getBalance(controller.address)
  console.log(`Controller's balance: ${utils.formatEther(after)}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
