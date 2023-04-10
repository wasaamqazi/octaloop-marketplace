import Label from "components/Label/Label";
import React, { FC, useState, useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import FormItem from "components/FormItem";
import { RadioGroup } from "@headlessui/react";
import { nftsImgs } from "contains/fakeData";
import MySwitch from "components/MySwitch";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import { pinFileToIPFS, pinJSONToIPFS } from "../utils/pinata";
import { toast } from "react-toastify";
import NcModal from "shared/NcModal/NcModal";
import { storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  listAll,
} from "firebase/storage";
import { mintNFT } from "../utils/interact";
//Firestore imports
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestoredb } from "../firebase";
import {
  uploadJSONToAWS,
  myBucket,
} from "../components/UploadImageToS3WithNativeSdk";
import { async } from "@firebase/util";
import { Link, useHistory } from "react-router-dom";
import imageTest from "images/BecomeAnAuthorImg.png";

// import Web3 from "web3";

const axios = require("axios");

const plans = [
  {
    name: "Crypto Legend 1- Professor",
    featuredImage: nftsImgs[0],
  },
  {
    name: "Crypto Legend 2- Professor",
    featuredImage: nftsImgs[1],
  },
  {
    name: "Crypto Legend 3- Professor",
    featuredImage: nftsImgs[2],
  },
  {
    name: "Crypto Legend 4- Professor",
    featuredImage: nftsImgs[3],
  },
  {
    name: "Crypto Legend 5- Professor",
    featuredImage: nftsImgs[4],
  },
  {
    name: "Crypto Legend 6- Professor",
    featuredImage: nftsImgs[5],
  },
];
//ENV Variables
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const PageUploadItem = ({ className = "" }) => {
  const history = useHistory();
  //States
  const [price, setPrice] = useState("");
  const [itemName, setItemName] = useState("");
  const [royalities, setRoyalities] = useState("");
  const [properties, setProperties] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [externalLink, setExternalLink] = useState("");
  const [description, setDescription] = useState("");
  const [imageUploaded, setImageUploaded] = useState([]);
  const [imageDisplay, setImageDisplay] = useState("none");
  const [firebaseImageLinks, setFirebaseImageLinks] = useState([]);

  //Modal
  const [isEditting, setIsEditting] = useState(false);

  const openModalEdit = () => setIsEditting(true);
  const closeModalEdit = () => setIsEditting(false);

  //Loading State
  const [loadingState, setLoadingState] = useState(false);

  const [selected, setSelected] = useState({ id: "", docData: {} });
  //States
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    setLoadingState(true);
    if (
      window.ethereum.selectedAddress == "" ||
      window.ethereum.selectedAddress == null ||
      !window.ethereum.selectedAddress
    ) {
      toast.error("Please Connect Wallet", { toastId: "errorWalletAddress" });
    } else {
      emptyAllFields();
      const q = query(
        collection(firestoredb, "collections"),
        where("walletAddress", "==", window.ethereum.selectedAddress)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size == 0) {
        setLoadingState(false);
      } else {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc);

          let tempDocData = collections;
          tempDocData.push({ id: doc.id, docData: doc.data() });

          setCollections(tempDocData);
          // setCollections((prevMovies) => [...prevMovies, tempDocData]);
          setLoadingState(false);

          // setCollections((current: Array<any>) => [
          //   ...current,
          //   { id: doc.id, docData: doc.data() },
          // ]);
        });
      }
    }
  };
  //useEffect data to get collections
  useEffect(() => {
    getCollections();
  }, [window.ethereum?.selectedAddress]);

  //Checking for validation if form fields are properly filled or not....
  function checkValidation() {
    if (selected === null || selected === undefined || selected.id === "") {
      toast.error("Please select collection!", {
        toastId: "errorCollection",
      });
      return false;
    } else if (
      itemName === "" ||
      itemName === null ||
      itemName === " " ||
      itemName === undefined
    ) {
      return false;
    } else if (
      price === "" ||
      price === null ||
      price === " " ||
      price === undefined
    ) {
      return false;
    } else if (
      externalLink === "" ||
      externalLink === null ||
      externalLink === " " ||
      externalLink === undefined
    ) {
      return false;
    } else if (
      description === "" ||
      description === null ||
      description === " " ||
      description === undefined
    ) {
      return false;
    } else if (selectedFile === null || selectedFile === undefined) {
      return false;
    } else {
      return true;
    }
  }
  const renderContent = () => {
    return (
      <form action="#">
        {/* <NcImage
          src={imageUploaded}
          containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
        /> */}
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Item Name
        </h4>
        <p>{itemName}</p>
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Price
        </h4>
        <p>{price}</p>
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Description
        </h4>
        <p>{description}</p>
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          External Link
        </h4>
        <p>{externalLink}</p>
        <div className="mt-8 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 right-0 flex items-center"></div>
        </div>
        <div className="mt-4 space-x-3">
          {/* <ButtonPrimary type="submit">Submit</ButtonPrimary> */}
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
  //upload to firebase
  const uploadImageToFirebase = async () => {
    console.log(multipleFiles);
    if (checkValidation() === false) {
      toast.error(" All fields are mandatory and must be valid!", {
        toastId: "errorValidation",
      });
    } else {
      if (!multipleFiles) {
        toast.error("Please select images!", {
          toastId: "errorValidation",
        });
        return { success: false };
      }
      setLoadingState(true);
      Array.from(multipleFiles).forEach((file, index) => {
        // setLoadingState(true);

        console.log(index + ":" + file);
        const storageRef = ref(storage, `/files/${file.name}`);
        console.log(storageRef);
        const element = file;

        const uploadTask = uploadBytesResumable(storageRef, element);
        uploadTask.on(
          "state_changed",
          async snapshot => {
            const percent =
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(percent);
            // setLoadingState(false);
          },
          err => {
            setLoadingState(false);
            console.log(err);
            return { success: false };
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async url => {
              console.log(url);
              let tempLink = firebaseImageLinks;
              if (!tempLink) return;
              tempLink.push(url);
              setFirebaseImageLinks(tempLink);
              if (index === multipleFiles.length - 1) {
                console.log(url);
                uploadToAwsS3Func();
                // uploadToPinataFunc();
                return { success: true };
              }
            });
          }
        );
      });
    }
  };
  //upload image to pinata
  const uploadImageToPinata = async () => {
    const metadata = { pinataMetadata: {}, pinataContent: {} };
    const url_pinata = `https://api.pinata.cloud/data/pinList?status=pinned`;

    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData);
    const pinataResponse = await pinFileToIPFS(formData);
    console.log(pinataResponse);
    //on error
    if (!pinataResponse) {
      // setLoadingState(false);
      toast.error("🦄 Error! Something went wrong");
      return {
        success: false,
        message: "Something went wrong while uploading your token",
        pinataUrl: "",
      };
    } else {
      //Successfully uploaded to ipfs
      // setLoadingState(false);
      toast.success("🦄 Image Uploaded Successfully!");
      return {
        success: true,
        message: "Image Uploaded Successfully!",
        pinataUrl: pinataResponse.pinataUrl,
      };
    }
  };
  // Upload button selected
  const uploadItemButtonClicked = async () => {
    setLoadingState(true);
    if (loadingState) {
      toast.info("Please Wait!", {
        toastId: "info1",
      });
    } else {
      const uploadFirebaseRes = await uploadImageToFirebase();
    }
  };
  function emptyAllFields() {
    setPrice("");
    setItemName("");
    setDescription("");
    setExternalLink("");
    setRoyalities("");
    setProperties("");
    setFileSize(0);
    setSelectedFile(null);
    setMultipleFiles(null);
    setImageUploaded([]);
  }
  async function uploadJSONTOAWSCustom(JSONBody, callback) {
    console.log(";;;;;;;;;;;;;;;;   mint ;;;;;;;;;;;;;;;;;;;");
    console.log(JSONBody);
    if (!JSONBody) {
      return callback({ success: false, msg: "JSON is empty", url: "" });
    } else {
      myBucket.listObjectsV2(
        {
          Delimiter: "",
          Prefix: "",
        },
        async (err, data) => {
          if (err) {
            return callback({ success: false, msg: err, url: "" });
            // return { success: false, msg: err, url: "" };
          }
          console.log(data.Contents.length);
          JSONBody.id = data.Contents.length;
          console.log(JSONBody);
          await myBucket
            .putObject({
              Key: data.Contents.length + 1 + ".json",
              Body: JSON.stringify(JSONBody),
              ContentType: "application/json",
            })
            .promise()
            .then(async res => {
              console.log(`Upload succeeded - `, res);
              //on error

              //Successfully uploaded to ipfs
              toast.success("File Uploaded Successfully!");
              // if (!awsResponse.url) return;
              let awsURL =
                "https://octaloop-marketplace.s3.ap-southeast-1.amazonaws.com/" +
                // "https://smashnftbucket.s3.ap-southeast-1.amazonaws.com/" +
                (data.Contents.length + 1) +
                ".json";
              console.log(awsURL);
              const status = await mintNFT(awsURL, price);
              emptyAllFields();
              console.log(status);
              // setLoadingState(false);
              setTimeout(() => {
                toast("Minted Successfully!");
                setLoadingState(false);
                history.push("/allcollections");
              }, 20000);

              // window.location.reload();

              return callback({
                success: true,
                msg: res,
                url: awsURL,
              });
            })
            .catch(err => {
              setLoadingState(false);
              toast.error("Error! Something went wrong");
              return callback({
                success: false,
                message: "Something went wrong while uploading your token",
              });
            });
        }
      );
    }
  }
  const uploadToAwsS3Func = async () => {
    setLoadingState(true);

    //Creating new metadata to be saved in ipfs in JSON format

    //  if (!selected.id) return;
    let jsonData = {
      // image: responseFromImageUpload.pinataUrl,
      image: firebaseImageLinks,
      price: price,
      name: itemName,
      collection: selected && selected != null ? selected.id : "",
      url: externalLink,
      description: description,
      royalities: royalities,
      fileSize: fileSize,
      properties: properties,
    };

    //Saving listed NFT to pinata
    const awsResponse = await uploadJSONTOAWSCustom(jsonData, result => {
      // console.log("AWS Response:", awsResponse);
      console.log("AWS Response: -----------", result);

      //on error
      // if (!awsResponse) {
      //   setLoadingState(false);
      //   toast.error("Error! Something went wrong");
      //   return {
      //     success: false,
      //     message: "Something went wrong while uploading your token",
      //   };
      // } else {
      //   // console.log("AWS Response:", awsResponse);
      //   //Successfully uploaded to ipfs
      //   toast.success("File Uploaded Successfully!");
      //   // if (!awsResponse.url) return;
      //   const status = await mintNFT(awsResponse.url, price);
      //   emptyAllFields();
      //   console.log(status);
      //   setLoadingState(false);
      //   // window.location.reload();
      // }
    });
  };
  const uploadToPinataFunc = async () => {
    setLoadingState(true);
    // let responseFromImageUpload = await uploadImageToPinata();
    // console.log(responseFromImageUpload);
    // if (!responseFromImageUpload) return;

    const metadata = { pinataMetadata: {}, pinataContent: {} };
    const url_pinata = `https://api.pinata.cloud/data/pinList?status=pinned`;

    //Getting total counts of previoulsy listed nfts
    axios
      .get(url_pinata, {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      })
      .then(async function (response) {
        //Creating new metadata to be saved in ipfs in JSON format
        metadata.pinataMetadata = {
          name: response.data.count + 1 + ".json",
        };
        //  if (!selected.id) return;
        metadata.pinataContent = {
          id: response.data.count + 1,
          // image: responseFromImageUpload.pinataUrl,
          image: firebaseImageLinks,
          price: price,
          name: itemName,
          collection: selected && selected != null ? selected.id : "",
          url: externalLink,
          description: description,
          royalities: royalities,
          fileSize: fileSize,
          properties: properties,
        };

        //Saving listed NFT to pinata
        const pinataResponse = await pinJSONToIPFS(metadata);

        //on error
        if (!pinataResponse) {
          setLoadingState(false);
          toast.error("Error! Something went wrong");
          return {
            success: false,
            message: "Something went wrong while uploading your token",
          };
        } else {
          console.log("Pinata Response:", pinataResponse);
          //Successfully uploaded to ipfs
          toast.success("File Uploaded Successfully!");
          const status = await mintNFT(pinataResponse.pinataUrl, price);
          emptyAllFields();
          console.log(status);
          setLoadingState(false);
          // window.location.reload();
        }
      })
      .catch(function (error) {
        //Error
        setLoadingState(false);
        toast.error("Error! Something went wrong");
        console.log(error);
      });
  };

  return (
    <div
      className={`nc-PageUploadItem ${className}`}
      data-nc-id="PageUploadItem">
      {" "}
      <Helmet>
        <title>Create Item || NFT React Template</title>
      </Helmet>
      {!window.ethereum || !window.ethereum.selectedAddress ? (
        <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
          {/* HEADER */}
          <header className="text-center max-w-2xl mx-auto space-y-2">
            <NcImage src={imageTest} />
            <span className="text-3xl xl:text-4xl font-semibold text-white-500">
              - Please connect your metamask wallet.
            </span>
          </header>
        </div>
      ) : (
        <div className="container">
          <NcModal
            isOpenProp={isEditting}
            onCloseModal={closeModalEdit}
            contentExtraClass="max-w-lg"
            renderContent={renderContent}
            renderTrigger={renderTrigger}
            modalTitle=""
          />

          <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
            {/* HEADING */}
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-semibold">
                Create New Item
              </h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You can set preferred display name, create your profile URL and
                manage other personal settings.
              </span>
            </div>
            <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
            <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold">
                  Image, Video, Audio, or 3D Model
                </h3>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                  OGG, GLB, GLTF. Max size: 100 MB
                </span>
                <div className="mt-5 ">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"></path>
                      </svg>
                      <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={e => {
                              const fileList = e.target.files;
                              if (fileList != null) setMultipleFiles(fileList);
                              if (!fileList) return;
                              setSelectedFile(fileList[0]);
                              setFileSize(fileList[0].size);
                              if (
                                fileList[0].type === "image/jpeg" ||
                                fileList[0].type === "image/png"
                              ) {
                                for (var i = 0; i < fileList.length; i++) {
                                  console.log(fileList[i]);
                                  let imageTemp = imageUploaded;
                                  console.log(imageTemp);
                                  if (!imageTemp) return;
                                  imageTemp.push(
                                    URL.createObjectURL(fileList[i])
                                  );
                                  setImageUploaded(imageTemp);
                                  // setImageUploaded((current: Array<any>) => [
                                  //   ...current,
                                  //   URL.createObjectURL(fileList[i]),
                                  // ]);
                                }

                                // setImageUploaded(
                                //   URL.createObjectURL(fileList[0])
                                // );
                                setImageDisplay("block");
                                console.log(imageUploaded);
                              } else {
                                setImageDisplay("none");
                              }
                            }}
                          />

                          {imageUploaded != null && imageUploaded.length > 0 ? (
                            imageUploaded.map((item, index) => {
                              return (
                                <img
                                  key={index}
                                  src={item}
                                  alt="preview image"
                                  style={{ display: imageDisplay }}
                                />
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- */}
              <FormItem label="Item Name">
                <Input
                  value={itemName}
                  placeholder="Item Name"
                  onChange={e => {
                    setItemName(e.target.value);
                  }}
                />
              </FormItem>
              {/* ---- */}
              <FormItem label="Price">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    ETH
                  </span>
                  <Input
                    value={price}
                    className="!rounded-l-none"
                    pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
                    placeholder="Price"
                    onChange={e => {
                      setPrice(p =>
                        e.target.validity.valid ? e.target.value : p
                      );
                    }}
                  />{" "}
                </div>
              </FormItem>
              {/* ---- */}
              <FormItem
                label="External link"
                desc="Smash NFT will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    https://
                  </span>
                  <Input
                    value={externalLink}
                    className="!rounded-l-none"
                    placeholder="abc.com"
                    onChange={e => {
                      setExternalLink(e.target.value);
                    }}
                  />
                </div>
              </FormItem>

              {/* ---- */}
              <FormItem
                label="Description"
                desc={
                  <div>
                    The description will be included on the item's detail page
                    underneath its image.{" "}
                    <span className="text-green-500">Markdown</span> syntax is
                    supported.
                  </div>
                }>
                <Textarea
                  value={description}
                  rows={6}
                  className="mt-1.5"
                  placeholder="..."
                  onChange={e => {
                    console.log(selected);
                    setDescription(e.target.value);
                  }}
                />
              </FormItem>

              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

              {/* --Collections-- */}
              <div>
                <Label>Choose collection</Label>
                <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Choose an exiting collection or create a new one
                </div>
                <RadioGroup value={selected} onChange={setSelected}>
                  <RadioGroup.Label className="sr-only">
                    Server size
                  </RadioGroup.Label>
                  <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
                    {collections &&
                    collections != null &&
                    collections.length > 0 ? (
                      collections.map((collec, index) => (
                        <RadioGroup.Option
                          key={index}
                          value={collec}
                          className={({ active, checked }) =>
                            `${
                              active
                                ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                                : ""
                            }
                  ${
                    checked
                      ? "bg-teal-600 text-white"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                    relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
                          }>
                          {({ active, checked }) => (
                            <>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <div className="flex items-center justify-between">
                                      <RadioGroup.Description
                                        as="div"
                                        className={"rounded-full w-16"}>
                                        <NcImage
                                          containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                          src={
                                            collec.docData
                                              ? collec.docData.collectionImage
                                              : ""
                                          }
                                        />
                                      </RadioGroup.Description>
                                      {checked && (
                                        <div className="flex-shrink-0 text-white">
                                          <CheckIcon className="w-6 h-6" />
                                        </div>
                                      )}
                                    </div>
                                    <RadioGroup.Label
                                      as="p"
                                      className={`font-semibold mt-3  ${
                                        checked ? "text-white" : ""
                                      }`}>
                                      {collec.docData
                                        ? collec.docData.collectionName
                                        : ""}
                                    </RadioGroup.Label>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))
                    ) : (
                      <>
                        <ButtonPrimary className="flex-1">
                          <Link to="/createCollection">Create Collection</Link>
                        </ButtonPrimary>
                      </>
                    )}
                  </div>
                </RadioGroup>
              </div>
              {/* --Collections End-- */}

              {/* ---- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
                {loadingState ? <div className="loader"></div> : <></>}
                {/* ---- */}
                <FormItem label="Royalties (%)">
                  <Input
                    value={royalities}
                    placeholder="20%"
                    onChange={e => {
                      setRoyalities(e.target.value);
                    }}
                  />
                </FormItem>
                {/* ---- */}
                <FormItem label="Size">
                  <Input
                    placeholder="0 Mb"
                    readOnly
                    value={Math.round(fileSize / 1024).toFixed(2) + " Kbs"}
                  />
                </FormItem>
                {/* ---- */}
                <FormItem label="Propertie">
                  <Input
                    value={properties}
                    placeholder="Propertie"
                    onChange={e => {
                      setProperties(e.target.value);
                    }}
                  />
                </FormItem>
              </div>

              {/* ---- */}
              <MySwitch enabled />

              {/* ---- */}
              <MySwitch
                label="Instant sale price"
                desc="Enter the price for which the item will be instantly sold"
              />

              {/* ---- */}
              <MySwitch
                enabled
                label="Unlock once purchased"
                desc="Content will be unlocked after successful transaction"
              />

              {/* ---- */}
              <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
                <ButtonPrimary
                  className="flex-1"
                  onClick={uploadItemButtonClicked}>
                  Upload item
                </ButtonPrimary>
                <ButtonSecondary className="flex-1" onClick={openModalEdit}>
                  Preview item
                </ButtonSecondary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PageUploadItem;
