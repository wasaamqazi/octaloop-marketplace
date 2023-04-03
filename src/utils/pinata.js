// const key = process.env.REACT_APP_PINATA_KEY;
// const secret = process.env.REACT_APP_PINATA_SECRET;

const key = "2b0109d7bec55ce6703a";
const secret =
  "c0747691dff26870caf2b45d64282a1d0bf35f66d224c3ed0bd32da2491e004f";

const axios = require("axios");

export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //axios POST Request to pinata
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        ipfsHash: response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
export const pinFileToIPFS = async (file) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  //axios POST Request to pinata
  return axios
    .post(url, file, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
   
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
