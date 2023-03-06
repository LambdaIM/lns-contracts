import { ethers } from 'hardhat'
import * as crypto from 'crypto'
import { utils } from 'ethers'

const DAY = 60 * 60 * 24

async function main() {
  const { getNamedAccounts, network } = require('hardhat')
  const { owner } = await getNamedAccounts()
  const controller = await ethers.getContract('ETHRegistrarController', owner)
  const resolver = await ethers.getContract('PublicResolver', owner)
  const name = 'lambda'
  if (!(await controller.available(name))) {
    console.error(`The name ${name} is unavailable`)
    return
  }
  console.log(`The name ${name} is available`)

  let duration = 30 * DAY
  if (network.name === 'localhost') {
    duration = 61
  }
  const price = await controller.rentPrice(name, duration)
  console.log(`[price] base: ${price.base} premium: ${price.premium}`)
  const random = new Uint8Array(32)
  crypto.getRandomValues(random)
  const secret =
    '0x' +
    Array.from(random)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  const commitment = await controller.makeCommitment(
    name,
    owner,
    duration,
    secret,
    resolver.address,
    false,
  )
  console.log(`Commitment: ${commitment}`)
  const tx = await controller.commit(commitment)
  console.log(`Committing (tx: ${tx.hash})`)
  await tx.wait()
  console.log(`First step complete, next...`)

  let taskDelay = 61000
  let exitDelay = 70000
  if (network.name === 'localhost') {
    taskDelay = 3000
    exitDelay = 5000
  }
  setTimeout(async () => {
    const tx1 = await controller.register(
      name,
      owner.toString(),
      duration,
      secret,
      resolver.address,
      false,
      { value: utils.parseEther('5') },
    )
    console.log(`Registering ${name} to ${owner} (tx: ${tx1.hash})...`)
    await tx1.wait()
  }, taskDelay)

  await sleep(exitDelay)
}

function sleep(ms: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
