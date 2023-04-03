import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/#"?: {};
  "/home2"?: {};
  "/home3"?: {};
  "/nft-detailt/:id"?: {};
  "/page-collection/:id"?: {};
  "/page-search"?: {};
  "/page-author"?: {};
  "/page-upload-item"?: {};
  "/page-upload-multiple-items"?: {};
  "/page-upload-bulk-items"?: {};
  "/home-header-2"?: {};
  "/connect-wallet"?: {};
  "/account"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
  "/createCollection"?: {};
  "/allcollections"?: {};
  "/mynfts"?: {};
  // "/uploadImageToS3"?: {};

}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<Object>;
}
