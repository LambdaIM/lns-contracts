import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'hardhat'
import { utils } from 'ethers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
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

func(require('hardhat'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
