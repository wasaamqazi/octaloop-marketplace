import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import NcImage from "shared/NcImage/NcImage";
import CardNFT from "components/CardNFT";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import collectionBanner from "images/nfts/collectionBanner.png";
import { nftsImgs } from "contains/fakeData";
import NftMoreDropdown from "components/NftMoreDropdown";
import ButtonDropDownShare from "components/ButtonDropDownShare";
import TabFilters from "components/TabFilters";
import SectionSliderCollections from "components/SectionSliderCollections";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import Web3 from "web3/dist/web3.min.js";
import { toast } from "react-toastify";

//Firestore imports
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { firestoredb } from "../firebase";
import { async } from "@firebase/util";

//ABIs
const contractABI = require("../abi/contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const marketABI = require("../abi/market-abi.json");
const marketAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;

const PageCollection = (props) => {
  //States
  const [userNFTData, setUserNFTData] = useState([]);
  //Loading State
  const [loadingState, setLoadingState] = useState(false);

  //set collection id
  const [collections, setCollections] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionImage, setCollectionImage] = useState("");
const [MynftData ,setMynftData]= useState([])
const [Data ,setData]= useState([])

  const getCollections = async () => {
    setLoadingState(true);
    const docRef = doc(firestoredb, "collections", props.match.params.id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCollections(docSnap.data());
        console.log(docSnap.data());
        setCoverImage(docSnap.data().coverImage);
        setCollectionImage(docSnap.data().collectionImage);
        setCollectionName(docSnap.data().collectionName);
        setCollectionDescription(docSnap.data().description);
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Function to get user's nfts
  const getData = async () => {
    setUserNFTData([]);
    console.log(collections);
    //Loading Show
    setLoadingState(true);
    //Geting NFTs
    setUserNFTData([]);
    try {
     
      // Ethereum account private key
      // Initialize contract instance
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      window.contract = new web3.eth.Contract(marketABI, marketAddress);
      const result = await window.contract.methods
        .getMyListedNfts('0x27714c19ac098a0a7d914507aa3b9f7249007377')
        .call();
    //  console.log('resultMy', result.length);
      for (let index = 0; index < result.length; index++) {
        const element = result[index][0];
       // console.log('result Data of ....', element);
        // setData(prevState => [...prevState, element]);
        let tempArr = Data;
        tempArr.push(element);
        setData(tempArr);
      }
    
      
      console.log('calling transfer amount',Data);
    
    } catch (err) {
      console.log('Error of mynft', err);
    }
  };

  //useEffect data to get nfts
  useEffect(() => {
    setCollectionId(props.match.params.id);
    // setCoverImage(props.location.state.coverImage);
    // setCollectionImage(props.location.state.collectionImage);

    getCollections();
  }, []);
  //useEffect data to get nfts
  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        getData();
      }
    }
  }, [collections]);
  useEffect(() => {}, [userNFTData]);
  //return function
  return (
    <div data-nc-id="PageCollection">
      <Helmet>
        <title>Collection || Octaloop</title>
      </Helmet>
      {loadingState ? <div className="loader"></div> : <></>}
      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          <NcImage
            containerClassName="absolute inset-0"
            src={coverImage}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative container -mt-14 lg:-mt-20">
          <div className=" bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row lg:items-center">
            <div className="flex flex-col sm:flex-row md:block sm:items-start sm:justify-between">
              <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                <NcImage
                  src={collectionImage}
                  containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
                />
              </div>
              <div className="mt-4 flex items-center sm:justify-center space-x-3">
                {/* <div className="flex space-x-1.5 text-neutral-700 dark:text-neutral-300">
                  <a
                    href="##"
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
                  >
                    <i className="text-base sm:text-xl lab la-facebook-f"></i>
                  </a>
                  <a
                    href="##"
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
                  >
                    <i className="text-base sm:text-xl lab la-twitter"></i>
                  </a>
                </div>
                <div className="h-5 border-l border-neutral-200 dark:border-neutral-700"></div> */}
                {/* <div className="flex space-x-1.5">
                  <ButtonDropDownShare
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer "
                    panelMenusClass="origin-top-right !-right-5 !w-40 sm:!w-52"
                  />
                  <NftMoreDropdown
                    actions={[
                      {
                        id: "report",
                        name: "Report abuse",
                        icon: "las la-flag",
                      },
                      {
                        id: "delete",
                        name: "Delete item",
                        icon: "las la-trash-alt",
                      },
                    ]}
                    containerClassName="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
                  />
                </div> */}
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:ml-8 xl:ml-14 flex-grow">
              <div className="max-w-screen-sm ">
                <h2 className="inline-block text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  {collectionName}
                </h2>
                <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {collectionDescription}
                </span>
              </div>
              <div className="mt-6 xl:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 xl:gap-6">
                {/* ----- 1 ----- */}
                {/* <div className="rounded-2xl flex flex-col items-center justify-center shadow-md border border-neutral-50 dark:border-neutral-800 p-5 lg:p-6">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Floor Price
                  </span>
                  <span className="font-medium text-base mt-4 sm:text-xl sm:mt-6">
                    $295,481.62
                  </span>
                  <span className="text-xs text-green-500 mt-1">+2.11%</span>
                </div> */}

                {/* ----- Volume ----- */}
                {/* <div className="rounded-2xl flex flex-col items-center justify-center shadow-md border border-neutral-50 dark:border-neutral-800 p-5 lg:p-6">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Volume
                  </span>
                  <span className="font-medium text-base mt-4 sm:text-xl sm:mt-6">
                    $295,481.62
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    total
                  </span>
                </div> */}
                {/* ----- Latest Price ----- */}
                {/* <div className="rounded-2xl flex flex-col items-center justify-center shadow-md border border-neutral-50 dark:border-neutral-800 p-5 lg:p-6">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Latest Price
                  </span>
                  <span className="font-medium text-base mt-4 sm:text-xl sm:mt-6">
                    $295,481.62
                  </span>
                  <span className="text-xs text-green-500 mt-1"> --</span>
                </div> */}

                {/* -----Items ----- */}
                <div className="rounded-2xl flex flex-col items-center justify-center shadow-md border border-neutral-50 dark:border-neutral-800 p-5 lg:p-6">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Items
                  </span>
                  <span className="font-medium text-base mt-4 sm:text-xl sm:mt-6">
                    {userNFTData.length}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    total
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-20 lg:space-y-28">
        <main>
          {/* TABS FILTER */}
          <TabFilters />

          {/* LOOP ITEMS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
            {userNFTData.length > 0 ? (
              userNFTData.map((_, index) => <CardNFT key={index} nftData={_} />)
            ) : (
              <>No Items Found.</>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            {/* <Pagination /> */}
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div>
        </main>

        {/* === SECTION 5 === */}
        {/* <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div> */}

        {/* SUBCRIBES */}
        {/* <SectionBecomeAnAuthor /> */}
      </div>
    </div>
  );
};

export default PageCollection;
