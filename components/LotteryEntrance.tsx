import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { useNotification } from "@web3uikit/core"

interface contractAddressInterface {
  [key: string]: string[]
}

const LotteryEntrance = () => {
  const addresses: contractAddressInterface = contractAddress
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex!).toString()
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const dispatch = useNotification()
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

  const handleSuccess = async (tx: ContractTransaction) => {
    const txReceipt = await tx.wait()
    console.log("txReceipt", txReceipt)
    handleNotification()
  }

  const handleNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      // icon: "bell",
    })
  }

  const handlerEnterBtn = async () => {
    await enterRaffle({
      onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
      onError: (error) => console.log(error),
    })
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      const getFee = async () => {
        const entranceFeeFromContract = (await getEntranceFee()) as BigNumber
        console.log("entranceFeeFromContract", entranceFeeFromContract)
        setEntranceFee(entranceFeeFromContract.toString())
      }
      getFee()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      {raffleAddress ? (
        <div>
          <div>Entrace Fee: {ethers.utils.formatEther(entranceFee)}</div>
          <button onClick={handlerEnterBtn}>Enter Raffle</button>
        </div>
      ) : (
        <div>No Raffle Address Found</div>
      )}
    </div>
  )
}

export default LotteryEntrance
