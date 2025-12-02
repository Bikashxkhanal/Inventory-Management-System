import { SliderImage, Slider2, Slider3 } from '../../assets/Imagesender';
import { useState, useEffect } from 'react';

function AboutUs() {
    const Images = [SliderImage, Slider2, Slider3];


    const [imgIndex, setImgIndex] = useState(0);

    useEffect(()=>{
        const interval = setInterval(() => {
       setImgIndex((prev)=>( prev+1)%Images.length);
        
    }, 2000);

    return ()=> clearInterval();

    }, [])
    

  return (
    <>
      <div className="w-full py-10 bg-darkblue">
        <div className="flex flex-col items-center justify-between md:max-w-7xl mx-auto px-4 gap-5">
          <div className="flex flex-col text-center text-white">
            <p className="text-4xl font-bold">About Us</p>
            <p className="mx-auto text-graywhite text-center 
   w-[90%] sm:w-[85%] md:w-[60%] lg:w-[50%] 
   text-base text-md leading-relaxed">
              We are a team of developers and tech experts dedicated to helping
              businesses manage their inventory with accuracy and efficiency.
              With years of experience, we deliver a reliable, user-friendly
              Inventory Management solution built for businesses of all sizes.
            </p>
          </div>
          {/* image slider section */}
          <div className="w-full h-[350px] flex items-center justify-center gap-6">
            <img
              src={Images[imgIndex]}
              className="w-48 h-48 object-cover rounded-xl opacity-50 blur-sm transition-all duration-500"
              alt="side"
            />

            <img
              src={Images[(imgIndex + 1) % Images.length]}
              className="w-66 h-76 object-cover rounded-xl shadow-xl  transition-all duration-500 scale-110"
              alt="center"
            />

            <img
              src={Images[(imgIndex+2)%Images.length]}
              className="w-48 h-48 object-cover rounded-xl opacity-50 blur-sm transition-all duration-500"
              alt="side"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
