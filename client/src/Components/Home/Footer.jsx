
import Button from "../Button";

function Footer(){
    return(
        <>
         <div className="w-full bg-darkblue py-4 md:py-10">
        <div className="flex flex-col items-center  md:max-w-7xl mx-auto px-4 gap-10 md:gap-20 text-white">
            {/* <!-- for call to action --> */}
             <div className="flex flex-col items-center border text-center border-skyblue px-6 md:px-10 py-4 md:py-8 rounded-xl gap-4 bg-lightblue shadow-3xs">
                <div >
                <p className="text-2xl font-bold">Still managing your inventory manually?</p>
                <p className="text-base text-graywhite">Use our service and grow your business</p>
                </div>

               

                <Button isIcon={true} backgroundColor="bg-darkblue"   props='px-14 md:px-18 py-3  text-[20px] md:text-lg font-semibold' borderShape="rounded-xl" btnName="Register Now  " />


             </div>

             {/* <!-- Footer Segment --> */}
              <div className="w-[90%]  md:w-[80%] flex flex-col justify-center items-center gap-4">
              <div className="w-[90%] flex flex-col gap-5 md:w-[80%] md:flex-row
              items-start sm:mx-auto  md:justify-around ">
                <div>
                    <p className="font-bold text-xl">Support</p>
                    <p><a href="#">Resources & news</a></p>
                    <p><a href="#">Guidlines </a></p>
                </div>
                <div>
                    <p className="font-bold text-xl">Contact</p>
                    <p><a href="">facebook</a></p>
                    <p><a href="">Instagram</a></p>
                </div>
                <div>
                    <p className="font-bold text-xl">Legal</p>
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