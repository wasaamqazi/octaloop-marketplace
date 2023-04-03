import React, { FC, useState } from "react";
import { useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Helmet } from "react-helmet";
import NcModal from "shared/NcModal/NcModal";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import QrCodeImg from "images/qr-code.png";
import metamaskImg from "images/metamask.webp";
import walletconnectImg from "images/walletconnect.webp";
import walletlinkImg from "images/walletlink.webp";
import fortmaticImg from "images/fortmatic.webp";
import { toast } from "react-toastify";
import Web3 from "web3/dist/web3.min.js";

const plans = [
  {
    name: "Walletconnect",
    img: walletconnectImg,
  },
  {
    name: "Walletlink",
    img: walletlinkImg,
  },
  {
    name: "Fortmatic",
    img: fortmaticImg,
  },
];
const PageConnectWallet = () => {
  const [showModal, setShowModal] = useState(false);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      toast.error(
        " You must install Metamask, a virtual Ethereum wallet, in your browser.",
        {
          toastId: "error1",
        }
      );
      return {
        address: "",
        status: (
          <span>
            <p>
              🦊
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };
  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          toast.error("🦊 Connect to Metamask using the top right button.", {
            toastId: "error2",
          });
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      toast.error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser.!",
        {
          toastId: "error1",
        }
      );
      return {
        address: "",
        status: (
          <span>
            <p>
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();

    setWallet(walletResponse.address);
  };
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      toast.error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser.!",
        {
          toastId: "error1",
        }
      );
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(() => {
    const CurrentWallet = async () => {
      const { address } = await getCurrentWalletConnected();
      setWallet(address);
    };

    CurrentWallet();
    addWalletListener();
    // await window.ethereum.enable();
  }, []);
  const signMessage = async (msg) => {
    if (!window.ethereum) return alert("Please Install Metamask");

    // connect and get metamask account
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // message to sign
    const message = "hello";
    console.log({ message });

    // hash message
    // const hashedMessage = Web3.utils.sha3(message);
    const hashedMessage = msg;
    console.log({ hashedMessage });

    // sign hashed message
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [hashedMessage, accounts[0]],
    });
    console.log({ signature });

    // split signature
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log({ r, s, v, accounts });
  };
  // const saveTodo = (sig) => {
  //   const saveToFirebase = FireBase.firestore();
  //   saveToFirebase.collection("db_smashnft").add({
  //     id: uid(),
  //     signInTime: Date().toLocaleString(),
  //     owner: sig.address,
  //     message: sig.message,
  //     signature: sig.signature
  //   });
  // };
  useEffect(() => {
    // if (walletAddress) signMessage("Smash NFTs");

    // await window.ethereum.enable();
  }, [walletAddress]);
  // const renderContent = () => {
  //   return (
  //     <form action="#">
  //       <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
  //         Scan to connect
  //       </h3>
  //       <span className="text-sm">
  //         Open Coinbase Wallet on your mobile phone and scan
  //       </span>

  //       <div className="p-5 border bg-white dark:bg-neutral-300 border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center mt-4">
  //         <NcImage className="w-40" src={QrCodeImg} />
  //       </div>

  //       <div className="mt-5 space-x-3">
  //         <ButtonPrimary type="submit">Install app</ButtonPrimary>
  //         <ButtonSecondary type="button">Cancel</ButtonSecondary>
  //       </div>
  //     </form>
  //   );
  // };

  return (
    <div className={`nc-PageConnectWallet `} data-nc-id="PageConnectWallet">
      <Helmet>
        <title>Connect Wallet || NFT React Template</title>
      </Helmet>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-3xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Connect your wallet.
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              Connect with one of our available wallet providers or create a new
              one.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div className="space-y-3">
              {walletAddress.length > 0 ? (
                <div
                  className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
               border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
               focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
               dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center w-full">
                    <NcImage
                      src={metamaskImg}
                      containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                    />
                    <div
                      className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                    >
                      "Connected: "{" "}
                      {String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => connectWalletPressed(true)}
                  className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center w-full">
                    <NcImage
                      src={metamaskImg}
                      containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                    />
                    <div
                      className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                    >
                      Metamask
                    </div>
                  </div>
                </div>
              )}

              <div
                typeof="button"
                tabIndex={0}
                id="wallet-disable"
                className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={walletconnectImg}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Wallet Connect
                  </div>
                </div>
              </div>

              <div
                typeof="button"
                id="wallet-disable"
                className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
                border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={walletlinkImg}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Wallet link
                  </div>
                </div>
              </div>

              <div
                typeof="button"
                id="wallet-disable"
                className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={fortmaticImg}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Fortmatic
                  </div>
                </div>
              </div>
            </div>

            {/* ---- */}
            <div className="pt-2 ">
              <ButtonPrimary href={"/"} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 12H3.67004"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2">Go Back Home</span>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>

      {/* <NcModal
        renderTrigger={() => null}
        isOpenProp={showModal}
        renderContent={renderContent}
        contentExtraClass="max-w-md"
        onCloseModal={() => setShowModal(false)}
        modalTitle="Connect Wallet"
      /> */}
    </div>
  );
};

export default PageConnectWallet;
