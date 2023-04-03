import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { nftsImgs } from "contains/fakeData";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ClockIcon } from "@heroicons/react/outline";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";

export interface CardNFTProps {
  className?: string;
  isLiked?: boolean;
  nftData?: {
    collection: "";
    description: "";
    fileSize: 0;
    id: 0;
    image: [];
    name: "";
    price: "0.001";
    properties: "";
    royalities: "";
    url: "";
    tokenId: "";
  };
}

const CardNFT: FC<CardNFTProps> = ({ className = "", isLiked, nftData }) => {
  let imgCustom = "";
  useEffect(() => {
    if (nftData && Array.isArray(nftData?.image)) {
      if (nftData && nftData.image.length > 0) {
        nftData.image.map((e, index) => {
          imgCustom = e;
        });
      }
    } else {
      if (nftData && !Array.isArray(nftData?.image)) {
        imgCustom = nftData.image;
      }
    }
  }, []);
  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  return (
    <div
      className={`nc-CardNFT relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
      data-nc-id="CardNFT"
    >
      <div className="relative flex-shrink-0 ">
        <div>
          <NcImage
            key={nftData?.id}
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
            src={imgCustom}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
          />
        </div>
        {Math.random() > 0.5 ? (
          <ItemTypeVideoIcon className="absolute top-3 left-3 !w-9 !h-9" />
        ) : (
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}
        <LikeButton
          liked={isLiked}
          className="absolute top-3 right-3 z-10 !h-9"
        />
        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="p-4 py-5 space-y-3">
        {/* <div className="flex justify-between">
          {renderAvatars()}
          <span className="text-neutral-700 dark:text-neutral-400 text-xs">
            {Math.floor(Math.random() * 90) + 10} in stock
          </span>
        </div> */}
        <h2 className={`text-lg font-medium`}>
          {nftData ? nftData.name : ""} #{nftData ? nftData.id : ""}
        </h2>

        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end ">
          <Prices
            labelTextClassName="bg-white dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-50"
            price={nftData ? nftData.price + "  ETH" : ""}
          />
          {/* <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1 mt-0.5">
              {Math.floor(Math.random() * 20) + 1} hours left
            </span>
          </div> */}
        </div>
      </div>

      <Link
        to={"/nft-detailt/" + nftData?.collection + "&" + nftData?.tokenId}
        className="absolute inset-0"
      ></Link>
    </div>
  );
};

export default CardNFT;
