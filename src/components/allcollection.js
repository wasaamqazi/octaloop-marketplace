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
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CollectionCard from "./CollectionCard";
import CollectionCard2 from "./CollectionCard2";
import { Link } from "react-router-dom";
import Nav from "shared/Nav/Nav";
import NavItem2 from "./NavItem2";
import Next from "shared/NextPrev/Next";
import Prev from "shared/NextPrev/Prev";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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
const MyCollectionCard = CollectionCard2;
const AllCollection = (props) => {
  //States
  const [userNFTData, setUserNFTData] = useState([]);
  //Loading State

  //set collection id

  const [collectionId, setCollectionId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionImage, setCollectionImage] = useState("");
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  //States
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const getCollections = async () => {
    setLoadingState(true);

    const q = query(
      collection(firestoredb, "collections"),
      where("walletAddress", "==", window.ethereum.selectedAddress)
    );
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let tempDocData = collections;
      tempDocData.push({ id: doc.id, docData: doc.data() });
      setCollections(tempDocData);
    });

    setLoadingState(false);
  };
  //useEffect data to get collections
  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div data-nc-id="PageCollection">
      <Helmet>
        <title>Collection || Smash NFT</title>
      </Helmet>
      {loadingState ? <div className="loader"></div> : <></>}
      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          {/* <NcImage
            containerClassName="absolute inset-0"
            src={coverImage}
            className="object-cover w-full h-full"
          /> */}
        </div>
        <div className="relative container -mt-14 lg:-mt-20">
          <div className=" bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row lg:items-center">
            <div className="flex flex-col sm:flex-row md:block sm:items-start sm:justify-between">
              {/* <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                <NcImage
                  src={collectionImage}
                  containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
                />
              </div> */}
              <div className="mt-4 flex items-center sm:justify-center space-x-3"></div>
            </div>
            <div
              className="mt-5 md:mt-0 md:ml-8 xl:ml-14 flex-grow"
              style={{ minWidth: "280px" }}
            >
              <div className="max-w-screen-sm ">
                <h2 className="inline-block text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  My Collections
                </h2>
                <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {collectionDescription}
                </span>
              </div>
              <div className="mt-6 xl:mt-8 ">
                <div className="rounded-2xl flex flex-col items-center justify-center shadow-md border border-neutral-50 dark:border-neutral-800 p-5 lg:p-6">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Items
                  </span>
                  <span className="font-medium text-base mt-4 sm:text-xl sm:mt-6">
                    {collections.length}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    total
                  </span>
                </div>
              </div>
            </div>
            <div className="btn-col">
              <Link
                className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium px-4 py-2 sm:px-5  ttnc-ButtonPrimary disabled:bg-opacity-70 bg-primary-6000 hover:bg-primary-700 text-neutral-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 "
                to="/createcollection"
              >
                Create Collection
              </Link>
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
          <div className="grid sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-7  mt-8 lg:mt-10">
            {/* {loadingState ? <div className="loader"></div> : <></>} */}
            {collections && collections != null && collections.length > 0 ? (
              collections.map((collec, index) => (
                <div className="p-4" key={index}>
                  <li className="list-none	">
                    <MyCollectionCard
                      id={collec.id}
                      collectionName={collec.docData.collectionName}
                      creatorName={
                        collec.docData.collectionUserName
                          ? collec.docData.collectionUserName
                          : ""
                      }
                      creatorPhoto={
                        collec.docData.collectionUserPhotoURL
                          ? collec.docData.collectionUserPhotoURL
                          : ""
                      }
                      creatorUID={
                        collec.docData.collectionUserUID
                          ? collec.docData.collectionUserUID
                          : ""
                      }
                      imgs={[
                        collec.docData.coverImage,
                        collec.docData.collectionImage,
                        "https://images.unsplash.com/photo-1581985673473-0784a7a44e39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
                        "https://images.unsplash.com/photo-1557264305-7e2764da873b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
                      ]}
                    />
                  </li>
                </div>
              ))
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

export default AllCollection;
