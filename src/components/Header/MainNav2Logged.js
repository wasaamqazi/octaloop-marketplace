import React, { FC } from "react";
import { useState, useEffect } from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Navigation from "shared/Navigation/Navigation";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestoredb } from "../../firebase";
import { useAuth } from "../../firebase";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from "firebase/firestore";

const MainNav2Logged = () => {
  const currentUser = useAuth();
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

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
            toastId: "error1",
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
  const [user, setUser] = useState(null);

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
    if (signature != "") {
      // Add a new document in collection "cities"
      // Add a new document in collection "cities"
      await setDoc(doc(firestoredb, "signedUsers", walletAddress), {
        signed: true,
      });
    }
    // split signature
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log(r, s, v, accounts[0]);
  };
  const checkSignedAddress = async () => {
    const docRef = doc(firestoredb, "signedUsers", walletAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      signMessage("Smash NFTs");
    }
  };
  useEffect(() => {
    if (walletAddress) {
      checkSignedAddress();
    }

    // await window.ethereum.enable();
  }, [walletAddress]);
  useEffect(() => {
    const CurrentWallet = async () => {
      const { address } = await getCurrentWalletConnected();
      setWallet(address);
    };
    CurrentWallet();
    addWalletListener();
    // await window.ethereum.enable();
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User logged in
        setUser(userAuth);
      } else {
        // User logged out
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);
  // const checkFirebaseConnection = () => {
  //   if (user) {
  //   } else {
  //     toast.warning("Please Login to create items", {
  //       toastId: "loginWarning",
  //     });
  //   }
  // };
  return (
    <div className={`nc-MainNav2Logged relative z-10 ${"onTop "}`}>
      <div className="container py-5 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo />
          <div className="hidden sm:block flex-grow max-w-xs">
            <form action="" method="POST" className="relative">
              <Input
                type="search"
                placeholder="Search items"
                className="pr-10 w-full"
                sizeClass="h-[42px] pl-4 py-3"
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 text-neutral-500">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input type="submit" hidden value="" />
            </form>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            <Navigation />
            <div className="hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <div className="flex">
              <SwitchDarkMode />
              <NotifyDropdown />
            </div>
            <div></div>
            <ButtonPrimary
              href={"/page-upload-item"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            {/* <ButtonPrimary
           
              href={"/page-upload-multiple-items"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create Bulk
            </ButtonPrimary> */}
            <ButtonPrimary
              href={"/createcollection"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create Collection
            </ButtonPrimary>
            {/* <button
              className="connect-wallet"
              onClick={() => connectWalletPressed()}
            >
              {walletAddress.length > 0 ? (
                "Connected: " +
                String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)
              ) : (
                <span>Connect Wallet</span>
              )}
            </button> */}
            <Link className="connect-wallet" to="/connect-wallet">
              {walletAddress.length > 0 ? (
                <>
                  "Connected:"
                  {String(walletAddress).substring(0, 6) +
                    "..." +
                    String(walletAddress).substring(38)}
                </>
              ) : (
                <> Connect Wallet</>
              )}
            </Link>
            <div></div>
            {/* {console.log(currentUser)} */}

            <AvatarDropdown />
          </div>
          <div className="flex items-center space-x-3 xl:hidden">
            <NotifyDropdown />
            <AvatarDropdown />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
