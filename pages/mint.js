import Head from 'next/head'
import Web3 from "web3";
import { useState, useEffect } from 'react';

import { ADDRESS, ABI } from "../config.js"

export default function Mint() {

  // FOR WALLET
  const [signedIn, setSignedIn] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  // FOR MINTING
  const [how_many_bananas, set_how_many_bananas] = useState(1)

  const [bananaContract, setBananaContract] = useState(null)

  // INFO FROM SMART Contract

  const [totalSupply, setTotalSupply] = useState(0)

  const [saleStarted, setSaleStarted] = useState(false)

  const [bananaPrice, setBananaPrice] = useState(0)

  useEffect(async () => {

    signIn()

  }, [])

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      // Use existing gateway
      window.web3 = new Web3(window.ethereum);

    } else {
      alert("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
          // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
          .then((network) => { console.log(network); if (network != 'main') { alert("You are on " + network + " network. Change network to mainnet or you won't be able to do anything here") } });
        let wallet = accounts[0]
        setWalletAddress(wallet)
        setSignedIn(true)
        callContractData(wallet)

      })
      .catch(function (error) {
        // Handle error. Likely the user rejected the login
        console.error(error)
      })
  }

  //

  async function signOut() {
    setSignedIn(false)
  }

  async function callContractData(wallet) {
    // let balance = await web3.eth.getBalance(wallet);
    // setWalletBalance(balance)
    const bananaContract = new window.web3.eth.Contract(ABI, ADDRESS)
    setBananaContract(bananaContract)

    const salebool = await bananaContract.methods.saleIsActive().call()
    // console.log("saleisActive" , salebool)
    setSaleStarted(salebool)

    const totalSupply = await bananaContract.methods.totalSupply().call()
    setTotalSupply(totalSupply)

    const bananaPrice = await bananaContract.methods.bananaPrice().call()
    setBananaPrice(bananaPrice)

  }

  async function mintBanana(how_many_bananas) {
    if (bananaContract) {

      const price = Number(bananaPrice) * how_many_bananas

      const gasAmount = await bananaContract.methods.mintBoringBanana(how_many_bananas).estimateGas({ from: walletAddress, value: price })
      console.log("estimated gas", gasAmount)

      console.log({ from: walletAddress, value: price })

      bananaContract.methods
        .mintBoringBanana(how_many_bananas)
        .send({ from: walletAddress, value: price, gas: String(gasAmount) })
        .on('transactionHash', function (hash) {
          console.log("transactionHash", hash)
        })

    } else {
      console.log("Wallet not connected")
    }

  };





  return (
    <div id='mintbg' className='flex flex-col min-h-screen'>
      <Head>
        <title>Boring Lion Company</title>
        <link rel="icon" href="/images/favicon.jpg" />

        <meta property="og:title" content="Boring Bananas Co." key="ogtitle" />
        <meta property="og:description" content="Here at Boring Bananas company, we specialise in the world's finest digital bananas. We've put together a team spanning 3 continents, to bring you some of the most ‍NUTRITIOUS and DELICIOUS
bananas out known to man." key="ogdesc" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:url" content="https://boringbananas.co/" key="ogurl" />
        <meta property="og:image" content="https://boringbananas.co/images/Hola.gif" key="ogimage" />
        <meta property="og:site_name" content="https://boringbananas.co/" key="ogsitename" />

        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta property="twitter:domain" content="boringbananas.co" key="twdomain" />
        <meta property="twitter:url" content="https://boringbananas.co/" key="twurl" />
        <meta name="twitter:title" content="Boring Bananas Co." key="twtitle" />
        <meta name="twitter:description" content="Here at boring Bananas company, we specialise in the world's finest digital bananas. We've put together a team spanning 3 continents, to bring you some of the most ‍NUTRITIOUS and DELICIOUS
bananas out known to man." key="twdesc" />
        <meta name="twitter:image" content="https://boringbananas.co/images/Hola.gif" key="twimage" />
      </Head>

      <div className='container mx-auto'>
        <div className="flex items-center justify-between w-full pb-6">
          <a href="/" className=""><img src="images/logo.png" width="180" alt="" className="logo-image" /></a>
          <nav className="flex flex-wrap flex-row justify-around items-center">
            {signedIn ?
              <button className='hover:bg-yellow-400 hover:scale-110 transition-transform text-xl font-bold md:text-2xl bg-yallw rounded-full px-14 py-4'>{walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}</button>
              : <button className='hover:bg-yellow-400 hover:scale-110 transition-transform text-xl font-bold md:text-2xl bg-yallw rounded-full px-14 py-4' onClick={signIn}>Connect</button>
            }
          </nav>
        </div>
      </div>

      <div className='px-6 md:flex' style={{ minHeight: 'calc(100vh - 150px)' }}>

        <div className='hidden md:block self-end w-80'>
          <img src='images/lion.png' />
        </div>

        <div className='md:w-1/2 flex flex-col self-start justify-center items-center'>
          <div className="w-full md:w-2/3 relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-2xl inline-block py-1 px-2 uppercase rounded-full text-white">
                  Total Lions Minted
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl inline-block text-white">
                  0/8888
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-10 mb-4 flex rounded-xl bg-white">
              <div style={{ width: "30%" }} className="shadow-none rounded-xl flex flex-col text-center whitespace-nowrap text-white justify-center bg-gren"></div>
            </div>
          </div>
          <div id='buyBox' className='w-full lg:w-2/3'>
            <h1 className='text-5xl font-bold'><span className='text-blau'>Mint Your</span> <span className='text-yallw'>Lazy Lions</span></h1>
            <div id="mint" className="flex justify-around my-16">
              <span className="flex text-2xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3">MINT</span>
              <input type="number"
                min="1"
                max="20"
                value={how_many_bananas}
                onChange={e => set_how_many_bananas(e.target.value)} className=' py-3 px-1 rounded-md text-black outline-none font-bold text-2xl bg-gren' />
              <span className="flex text-2xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3">LIONS!</span>
            </div>
            {saleStarted ? <button className="rounded-full hover:bg-yellow-400 hover:scale-110 transition-transform w-full font-bold text-2xl bg-yallw text-black py-6" onClick={() => mintBanana(how_many_bananas)}>MINT {how_many_bananas} lions for {(bananaPrice * how_many_bananas) / (10 ** 18)} ETH + GAS</button> :
              <button className="rounded-full hover:bg-yellow-400 hover:scale-110 transition-transform w-full font-bold text-2xl bg-yallw text-black py-6 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>
            }
          </div>
        </div>

      </div>

    </div>
  )
}