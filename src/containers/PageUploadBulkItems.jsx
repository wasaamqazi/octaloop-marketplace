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
import imageTest from "images/BecomeAnAuthorImg.png";
import NcModal from "shared/NcModal/NcModal";
import { storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  listAll,
} from "firebase/storage";
import { bulkMintNFT, mintNFT } from "../utils/interact";
//Firestore imports
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestoredb } from "../firebase";
import {
  uploadJSONToAWS,
  myBucket,
} from "../components/UploadImageToS3WithNativeSdk";
import { async } from "@firebase/util";
import { Link, useHistory } from "react-router-dom";

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
const PageUploadItem = ({ className = "" }) => {
  const history = useHistory();

  //States
  const [jsonData, setJsonData] = useState([]);
  const [price, setPrice] = useState("");
  const [itemName, setItemName] = useState("");
  const [bulkAmount, setBulkAmount] = useState(1);
  const [royalities, setRoyalities] = useState("");
  const [properties, setProperties] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState();
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
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          let tempDocData = collections;
          tempDocData.push({ id: doc.id, docData: doc.data() });
          setCollections(tempDocData);
          setLoadingState(false);
        });
      }
    }
  };
  //useEffect data to get collections
  useEffect(() => {
    getCollections();
  }, [window.ethereum?.selectedAddress]);
  //Get JSON Data into state from json files
  const getJsonData = (jsonFile) => {
    fetch(jsonFile, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setJsonData((prevJson) => [...prevJson, myJson]);
      });
  };
  //Checking for validation if form fields are properly filled or not....
  function checkValidation() {
    console.log(multipleFiles);
    console.log(selectedFile);
    if (selected === null || selected === undefined || selected.id === "") {
      toast.error("Please select collection!", {
        toastId: "errorCollection",
      });
      return false;
    } else if (price === null || price === undefined || price === "") {
      toast.error("Please select price!", {
        toastId: "errorPrice",
      });
      return false;
    } else if (bulkAmount != multipleFiles?.length) {
      toast.error("Bulk Amount must be equal to file selected", {
        toastId: "bulkAmountFileError",
      });
      return false;
    } else if (bulkAmount < 1) {
      toast.error("Bulk Amount must be 1 or higher", {
        toastId: "bulkAmountError",
      });
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
        <NcImage
          src={imageUploaded}
          containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
        />
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
    console.log(jsonData);
    if (checkValidation() === false) {
      toast.error(" All fields are mandatory and must be valid!", {
        toastId: "errorValidation",
      });
    } else {
      if (loadingState) {
        toast.info("Please Wait!", {
          toastId: "info1",
        });
      } else {
        if (!multipleFiles) {
          toast.error("Please select images!", {
            toastId: "errorValidation",
          });
          return { success: false };
        }
        setLoadingState(true);
        await Array.from(multipleFiles).forEach((file, index) => {
          // setLoadingState(true);

          const storageRef = ref(storage, `/jsonFiles/${file.name}`);
          const element = file;

          const uploadTask = uploadBytesResumable(storageRef, element);
          uploadTask.on(
            "state_changed",
            async (snapshot) => {
              const percent =
                (await Math.round(
                  snapshot.bytesTransferred / snapshot.totalBytes
                )) * 100;
              // setLoadingState(false);
            },
            (err) => {
              setLoadingState(false);
              console.log(err);
              return { success: false };
            },
            async () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                let tempLink = firebaseImageLinks;
                if (!tempLink) return;
                tempLink.push(url);
                setFirebaseImageLinks(tempLink);
                if (index === multipleFiles.length - 1) {
                  uploadToAwsS3Func();
                  return { success: true };
                }
              });
            }
          );
        });
      }
    }
  };

  // Upload button selected
  const uploadItemButtonClicked = async () => {
    const uploadFirebaseRes = await uploadImageToFirebase();
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
    setImageUploaded([]);
  }
  async function uploadJSONTOAWSCustom(JSONBody, callback) {
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
          }

          let currentKey = data.Contents.length + 1;
          let awsURL = [];
          for (var i = 0; i < jsonData.length; i++) {
            currentKey = currentKey + i;
            jsonData[i].id = currentKey;
            jsonData[i].collection =
              selected && selected != null ? selected.id : "";
            jsonData[i].price = price;
            await myBucket
              .putObject({
                Key: currentKey + ".json",
                Body: JSON.stringify(jsonData[i]),
                ContentType: "application/json",
              })
              .promise()
              .then(async (res) => {
                //Successfully uploaded to ipfs
                toast.success("File Uploaded Successfully!");
                // if (!awsResponse.url) return;
                awsURL.push(
                  `https://octaloop-marketplace.s3.ap-southeast-1.amazonaws.com/${currentKey}.json`
                  // `https://smashnftbucket.s3.ap-southeast-1.amazonaws.com/${currentKey}.json`
                );

                if (i == jsonData.length - 1) {
                  const status = await bulkMintNFT(awsURL, price, bulkAmount);
                  emptyAllFields();
                  // setLoadingState(false);
                  // window.location.reload();
                  setTimeout(() => {
                    toast("Minted Successfully!");
                    setLoadingState(false);
                    history.push("/allcollections");
                  }, 20000);
                  return callback({
                    success: true,
                    msg: res,
                    url: awsURL,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                setLoadingState(false);
                toast.error("Error! Something went wrong");
                return callback({
                  success: false,
                  message: "Something went wrong while uploading your token",
                });
              });
          }
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
    const awsResponse = await uploadJSONTOAWSCustom(jsonData, (result) => {});
  };

  return (
    <div
      className={`nc-PageUploadItem ${className}`}
      data-nc-id="PageUploadItem"
    >
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
                Create New Bulk Items
              </h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You can set preferred display name, create your profile URL and
                manage other personal settings.
              </span>
            </div>
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
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <div className="flex items-center justify-between">
                                    <RadioGroup.Description
                                      as="div"
                                      className={"rounded-full w-16"}
                                    >
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
                                    }`}
                                  >
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
            <FormItem label="Bulk Amount">
              <Input
                value={bulkAmount}
                pattern="[0-9]*"
                placeholder="Bulk Amount"
                onChange={(e) => {
                  setBulkAmount((b) =>
                    e.target.validity.valid ? e.target.value : b
                  );
                }}
              />
            </FormItem>
            <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold">
                  Upload Files
                </h3>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  File types supported: JSON. Max size: 100 MB
                </span>
                <div className="mt-5 ">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload JSON files</span>
                          <input
                            id="file-upload"
                            multiple
                            accept=".json"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              setSelectedFile(null);
                              setFileSize(null);
                              setImageUploaded(null);
                              const fileList = e.target.files;
                              console.log(fileList);
                              if (fileList != null) setMultipleFiles(fileList);
                              if (!fileList) return;
                              setSelectedFile(fileList[0]);
                              setFileSize(fileList[0].size);
                              if (fileList[0].type === "application/json") {
                                for (var i = 0; i < fileList.length; i++) {
                                  let imageTemp = imageUploaded;
                                  if (!imageTemp) return;
                                  imageTemp.push({
                                    url: URL.createObjectURL(fileList[i]),
                                    name: fileList[i].name,
                                  });
                                  getJsonData(URL.createObjectURL(fileList[i]));
                                  setImageUploaded(imageTemp);
                                  console.log(imageUploaded);
                                  // setImageUploaded((current: Array<any>) => [
                                  //   ...current,
                                  //   URL.createObjectURL(fileList[i]),
                                  // ]);
                                }

                                // setImageUploaded(
                                //   URL.createObjectURL(fileList[0])
                                // );
                                setImageDisplay("block");
                              } else {
                                setImageDisplay("none");
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        PNG, JPG, GIF up to 10MB
                      </p>

                      {imageUploaded != null && imageUploaded.length > 0 ? (
                        imageUploaded.map((item, index) => {
                          return (
                            <p
                              className="text-xs text-neutral-500 dark:text-neutral-400"
                              key={index}
                            >
                              <span>{index + 1 + " - " + item.name}</span>
                            </p>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ---- */}
              {/* <FormItem label="Item Name">
              <Input
                value={itemName}
                placeholder="Item Name"
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
            </FormItem> */}

              {/* ---- */}
              <FormItem label="Price">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    ETH
                  </span>
                  <Input
                    value={price}
                    className="!rounded-l-none"
                    placeholder="Price"
                    pattern="^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
                    onChange={(e) => {
                      setPrice((p) =>
                        e.target.validity.valid ? e.target.value : p
                      );
                    }}
                  />{" "}
                </div>
              </FormItem>
              {/* ---- */}
              {/* <FormItem
              label="External link"
              desc="Smash NFT will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  https://
                </span>
                <Input
                  value={externalLink}
                  className="!rounded-l-none"
                  placeholder="abc.com"
                  onChange={(e) => {
                    setExternalLink(e.target.value);
                  }}
                />
              </div>
            </FormItem> */}

              {/* ---- */}
              {/* <FormItem
              label="Description"
              desc={
                <div>
                  The description will be included on the item's detail page
                  underneath its image.{" "}
                  <span className="text-green-500">Markdown</span> syntax is
                  supported.
                </div>
              }
            >
              <Textarea
                value={description}
                rows={6}
                className="mt-1.5"
                placeholder="..."
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FormItem> */}

              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

              {/* ---- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2.5">
                {loadingState ? <div className="loader"></div> : <></>}
                {/* ---- */}
                {/* <FormItem label="Royalties (%)">
                <Input
                  value={royalities}
                  placeholder="20%"
                  onChange={(e) => {
                    setRoyalities(e.target.value);
                  }}
                />
              </FormItem> */}
                {/* ---- */}
                {/* <FormItem label="Size">
                <Input
                  placeholder="0 Mb"
                  readOnly
                  value={Math.round(fileSize / 1024).toFixed(2) + " Kbs"}
                />
              </FormItem> */}
                {/* ---- */}
                {/* <FormItem label="Propertie">
                <Input
                  value={properties}
                  placeholder="Propertie"
                  onChange={(e) => {
                    setProperties(e.target.value);
                  }}
                />
              </FormItem> */}
              </div>

              {/* ---- */}
              {/* <MySwitch enabled /> */}

              {/* ---- */}
              {/* <MySwitch
              label="Instant sale price"
              desc="Enter the price for which the item will be instantly sold"
            /> */}

              {/* ---- */}
              {/* <MySwitch
              enabled
              label="Unlock once purchased"
              desc="Content will be unlocked after successful transaction"
            /> */}

              {/* ---- */}
              <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
                <ButtonPrimary
                  className="flex-1"
                  onClick={uploadItemButtonClicked}
                >
                  Upload Bulk Item
                </ButtonPrimary>
                {/* <ButtonSecondary className="flex-1" onClick={openModalEdit}>
                Preview Item
              </ButtonSecondary> */}
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
