import { Decision, UpScalling, RealTimeStock, Check, Trust } from "../../assets/Imagesender";
import { useState } from "react";
function Services() {
    const [isHovered, setIsHovered] = useState(false);


    const features = [
        {
            image: RealTimeStock,
            title: "REAL TIME STOCK TRACKING",
            discription: "Always know what's in stock, what's running low, and what needs to be restocked—instantly."

        },
        {
            image: Check,
            title: "Fast Setup, Zero Complexity",
            discription: "Start managing your inventory in minutes with intuitive tools."

        },
        {
            image: Decision,
            title: "Smarter Decision Making",
            discription: "Get clear analytics and reports that help you grow your business smarter."

        },
        {
            image: UpScalling,
            title: "Scale Without Limits",
            discription: "Add more products, vendors, or users anytime—our system grows with your business."

        },
        {
            image: Trust,
            title: "Trusted by Businesses",
            discription: "A reliable system built with industry best practices and proven workflow logic."

        }

    ]

    return (
        <>

            <div className="w-full bg-darkblue text-white py-10">
                <div className="flex flex-col items-center justify-between md:max-w-7xl mx-auto px-4 gap-5">

                    <div>

                        <p className="text-center font-bold text-4xl">Why Choose Us?</p>

                        <p className="text-gray-300 text-sm text-center md:text-base max-w-md">

                            Powerful automation, deep insights, and simple controls—everything your business needs to manage inventory without hassle.

                        </p>
                    </div>

                    <div className="w-full bg-darkblue flex flex-row px-5 md:px-20 justify-center gap-10 flex-wrap">

                        {/* <div className="w-60 border bg-lightblue text-white flex flex-col justify-center items-center text-center px-5 py-2 rounded-xl"> */}

                        {/* <img width="80px" height="150px" src={Decision} alt=""></img>
                <p className="font-bold">Real Time stock Tracking</p>
                <p className="text-gray-300 text-sm md:text-base max-w-sm">
                    Always know what's in stock, what's running low, and what needs to be restocked—instantly.
                </p> */}
                        {
                            features?.map((feature, id) => (
                                <div className={`w-full md:w-70 border border-blue-900 shadow-2xl bg-blue-700 text-white flex flex-col justify-center items-center text-center px-5 py-8 rounded-xl ${isHovered ? "transition-transform duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer":""}`} key={id} onMouseEnter={()=> setIsHovered(true)}
                                onMouseLeave={()=> setIsHovered(false)}
                                  >
                                    <img width="90px" height="150px" src={feature.image} alt=""></img>
                                    <p className="font-bold text-sm md:text-xl">{feature.title}</p>
                                    <p className="text-graywhite text-sm md:text-base max-w-sm">
                                        {
                                            feature.discription
                                        }

                                    </p>
                                </div>) ) }
                    </div>
            </div>
        </div >

        </>

    )
}

export default Services;