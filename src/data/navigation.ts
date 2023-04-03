import { NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

const otherPageChildMenus: NavItemType[] = [
  {
    
    id: ncNanoId(),
    href: "/createCollection",
    name: "Create Collection",
  },
  {
    
    id: ncNanoId(),
    href: "/allcollections",
    name: "My Collections",
  },
  {
    
    id: ncNanoId(),
    href: "/mynfts",
    name: "My NFTs",
  },
  // {

  //   id: ncNanoId(),
  //   href: "/page-collection/:id",
  //   name: "Collection page",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/page-search",
  //   name: "Search page",
  // },
  {
    id: ncNanoId(),
    href: "/page-author",
    name: "Author Profile",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/nft-detailt/:id",
  //   name: "NFT detailt",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/account",
  //   name: "Account settings",
  // },
  {
    id: ncNanoId(),
    href: "/page-upload-item",
    name: "Upload Item",
  },
  //  {
  //   id: ncNanoId(),
  //   href: "/page-upload-multiple-items",
  //   name: "Upload Items in Bulk V1",
  // },
  {
    id: ncNanoId(),
    href: "/page-upload-bulk-items",
    name: "Upload Items in Bulk",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/connect-wallet",
  //   name: "Connect Wallet",
  // },

  {
    id: ncNanoId(),
    href: "/about",
    name: "Other Pages",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/about",
        name: "About",
      },
      {
        id: ncNanoId(),
        href: "/contact",
        name: "Contact us",
      },
      {
        id: ncNanoId(),
        href: "/login",
        name: "Login",
      },
      {
        id: ncNanoId(),
        href: "/signup",
        name: "Signup",
      },
      // {
      //   id: ncNanoId(),
      //   href: "/subscription",
      //   name: "Subscription",
      // },
    ],
  },
  // {
  //   id: ncNanoId(),
  //   href: "/blog",
  //   name: "Blog Page",
  //   type: "dropdown",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/blog",
  //       name: "Blog Page",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/blog-single",
  //       name: "Blog Single",
  //     },
  //   ],
  // },
];

export const NAVIGATION_DEMO_2: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "#",
    name: "Discover",
    type: "dropdown",
    children: otherPageChildMenus,
  },
  // {
  //   id: ncNanoId(),
  //   href: "/#",
  //   name: "Help center",
  // },
];
