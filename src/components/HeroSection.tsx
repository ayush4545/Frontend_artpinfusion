import React from "react";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import Pic1 from "../assets/images/pic1.jpg";
import Pic2 from "../assets/images/pic2.jpg";
import Pic3 from "../assets/images/pic3.jpg";
import Pic4 from "../assets/images/pic4.jpg";
import Pic5 from "../assets/images/pic5.jpg";
import Pic6 from "../assets/images/pic6.jpg";
import Pic7 from "../assets/images/pic7.jpg";
import bgVideo from "../assets/videos/video3.mp4";
import ErrorImage from "../assets/404Page.gif";
import { labels } from "../config/constants/text.constant";

const HeroSection = () => {
  const heroImages = [
    { imSrc: Pic1, animateClass: "animateImage1" },
    { imSrc: Pic2, animateClass: "animateImage2" },
    { imSrc: Pic3, animateClass: "animateImage3" },
    { imSrc: Pic4, animateClass: "animateImage4" },
    { imSrc: Pic5, animateClass: "animateImage5" },
    { imSrc: Pic6, animateClass: "animateImage6" },
    { imSrc: Pic7, animateClass: "animateImage7" },
  ];
  return (
    <div
      className="w-screen h-screen dark:bg-[#282828] dark:text-white relative snap-center overflow-hidden"
      id="top"
    >
      <section className="w-full h-[92vh]  relative overflow-hidden text-wrap ">
        <h1
          className={`absolute top-0 left-0 w-full h-full flex flex-col  items-center justify-center uppercase text-[54px] font-bold text-center xl:dark:bg-[#282828]  dark:text-white z-20`}
        >
          <span className="-mt-32 dark:text-white">
            {labels?.HOME_PAGE_TITLE1}
          </span>
          <span className="text-2xl">{labels?.HOME_PAGE_TITLE2}</span>
        </h1>
      </section>

      <video
        autoPlay
        loop
        muted
        className="absolute top-0 xl:hidden object-cover h-full w-full left-0  z-10 dark:opacity-25 opacity-80"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="absolute bottom-[8vh] px-3 h-3/5 w-full heroSectionInnerShadow hidden xl:block columns-7 overflow-hidden z-30">
        {heroImages?.map((hero) => {
          return (
            <div
              className={`aspect-9/16 w-full  overflow-hidden rounded-2xl shadow-2xl ${hero.animateClass} `}
            >
              <img
                src={hero?.imSrc}
                alt="hero2"
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src= ErrorImage;
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="bg-orange-300 dark:bg-orange-500  absolute bottom-0 flex items-center justify-center h-[8vh] w-full font-semibold z-50">
        <p className="flex items-center gap-1 text-lg">
          {labels?.HOME_PAGE_FOOTER}
        </p>
      </div>
    </div>
  );
};

export default WithErrorBoundariesWrapper(HeroSection);
