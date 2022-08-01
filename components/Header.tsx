import { ConnectWallet } from "@web3uikit/web3"

const Header = () => {
  return (
    <div>
      <ConnectWallet moralisAuth={false} />
    </div>
  )
}

export default Header
