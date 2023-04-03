import React, { FC, useState, useEffect } from "react";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import VerifyIcon from "components/VerifyIcon";
import { nftsLargeImgs, personNames } from "contains/fakeData";
import TimeCountDown from "./TimeCountDown";
import TabDetail from "./TabDetail";
import collectionPng from "images/nfts/collection.png";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import LikeButton from "components/LikeButton";
import AccordionInfo from "./AccordionInfo.jsx";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import {
  approveTokenId,
  getApproved,
  getNFTData,
  listApprovedTokenId,
  getListedNfts,
  getNftOwnerByToken,
  cancelListApprovedTokenId,
  checkResellStatus,
  getNFTDataDetail,
  buyListedTokenId,
} from "../../utils/interact";
import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import { async } from "@firebase/util";
import Input from "shared/Input/Input";
import NcModal from "shared/NcModal/NcModal";
import web3 from "web3";

declare var window: any;
//ABIs
const contractABI = require("../../abi/contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const marketPlaceAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;

export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  const location = useLocation();
  let listedNfts: any = null;
  //States
  const [price, setPrice] = useState("");
  const [resell, setResell] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [nftOwner, setNftOwner] = useState(false);
  const [seller, setSeller] = useState(false);
  const [isBought, setIsBought] = useState(false);
  const [userNFTData, setUserNFTData] = useState({
    name: "",
    id: "",
    image: [],
    price: "",
    description: "",
    fileSize: "",
    contractAddress: "",
    tokenId: "",
  });
  //Loading State
  const [loadingState, setLoadingState] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [walletStatus, setWalletStatus] = useState<any>("");

  //Modal
  const [isEditting, setIsEditting] = useState(false);

  const openModalEdit = () => setIsEditting(true);
  const closeModalEdit = () => setIsEditting(false);

  const renderContent = () => {
    return (
      <form action="#">
        {/* <NcImage
          src={imageUploaded}
          containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
        /> */}
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          List this Item for{" "}
          <span className="text-3xl xl:text-2xl font-semibold text-green-500">
            {userNFTData.price} ETH
          </span>
          ?
        </h4>

        <div className="mt-8 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 right-0 flex items-center"></div>
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary type="button" onClick={listApprovedTokens}>
            Submit
          </ButtonPrimary>
          <ButtonSecondary type="button" onClick={closeModalEdit}>
            Close
          </ButtonSecondary>
        </div>
      </form>
    );
  };

  const renderTrigger = () => {
    return null;
  };
  //Function to get user's nfts
  const getData = async () => {
    //Loading Show
    setLoadingState(true);
    //Geting NFTs
    const result = location.pathname.split(/[.\-&=/_]/);
    const userNFTDataResult = await getNFTDataDetail(result[4]);

    if (!userNFTDataResult) return;
    if (userNFTDataResult.success) {
      await userNFTDataResult.nftData.map(async (nData, index) => {
        if (nData.collection == result[3] && nData.tokenId == result[4]) {
          await setUserNFTData(nData);
        }
      });
      setLoadingState(false);
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
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err: any) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
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
      window.ethereum.on("accountsChanged", (accounts: any) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setWalletStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setWalletStatus("🦊 Connect to Metamask using the top right button.");
        }
        window.location.reload();
      });
    } else {
      setWalletStatus(
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
  //Check if tokenID is approved or not
  const checkTokenIdApprove = async () => {
    const result = location.pathname.split(/[.\-&=/_]/);
    console.log(userNFTData);
    const approvedRes = await getApproved(result[4]);
    setApproved(approvedRes.approved);
    console.log(approvedRes);
  };
  const setApproveTokenId = async () => {
    setLoadingState(true);
    if (loadingState) {
      toast("Please wait!", {
        toastId: "waitId",
      });
    } else {
      const result = location.pathname.split(/[.\-&=/_]/);

      const approveStatus = await approveTokenId(result[4]);
      setTimeout(() => {
        // toast("Approved Successfully!");
        setLoadingState(false);
        window.location.reload();
      }, 20000);
    }
  };
  const listApprovedTokens = async () => {
    setLoadingState(true);
    console.log("userNFTData", userNFTData);
    if (loadingState) {
      toast("Please wait!", {
        toastId: "waitId",
      });
    } else {
      const approveStatus = await listApprovedTokenId(
        userNFTData.tokenId,
        userNFTData.price,
        resell
      );
      console.log(approveStatus);
      setTimeout(() => {
        toast("Listed Successfully!");
        setLoadingState(false);
        window.location.reload();
      }, 20000);
    }
  };
  const getListedNftsInContract = async () => {
    const result = location.pathname.split(/[.\-&=/_]/);

    listedNfts = await getListedNfts(result[4]);
    if (listedNfts && listedNfts.result && listedNfts.result.length > 0) {
      console.log(listedNfts);
      listedNfts?.result?.map((n: any) => {
        console.log(n);

        if (n.tokenId == userNFTData.tokenId) {
          console.log("hello");
          setIsListed(true);
          const etherValue = n.price / 1000000000000000000;
          setPrice(etherValue.toString());
          userNFTData.price = etherValue.toString();
          console.log(etherValue);
          if (
            n.seller.toString().toLowerCase() ==
            window.ethereum.selectedAddress.toString().toLowerCase()
          ) {
            setSeller(true);
          }
        }
      });
    }
    console.log(isListed, nftOwner);
  };
  const getNftOwner = async () => {
    const result = location.pathname.split(/[.\-&=/_]/);

    const ownerStatus = await getNftOwnerByToken(result[4]);
    if (
      ownerStatus.owner.toString().toLowerCase() ==
      window.ethereum.selectedAddress.toString().toLowerCase()
    ) {
      setNftOwner(true);
    } else {
      setNftOwner(false);
    }
    console.log(ownerStatus);
  };
  const cancelListedToken = async () => {
    setLoadingState(true);
    if (loadingState) {
      toast("Please wait!", {
        toastId: "waitId",
      });
    } else {
      const result = location.pathname.split(/[.\-&=/_]/);
      const cancelStatus = await cancelListApprovedTokenId(result[4]);
      setTimeout(() => {
        toast("Cancelled Successfully!");
        setLoadingState(false);
        window.location.reload();
      }, 20000);
      console.log(cancelStatus);
    }
  };
  const buyListedToken = async () => {
    setLoadingState(true);
    if (loadingState) {
      toast("Please wait!", {
        toastId: "waitId",
      });
    } else {
      const result = location.pathname.split(/[.\-&=/_]/);
      const cancelStatus = await buyListedTokenId(result[4], userNFTData.price);
      setTimeout(() => {
        toast("Transaction Successfully!");
        setLoadingState(false);

        window.location.reload();
      }, 20000);
      console.log(cancelStatus);
    }
  };
  const getResellStatus = async () => {
    const result = location.pathname.split(/[.\-&=/_]/);
    const resellStatus = await checkResellStatus(result[4]);
    console.log(resellStatus);
    if (resellStatus[0] == true) {
      setResell(true);
    } else {
      setResell(false);
    }
  };

  //useEffect data to get nfts
  useEffect(() => {
    getData();
  }, []);
  //useEffect data to get nfts
  useEffect(() => {
    checkTokenIdApprove();
  }, []);
  useEffect(() => {
    getListedNftsInContract();
  }, [userNFTData]);
  useEffect(() => {
    getNftOwner();
  }, []);
  useEffect(() => {
    getResellStatus();
  }, []);
  useEffect(() => {
    console.log(listedNfts);
  }, [listedNfts]);
  useEffect(() => {
    setPrice(userNFTData.price);
  }, [userNFTData]);
  useEffect(() => {
    console.log("approved", approved);
    console.log("isListed", isListed);
    console.log("nftOwner", nftOwner);
    console.log("seller", seller);
  }, [userNFTData]);
  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {loadingState ? <div className="loader"></div> : <></>}
        <NcModal
          isOpenProp={isEditting}
          onCloseModal={closeModalEdit}
          contentExtraClass="max-w-lg"
          renderContent={renderContent}
          renderTrigger={renderTrigger}
          modalTitle="Price Confirmation"
        />
        {/* ---------- 1 ----------  */}
        <div className="pb-9 space-y-5">
          <div className="flex justify-between items-center">
            <Badge name="Virtual Worlds" color="green" />
            <LikeSaveBtns />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {userNFTData.name + " #" + userNFTData.id}
          </h2>

          {/* ---------- 4 ----------  */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center ">
              <Avatar sizeClass="h-9 w-9" radius="rounded-full" />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{personNames[1]}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Avatar
                imgUrl={collectionPng}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{"The Moon Ape"}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
          </div> */}
        </div>

        {/* ---------- 6 ----------  */}
        {/* <div className="py-9">
          <TimeCountDown />
        </div> */}

        {/* ---------- 7 ----------  */}
        {/* PRICE */}
        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                Current Bid
              </span>
              <span className="text-3xl xl:text-4xl font-semibold text-green-500">
                {approved && !isListed && nftOwner ? (
                  <>
                    {" "}
                    <Input
                      value={price}
                      pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
                      placeholder="Price"
                      onChange={(e) => {
                        setPrice((p) =>
                          e.target.validity.valid ? e.target.value : p
                        );
                        userNFTData.price = e.target.validity.valid
                          ? e.target.value
                          : userNFTData.price;
                      }}
                    />
                    ETH
                  </>
                ) : (
                  <>{userNFTData.price} ETH</>
                )}
              </span>
              {/* <span className="text-lg text-neutral-400 sm:ml-5">
                ( ≈ $3,221.22)
              </span> */}
            </div>

            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-5 mt-2 sm:mt-0 sm:ml-10">
              [96 in stock]
            </span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {!approved && !isListed && nftOwner ? (
              <ButtonPrimary onClick={setApproveTokenId} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">Approve</span>
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {approved && !isListed && nftOwner ? (
              <ButtonPrimary onClick={openModalEdit} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">List</span>
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {isListed && seller ? (
              <ButtonPrimary onClick={cancelListedToken} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">Cancel</span>
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {isListed && !nftOwner && !seller ? (
              <ButtonPrimary onClick={buyListedToken} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">Buy</span>
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {/* <ButtonSecondary href={"/connect-wallet"} className="flex-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.57007 15.27L15.11 8.72998"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.98001 10.3699C9.65932 10.3699 10.21 9.81923 10.21 9.13992C10.21 8.46061 9.65932 7.90991 8.98001 7.90991C8.3007 7.90991 7.75 8.46061 7.75 9.13992C7.75 9.81923 8.3007 10.3699 8.98001 10.3699Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.52 16.0899C16.1993 16.0899 16.75 15.5392 16.75 14.8599C16.75 14.1806 16.1993 13.6299 15.52 13.6299C14.8407 13.6299 14.29 14.1806 14.29 14.8599C14.29 15.5392 14.8407 16.0899 15.52 16.0899Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="ml-2.5"> Make offer</span>
            </ButtonSecondary> */}
          </div>
        </div>

        {/* ---------- 9 ----------  */}
        <div className="pt-9">
          <TabDetail />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-NftDetailPage  ${className}`}
      data-nc-id="NftDetailPage"
    >
      {/* MAIn */}
      <main className="container mt-11 flex ">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* CONTENT */}
          <div className="space-y-8 lg:space-y-10">
            {/* HEADING */}
            <div className="relative">
              <NcImage
                src={userNFTData.image[0]}
                containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden"
              />
              {/* META TYPE */}
              <ItemTypeVideoIcon className="absolute left-3 top-3  w-8 h-8 md:w-10 md:h-10" />

              {/* META FAVORITES */}
              <LikeButton className="absolute right-3 top-3 " />
            </div>

            <AccordionInfo
              state={{
                description: userNFTData.description,
                fileSize: userNFTData.fileSize,
                contractAddress: userNFTData.contractAddress,
                tokenId: userNFTData.tokenId,
              }}
            />
          </div>

          {/* SIDEBAR */}
          <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
            {renderSection1()}
          </div>
        </div>
      </main>

      {/* OTHER SECTION */}
      {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          <div className="relative py-24 lg:py-28">
            <BackgroundSection />
            <SectionSliderCategories />
          </div>

          {/* SECTION */}
          <SectionBecomeAnAuthor className="pt-24 lg:pt-32" />
        </div>
      )}
    </div>
  );
};

export default NftDetailPage;
