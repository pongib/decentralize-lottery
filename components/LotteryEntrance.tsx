import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { useNotification } from "@web3uikit/core"

interface contractAddressInterface {
  [key: string]: string[]
}

const LotteryEntrance = () => {
  console.log('fire');
  
  const addresses: contractAddressInterface = contractAddress
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex!).toString()
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState(ethers.constants.AddressZero)

  const dispatch = useNotification()
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFeeFromContract } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
  })

  const { runContractFunction: getNumberOfPlayersFromContract } =
    useWeb3Contract({
      abi,
      contractAddress: raffleAddress!,
      functionName: "getNumberOfPlayers",
    })

  const { runContractFunction: getRecentWinnerFromContract } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
  })

  const handleSuccess = async (tx: ContractTransaction) => {
    const txReceipt = await tx.wait()
    console.log("txReceipt", txReceipt)
    handleNotification()
    await updateUI()
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

  const updateUI = async () => {
    const entranceFee = (await getEntranceFeeFromContract()) as BigNumber
    setEntranceFee(entranceFee.toString())
    const numPlayers = (await getNumberOfPlayersFromContract()) as string
    setNumPlayers(numPlayers.toString())
    const recentWinner = (await getRecentWinnerFromContract()) as string
    setRecentWinner(recentWinner.toString())
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      {raffleAddress ? (
        <div>
          <button onClick={handlerEnterBtn}>Enter Raffle</button>
          <p>Entrace Fee: {ethers.utils.formatEther(entranceFee)}</p>
          <p>Number of Players {numPlayers}</p>
          <p>Recent Winner {recentWinner}</p>
        </div>
      ) : (
        <div>No Raffle Address Found</div>
      )}
    </div>
  )
}

export default LotteryEntrance
