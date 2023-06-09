import React, { FC, useState, useEffect, useRef } from "react";
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
import CardNFT3 from "components/CardNFT3";

//ABIs
const contractABI = require("../abi/contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const marketABI = require("../abi/market-abi.json");
const marketAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;

const PageCollection = props => {
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
  const [nftCount, setNftCount] = useState("");
  const [mynfts, setmynfts] = useState([]);
  const [uriarray, seturiarray] = useState([]);
  const unidataref = useRef([]);

  const printNfts = useRef([]);
  var allnfts = [];
  var promises = [];
  var token;

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
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    var nftData = [];
    try {
      window.contract = await new web3.eth.Contract(
        contractABI,
        contractAddress
      );
      window.contractMarket = await new web3.eth.Contract(
        marketABI,
        marketAddress
      );
      let nfts_data = [];
      console.log(window.ethereum.selectedAddress);
      if (
        window.ethereum?.selectedAddress?.toString().toLowerCase() ==
        collections?.walletAddress?.toString().toLowerCase()
      ) {
        // nfts_data = await window.contractMarket.methods
        // .CheckTokenId(window.ethereum.selectedAddress)
        //   .call();
        const result = await window.contractMarket.methods
          .getMyNfts(window.ethereum.selectedAddress)
          .call();
        console.log(result);
        setNftCount(result.length);
      } else {
        console.log("nai chal raha ****");
        let listed_nfts_data = await window.contractMarket.methods
          .getListedNfts()
          .call();
        listed_nfts_data.map(l => {
          console.log(l);
          nfts_data.push(l.tokenId);
        });
      }

      console.log(nfts_data, "pppppppppppppppppppppp");
      //loop for fetching tokenIDs

      var uri = await window.contract.methods.tokenURI(17).call();

      var token1;

      for (var i = 1; i <= nftCount; i++) {
        token1 = await window.contract.methods.tokenURI(i).call();
        console.log(token1);
        const response = await fetch(token1);
        if (!response.ok) {
          // toast.error("Something went wrong!", {
          //   toastId: "error1",
          // });
          // throw new Error("Something went wrong!");
          console.log("Something went wrong!");
          continue;
        }
        const data = await response.json();
        console.log(data);
        //Settings data
        const temp_data = {
          collection: data.collection ? data.collection : "",
          description: data.description,
          fileSize: data.fileSize,
          id: data.id,
          image: data.image,
          name: data.name,
          price: data.price,
          properties: data.properties,
          royalities: data.royalities,
          url: data.url,
          tokenId: nfts_data[i],
        };

        nftData.push(temp_data);
        if (temp_data.collection === props.match.params.id) {
          setUserNFTData(existingItems => {
            return [...existingItems, temp_data];
          });
        }
        setLoadingState(false);
      }
      if (nfts_data.length === 0) {
        setLoadingState(false);
      }
    } catch (err) {
      setLoadingState(false);
      // toast.error("Something went wrong!", {
      //   toastId: "error1",
      // });
      console.log(err);
    }
  };

  //useEffect data to get nfts
  useEffect(() => {
    setCollectionId(props.match.params.id);
    // setCoverImage(props.location.state.coverImage);
    // setCollectionImage(props.location.state.collectionImage)

    getCollections();
  }, []);

  useEffect(() => {
    // console.log("useeffect", mynfts );
  }, [mynfts]);

  // const setMyNftDataAfterCount = async () => {
  //   console.log(nftCount, "-=-=-=-=-=-=-=-=-=-=-=-=-=");

  //   await console.log("uriarray ", uriarray);

  //   setmynfts([]);
  //   mynfts.length = 0;

  //   for (var i = 1; i <= nftCount; i++) {
  //     await fetch(
  //       "https://octaloop-marketplace.s3.ap-southeast-1.amazonaws.com/" +
  //         i +
  //         ".json"
  //     )
  //       .then(response => response.json())
  //       .then(async data => {
  //         // console.log(data);
  //         setmynfts(prev => [...prev, data]);
  //       })
  //       .catch(error => {
  //         console.log("error ===", error);
  //       });
  //   }
  // };
  // useEffect(() => {
  //   if (nftCount > 0) {
  //     setMyNftDataAfterCount();
  //   }
  // }, [nftCount]);

  // ========================== ========================

  useEffect(() => {
    // console.log("useeffect", uriarray );
  }, [uriarray]);

  const settokenuris = async () => {
    seturiarray([]);
    setmynfts([]);


    mynfts.length = 0;
    for (var i = 1; i <= nftCount; i++) {
      try {
        token = await window.contract.methods.tokenURI(i).call();
        // await seturiarray(prev => [...prev, token]);
        await unidataref.current.push(token);
      } catch (error) {
        console.error(error);
      }
    }

    console.log("uriarray [[][][][][][][]", unidataref.current)

    unidataref.current.map(async dta => {
      // console.log("---------------", dta);

      await fetch(dta)
        .then(response => response.json())
        .then(async data => {
          // console.log(data);
          setmynfts(prev => [...prev, data]);
        })
        .catch(error => {
          console.log("error ===", error);
        });
      
    });

    // await console.log("***********", mynfts, "***********");
  };

  useEffect(() => {
    if (nftCount > 0) {
      settokenuris();
    }
  }, [nftCount]);

  // ==================================================

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
            {nftCount > 0 ? (
              // userNFTData.map((_, index) => <CardNFT key={index} nftData={_} />)
              <>
                {mynfts.map(data => {
                  return (
                    // <p>{data.name} </p>
                    <CardNFT3
                      id={data.id}
                      description={data.description}
                      image={data.image}
                      name={data.name}
                      price={data.price}
                      properties={data.properties}
                      royalities={data.royalities}
                      url={data.url}
                    />
                  );
                })}
              </>
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
