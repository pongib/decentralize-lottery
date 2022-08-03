import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { BigNumber, ethers } from "ethers"

interface contractAddressInterface {
  [key: string]: string[]
}

const LotteryEntrance = () => {
  const addresses: contractAddressInterface = contractAddress
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  console.log("isWeb3Enabled", isWeb3Enabled)
  const chainId = parseInt(chainIdHex!).toString()
  console.log("chainId", chainId)
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
  })

  async function handlerEnterBtn() {
    if (isWeb3Enabled) {
      const tx = await enterRaffle()
      console.log(tx)
    }
  }

  useEffect(() => {
    console.log("fired")

    if (isWeb3Enabled) {
      const getFee = async () => {
        const entranceFeeFromContract = (await getEntranceFee()) as BigNumber
        console.log(entranceFeeFromContract)
        setEntranceFee(
          ethers.utils.formatEther(entranceFeeFromContract.toString())
        )
      }
      getFee()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <div>Entrace Fee: {entranceFee}</div>
      <button onClick={handlerEnterBtn}>Enter Raffle</button>
    </div>
  )
}

export default LotteryEntrance
