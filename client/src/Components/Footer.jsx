import { Circle, Arrow } from "../assets/Imagesender";

function Footer(){
    return(
        <>
         <div class="w-full bg-darkblue py-4 md:py-10">
        <div class="flex flex-col items-center  md:max-w-7xl mx-auto px-4 gap-10 md:gap-20 text-white">
            {/* <!-- for call to action --> */}
             <div class="flex flex-col items-center border text-center border-skyblue px-6 md:px-10 py-4 md:py-8 rounded-xl gap-4 bg-lightblue shadow-3xs">
                <div >
                <p class="text-2xl font-bold">Still managing your inventory manually?</p>
                <p class="text-base text-graywhite">Use our service and grow your business</p>
                </div>

                <button class="px-14 md:px-18 py-3 border text-[20px] md:text-lg font-semibold border-darkblue bg-darkblue rounded-xl shadow-2xs cursor-pointer flex items-center gap-2">Register Now
                   <span className="relative w-6 h-6 flex items-center justify-center">
    <img src={Circle} className="w-full h-full invert brightness-0" alt="circle" />
    <img src={Arrow} className="w-3 h-3 absolute inset-0 m-auto invert brightness-0" alt="arrow" />
  </span>
                </button>
             </div>

             {/* <!-- Footer Segment --> */}
              <div class="w-[90%]  md:w-[80%] flex flex-col justify-center items-center gap-4">
              <div class="w-[90%] flex flex-col gap-5 md:w-[80%] md:flex-row
              items-start sm:mx-auto  md:justify-around ">
                <div>
                    <p class="font-bold text-xl">Support</p>
                    <p><a href="#">Resources & news</a></p>
                    <p><a href="#">Guidlines </a></p>
                </div>
                <div>
                    <p class="font-bold text-xl">Contact</p>
                    <p><a href="">facebook</a></p>
                    <p><a href="">Instagram</a></p>
                </div>
                <div>
                    <p class="font-bold text-xl">Legal</p>
                    <p><a href="">privacy policy</a></p>
                    <p><a href="">Terms of services</a></p>
                </div>
</div>
 <p>© 2024 BeyondLimits. All Rights Reserved</p>
              </div>

             

        </div>
    </div>
        </>
    )
}

export default Footer;