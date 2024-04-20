import React from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
const HeroSection = () => {
  return (
    <div
      className="w-screen h-screen dark:bg-slate-900 dark:text-white relative snap-center"
      id="top"
    >
      <section className="w-full h-[92vh]  relative overflow-hidden text-wrap -z-10">
        <h1
          className={`absolute top-0 left-0 w-full h-full flex flex-col  items-center justify-center uppercase text-[54px] font-bold text-center dark:bg-slate-700 dark:text-white  mix-blend-multiply -z-10`}
        >
          <span className="-mt-32">Get Your idea for Next</span>
          <span className="text-2xl">Fun | project | Creative | Art</span>
        </h1>
      </section>

      <div className="absolute bottom-[8vh] h-3/5 w-full heroSectionInnerShadow grid grid-cols-6 overflow-hidden">
        <div className="relative w-full h-full animateImage2">
          <div className="aspect-9/16 w-full overflow-hidden bg-red-300 rounded-2xl shadow-2xl animateImage1 ">
            <img
              src="https://i.pinimg.com/736x/ab/f4/24/abf4246c960d5c90fe27a1bdf262a3f8.jpg"
              alt="hero2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="-aspect-video w-full overflow-hidden bg-red-300 rounded-2xl shadow-2xl  animateImage2">
            <img
              src="https://i.pinimg.com/736x/5f/d1/14/5fd1148642b126fdd8f49f44f3545aee.jpg"
              alt="hero1"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* <div className="-aspect-video w-full overflow-hidden bg-red-300 rounded-2xl shadow-2xl absolute">
           <img src="https://i.pinimg.com/736x/5f/d1/14/5fd1148642b126fdd8f49f44f3545aee.jpg" alt="hero1" className="w-full h-full object-cover"/>
         </div>
         <div className="-aspect-video w-full overflow-hidden bg-red-300 rounded-2xl shadow-2xl absolute">
           <img src="https://i.pinimg.com/736x/5f/d1/14/5fd1148642b126fdd8f49f44f3545aee.jpg" alt="hero1" className="w-full h-full object-cover"/>
         </div>
         <div className="-aspect-video w-full overflow-hidden bg-red-300 rounded-2xl shadow-2xl absolute">
           <img src="https://i.pinimg.com/736x/5f/d1/14/5fd1148642b126fdd8f49f44f3545aee.jpg" alt="hero1" className="w-full h-full object-cover"/>
         </div> */}
      </div>

      <div className="bg-orange-300 dark:bg-orange-700  bottom-0 flex items-center justify-center h-[8vh] w-full font-semibold">
        <Link to="#top" className="flex items-center gap-1">
          Here's how it's work <FaChevronDown />
        </Link>
      </div>
    </div>
  );
};

export default WithErrorBoundariesWrapper(HeroSection);
