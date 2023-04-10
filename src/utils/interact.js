import { pinJSONToIPFS } from "./pinata.js";
import Web3 from "web3/dist/web3.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import createBrowserHistory from "../utils/history";

const web3 = new Web3(window.ethereum);
// await window.ethereum.enable();
const contractABI = require("../abi/contract-abi.json");
const marketPlaceAbi = require("../abi/market-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const marketPlaceAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS;

export const TestContract = async () => {

  try {
    window.contract = await new web3.eth.Contract(marketPlaceAbi, marketPlaceAddress);
    // console.log(window.contract.methods.owner().call());

    window.contract.methods._nftCount().call()
      .then(data => {
        console.log(data); // access the resolved value of the promise
        // other code logic here
      })
      .catch(error => {
        console.error(error); // handle any errors that may occur
      });


  } catch (err) {
    console.log(err);
  }
};

export const mintNFT = async (url, price) => {

  //error handling
  if (url.trim() === "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }
  // var weiValue = web3.utils.toWei(price, "ether");

  // try {
  //   window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  //   //set up your Ethereum transaction
  //   const transactionParameters = {
  //     to: contractAddress, // Required except during contract publications.
  //     from: window.ethereum.selectedAddress, // must match user's active address.
  //     value: web3.utils.toHex(weiValue),
  //     data: window.contract.methods.SingleMintNFTs(url).encodeABI(), //make call to buy box
  //   };
  //   //sign the transaction via Metamask
  //   const txHash = await window.ethereum.request({
  //     method: "eth_sendTransaction",
  //     params: [transactionParameters],
  //   });
  // } catch (err) {
  //   console.log(err);
  // }

  try {
 
    window.contract = await new web3.eth.Contract(marketPlaceAbi, marketPlaceAddress);
    // console.log(window.contract.methods.owner().call());

    // window.contract.methods.SingleMinting(url).call()
    const transactionParameters = {
      to: marketPlaceAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      // value: web3.utils.toHex(weiValue),
      data: window.contract.methods.SingleMinting(url).encodeABI(), //make call to buy box
    };
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log("minted =========", txHash)

  } catch (error) {
    console.error(error);
  }
};

export const TokenURI = async (tokenID) => {
  try {
    window.contract = await new web3.eth.Contract(marketPlaceAbi, marketPlaceAddress);
    // console.log(window.contract.methods.owner().call());

    window.contract.methods.tokenURl(tokenID).call()
      .then(data => {
        console.log(data, "**************************************");
      })
      .catch(error => {
        console.error(error); // handle any errors that may occur
      });


  } catch (err) {
    console.log(err);
  }
}

export const bulkMintNFT = async (url, price, amount) => {
  //error handling
  for (var i = 0; i < url.length; i++) {
    if (url[i].trim() === "") {
      return {
        success: false,
        status: "❗Please make sure all fields are completed before minting.",
      };
    }
  }
  var weiValue = web3.utils.toWei(price, "ether");

  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //set up your Ethereum transaction
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: web3.utils.toHex(weiValue),
      data: window.contract.methods.BulkMintNFTs(amount, url).encodeABI(), //make call to buy box
    };
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
  } catch (err) {
    console.log(err);
  }
};
export const connectWallet = async () => {
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
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
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

export const getCurrentWalletConnected = async () => {
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
    } catch (err) {
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
            {" "}
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
//Function to get user's nfts
export const getNFTData = async () => {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  var nftData = [];
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    const nfts_data = await window.contract.methods
      .CheckTokenId(window.ethereum.selectedAddress)
      .call();
    console.log(window.contract.methods);
    //loop for fetching tokenIDs
    for (var i = 0; i < nfts_data.length; i++) {
      const url = await window.contract.methods.tokenURI(nfts_data[i]).call();

      const response = await fetch(url);

      if (!response.ok) {
        // throw new Error("Something went wrong!");
        console.log("Something went wrong!");
        continue;
      }
      const data = await response.json();
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
        contractAddress: window.contract._address,
        tokenId: nfts_data[i],
      };

      nftData.push(temp_data);

      // if (temp_data.collection === props.match.params.id) {
      //   await setUserNFTData((existingItems) => {
      //     return [...existingItems, temp_data];
      //   });
      // }
      if (i === nfts_data.length - 1) {
        return {
          success: true,
          msg: "Data Fetched Successfully",
          nftData: nftData,
        };
      }
    }
    if (nfts_data.length === 0) {
    }
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      msg: err,
      nftData: [],
    };
  }
};
export const getNFTDataDetail = async (reqTokenId) => {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  var nftData = [];
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    console.log(window.contract.methods);

    const url = await window.contract.methods.tokenURI(reqTokenId).call();

    const response = await fetch(url);

    if (!response.ok) {
      // throw new Error("Something went wrong!");
      console.log("Something went wrong!");
    }
    const data = await response.json();
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
      contractAddress: window.contract._address,
      tokenId: reqTokenId,
    };

    nftData.push(temp_data);

    // if (temp_data.collection === props.match.params.id) {
    //   await setUserNFTData((existingItems) => {
    //     return [...existingItems, temp_data];
    //   });
    // }

    return {
      success: true,
      msg: "Data Fetched Successfully",
      nftData: nftData,
    };
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      msg: err,
      nftData: [],
    };
  }
};
export const getApproved = async (tokenId) => {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    console.log(window.contract.methods);
    const approved = await window.contract.methods.getApproved(tokenId).call();
    console.log(approved);
    if (approved == "0x0000000000000000000000000000000000000000") {
      return {
        success: false,
        approved: false,
        msg: approved,
      };
    } else {
      return {
        success: true,
        approved: true,
        msg: approved,
      };
    }
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const approveTokenId = async (tokenId) => {
  console.log(tokenId);
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  console.log(window.ethereum.selectedAddress);
  try {
    window.contract1 = await new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //set up your Ethereum transaction
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.

      data: window.contract.methods
        .approve(marketPlaceAddress, tokenId)
        .encodeABI(), //make call to buy box
    };
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const listApprovedTokenId = async (tokenId, price, resell) => {
  console.log(tokenId);
  console.log(price);
  console.log(resell);

  const web3 = new Web3(window.ethereum);
  var weiValue = web3.utils.toWei(price, "ether");
  console.log(weiValue);
  await window.ethereum.enable();
  try {
    window.contractMarket = await new web3.eth.Contract(
      marketPlaceAbi,
      marketPlaceAddress
    );
    let transactionParameters = {};
    //set up your Ethereum transaction
    if (resell == true) {
      transactionParameters = {
        to: marketPlaceAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.

        data: window.contractMarket.methods
          .ReSellNft(tokenId, weiValue)
          .encodeABI(), //make call to buy box
      };
    } else {
      transactionParameters = {
        to: marketPlaceAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.

        data: window.contractMarket.methods
          .ListNft(tokenId, weiValue)
          .encodeABI(), //make call to buy box
      };
    }
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log(txHash);
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const cancelListApprovedTokenId = async (tokenId) => {
  console.log(tokenId);

  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  try {
    window.contractMarket = await new web3.eth.Contract(
      marketPlaceAbi,
      marketPlaceAddress
    );
    //set up your Ethereum transaction
    const transactionParameters = {
      to: marketPlaceAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: window.contractMarket.methods.CancelOffer(tokenId).encodeABI(), //make call to buy box
    };
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const buyListedTokenId = async (tokenId, price) => {
  console.log(tokenId);

  const web3 = new Web3(window.ethereum);
  var weiValue = web3.utils.toWei(price, "ether");

  await window.ethereum.enable();
  try {
    window.contractMarket = await new web3.eth.Contract(
      marketPlaceAbi,
      marketPlaceAddress
    );
    //set up your Ethereum transaction
    const transactionParameters = {
      to: marketPlaceAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: web3.utils.toHex(weiValue),
      data: window.contractMarket.methods.buyNft(tokenId).encodeABI(), //make call to buy box
    };
    //sign the transaction via Metamask
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const getListedNfts = async (tokenId) => {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  try {
    window.contractMarket = await new web3.eth.Contract(
      marketPlaceAbi,
      marketPlaceAddress
    );
    console.log(window.contractMarket.methods);
    const approved = await window.contractMarket.methods.getListedNfts().call();
    console.log("listedNFTS:", approved);
    return {
      result: approved,
    };
  } catch (err) {
    // toast.error("Something went wrong!", {
    //   toastId: "error1",
    // });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const getNftOwnerByToken = async (tokenId) => {
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    console.log(window.contract.methods);
    const approved = await window.contract.methods.ownerOf(tokenId).call();
    console.log("nft owner:", approved);

    return {
      owner: approved,
    };
  } catch (err) {
    toast.error("Something went wrong!", {
      toastId: "error1",
    });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
export const checkResellStatus = async (tokenId) => {
  console.log(tokenId);
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  try {
    window.contractMarket = await new web3.eth.Contract(
      marketPlaceAbi,
      marketPlaceAddress
    );
    console.log(window.contractMarket.methods);
    const approved = await window.contractMarket.methods.check(tokenId).call();
    console.log("Resell Status:", approved);
    return approved;
  } catch (err) {
    // toast.error("Something went wrong!", {
    //   toastId: "error1",
    // });
    console.log(err);
    return {
      success: false,
      approved: false,
      msg: err,
    };
  }
};
