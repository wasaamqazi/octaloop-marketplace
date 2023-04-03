import React, { useEffect, useState } from "react";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionVideos from "./SectionVideos";
import { Helmet } from "react-helmet";
import SectionLargeSlider from "./SectionLargeSlider";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import SectionHero2 from "components/SectionHero/SectionHero2";
import SectionGridFeatureNFT2 from "./SectionGridFeatureNFT2";
import SectionMagazine8 from "components/SectionMagazine8";
import SectionSliderCardNftVideo from "components/SectionSliderCardNftVideo";
import SectionSliderCollections2 from "components/SectionSliderCollections2";
//Firestore imports
import { collection, query, where, doc, getDocs } from "firebase/firestore";
import { firestoredb } from "../../firebase";

function PageHome() {
  //States
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const getCollections = async () => {
    setLoadingState(true);

    const q = query(
      collection(firestoredb, "collections")
    );
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let tempDocData = collections;
      tempDocData.push({ id: doc.id, docData: doc.data() });
      setCollections(tempDocData);
    });
    console.log(collections);
    setLoadingState(false);
  };
  //useEffect data to get collections
  useEffect(() => {
    getCollections();
  }, []);
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Smash NFT || Next Gen Multichain Marketplace</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container relative mt-5 mb-20 sm:mb-24 lg:mt-20 lg:mb-32">
        {/* SECTION HERO */}
        <SectionHero2 />

        {/* SECTION 2 */}
        <SectionHowItWork className="mt-24 lg:mt-40 xl:mt-48" />
      </div>

      {/* SECTION LAERGE SLIDER */}
      {/* <div className="bg-neutral-100/70 dark:bg-black/20 py-20 lg:py-32">
        <div className="container">
          <SectionLargeSlider />
        </div>
      </div> */}

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* SECTION 3 */}
        {/* <SectionMagazine8 /> */}
        {/* SECTION */}
        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections2
            cardStyle="style2"
            collectionsTemp={collections}
          />
        </div>
        {/* SECTION TOP CREATORS */}
        {/* <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionGridAuthorBox
            sectionStyle="style2"
            data={Array.from("11111111")}
            boxCard="box4"
          />
        </div> */}

        {/* SECTION 4 */}
        {/* <SectionSliderCardNftVideo /> */}

        {/* SECTION */}
        {/* <SectionSubscribe2 /> */}

        {/* SECTION */}
        <div className="relative py-20 lg:py-28">
          <BackgroundSection className="bg-neutral-100/70 dark:bg-black/20 " />
          <SectionGridFeatureNFT2 />
        </div>

        {/* SECTION 1 */}
        {/* <SectionSliderCategories /> */}

        {/* SECTION */}
        {/* <div className="relative py-20 lg:py-24">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div> */}

        {/* SECTION */}
        {/* <SectionVideos /> */}
      </div>
    </div>
  );
}

export default PageHome;
