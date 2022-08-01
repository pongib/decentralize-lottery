import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis()
  const [temp, setTemp] = useState()

  useEffect(() => {
    console.log("isWeb3Enabled X", isWeb3Enabled)
    if (isWeb3Enabled) return
    if (
      typeof window !== undefined &&
      window.localStorage.getItem("connected")
    ) {
      console.log("Auto Connect")
      enableWeb3()
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    console.log("Start Listening")
    Moralis.onAccountChanged((account) => {
      console.log("Account change to", account)
      if (!account) {
        window.localStorage.removeItem("connected")
        deactivateWeb3()
        console.log("Null account found Deactivate web3")
      }
    })
  }, [])

  const handlerConnect = async () => {
    console.log("isWeb3Enabled", isWeb3Enabled)
    await enableWeb3()
    if (typeof window !== undefined) {
      window.localStorage.setItem("connected", "injected")
    }
  }

  return (
    <div>
      {account ? (
        <button>{`${account.slice(0, 6)}.....${account.slice(-4)}`}</button>
      ) : (
        <button onClick={handlerConnect} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </div>
  )
}

export default ManualHeader
