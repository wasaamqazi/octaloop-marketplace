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
import {
  ref as refS,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";
import { getDatabase, ref, set, push, get } from "firebase/database";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db, firestoredb, auth, useAuth } from "../../firebase";
import { storage } from "../../firebase";

const plans = [
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[0],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[1],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[2],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[3],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[4],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[5],
  },
];

const CreateCollection = ({ className = "" }) => {
  const currentUser = useAuth();

  const [collectionName, setCollectionname] = useState("");
  const [collectionImage, setCollectionImage] = useState("");
  const [collectionCoverImage, setCollectionCoverImage] = useState("");
  const [selected, setSelected] = useState(plans[1]);
  const [imageURL, setImageURL] = useState("");
  const [imageCoverURL, setCoverImageURL] = useState("");
  const [cdescription, setDescription] = useState("");
  const [uploadpercent, setPercent] = useState("");
  const [firebaseImgUrl, setFirebaseimgurl] = useState("");
  const [firebaseCoverImgUrl, setFirebasecoverimgurl] = useState("");

  const currentWalletAddress = window.ethereum?.selectedAddress;

  //Loading State
  const [loadingState, setLoadingState] = useState(false);
  // useEffect(() => {}, [currentUser]);
  function emptyAllFields() {
    setImageURL("");
    setCoverImageURL("");
    setCollectionImage("");
    setDescription("");
    setCollectionname("");
    setFirebaseimgurl("");
    setFirebasecoverimgurl("");
  }
  const handleImagechange = async (e) => {
    setLoadingState(true);

    if (e.target.files[0]) {
      setCollectionImage(e.target.files[0]);
      const imgURI = URL.createObjectURL(e.target.files[0]);
      setImageURL(imgURI);
    }

    const imageRef = refS(storage, `/collection/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(imageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFirebaseimgurl(url);
          setLoadingState(false);
        });
      }
    );
  };
  const handleCoverImagechange = (e) => {
    setLoadingState(true);

    if (e.target.files[0]) {
      setCollectionCoverImage(e.target.files[0]);
      const imgURI = URL.createObjectURL(e.target.files[0]);
      setCoverImageURL(imgURI);
    }

    const imageRef = refS(storage, `/collection/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(imageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFirebasecoverimgurl(url);
          setLoadingState(false);
        });
      }
    );
  };
  function checkValidation() {
    if (
      collectionName === "" ||
      collectionName === null ||
      collectionName === " " ||
      collectionName === undefined
    ) {
      return false;
    } else if (
      currentWalletAddress === "" ||
      currentWalletAddress === null ||
      currentWalletAddress === " " ||
      currentWalletAddress === undefined
    ) {
      return false;
    } else if (
      cdescription === "" ||
      cdescription === null ||
      cdescription === " " ||
      cdescription === undefined
    ) {
      return false;
    } else if (
      firebaseImgUrl === "" ||
      firebaseImgUrl === null ||
      firebaseImgUrl === " " ||
      firebaseImgUrl === undefined
    ) {
      return false;
    } else if (
      firebaseCoverImgUrl === "" ||
      firebaseCoverImgUrl === null ||
      firebaseCoverImgUrl === " " ||
      firebaseCoverImgUrl === undefined
    ) {
      return false;
    } else if (cdescription === null || cdescription === undefined) {
      return false;
    } else {
      return true;
    }
  }

  const handleSubmit = async () => {
    if (window.ethereum) {
      if (
        !window.ethereum.selectedAddress ||
        window.ethereum.selectedAddress == null
      ) {
        toast.error("Please connect to metamask", {
          toastId: "walletError",
        });
      } else {
        if (loadingState) {
          toast.warning("Please Wait!", {
            toastId: "warningLoading",
          });
        } else {
          if (checkValidation() === false) {
            toast.error(" All fields are mandatory and must be valid!", {
              toastId: "errorValidation",
            });
          } else {
            setLoadingState(true);
            await addDoc(collection(firestoredb, "collections"), {
              walletAddress: currentWalletAddress,
              collectionName: collectionName,
              collectionImage: firebaseImgUrl,
              coverImage: firebaseCoverImgUrl,
              description: cdescription,
          
            });

            console.log("finish");
            toast.success("Collection Created!", {
              toastId: "successLoading",
            });
            emptyAllFields();
            setLoadingState(false);
          }
        }
      }
    } else {
      toast.error("Please install metamask", {
        toastId: "metamaskError",
      });
    }
  };

  return (
    <div className={`nc-CreateCollection`} data-nc-id="CreateCollection">
      <Helmet>
        <title>Create Collection</title>
      </Helmet>
      {loadingState ? <div className="loader"></div> : <></>}

      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Create New Collection
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

          <FormItem label="Collection Name">
            <Input
              value={collectionName}
              placeholder="Collection Name"
              onChange={(e) => setCollectionname(e.target.value)}
            />
          </FormItem>

          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">Image</h3>
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
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImagechange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <img src={imageURL} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">Cover Photo</h3>
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
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300 justify-center">
                      <label
                        htmlFor="file-uploadcover"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-uploadcover"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleCoverImagechange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>

                    <img src={imageCoverURL} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <FormItem
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
                value={cdescription}
                rows={6}
                className="mt-1.5"
                placeholder="..."
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormItem>

            <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
              <ButtonPrimary className="flex-1" onClick={handleSubmit}>
                Upload item
              </ButtonPrimary>
              {/* <ButtonSecondary className="flex-1" onClick={handleSubmit}>
                  Preview item
                </ButtonSecondary> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
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

export default CreateCollection;
