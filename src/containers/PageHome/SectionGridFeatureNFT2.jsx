import React, { FC, useState, useEffect } from "react";
import HeaderFilterSection from "components/HeaderFilterSection";
import CardNFT2 from "components/CardNFT2";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Web3 from "web3/dist/web3.min.js";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

//ABIs
const contractABI = require("../../abi/contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const marketABI = require("../../abi/market-abi.json");
const marketAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;
//

const SectionGridFeatureNFT2 = (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User logged in
        setUser(userAuth);
      } else {
        // User logged out
        setUser(null);
      }
    });
  }, []);
  //States
  const [userNFTData, setUserNFTData] = useState([]);
  //Loading State
  const [loadingState, setLoadingState] = useState(false);
  //Function to get user's nfts
  const getData = async () => {
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
      // const nfts_data = await window.contract.methods
      //   .CheckTokenId(window.ethereum.selectedAddress)
      //   .call();
      const listed_nfts_data = await window.contractMarket.methods
        .getListedNfts()
        .call();
      console.log(listed_nfts_data);
      //loop for fetching tokenIDs
      for (var i = 0; i < listed_nfts_data.length; i++) {
        const url = await window.contract.methods
          .tokenURI(listed_nfts_data[i].tokenId)
          .call();
        const response = await fetch(url);
        if (!response.ok) {
          // toast.error("Something went wrong!", {
          //   toastId: "error1",
          // });
          // throw new Error("Something went wrong!");
          setLoadingState(false);

          continue;
        }
        const data = await response.json();
        const etherValue = listed_nfts_data[i].price / 1000000000000000000;
        //Settings data
        const temp_data = {
          collection: data.collection ? data.collection : "",
          description: data.description,
          fileSize: data.fileSize,
          id: data.id,
          image: data.image,
          name: data.name,
          price: etherValue ? etherValue : data.price,
          properties: data.properties,
          royalities: data.royalities,
          url: data.url,
          tokenId: listed_nfts_data[i].tokenId,
        };
        nftData.push(temp_data);

        await setUserNFTData((existingItems) => {
          return [...existingItems, temp_data];
        });

        setLoadingState(false);
      }
      if (listed_nfts_data.length === 0) {
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
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {}, [userNFTData]);

  return (
    <div className="nc-SectionGridFeatureNFT2 relative">
      <HeaderFilterSection />
      {!window.ethereum || !window.ethereum.selectedAddress ? (
        <>
          <span className="text-3xl xl:text-4xl font-semibold text-white-500">
            - Please connect your metamask wallet.
          </span>
        </>
      ) : (
        <div className={`grid gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3`}>
          {/* <div className="pt-8"></div> */}
          {userNFTData.map((_, index) => (
            <CardNFT2 key={index} nftData={_} />
          ))}
        </div>
      )}
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeatureNFT2;
