import { Circle, Arrow } from '../assets/Imagesender';

function Button({
    backgroundColor = "" ,
    btnName,
    textColor = "text-white", 
    borderColor = "border-blue-700",
    hoverColor = "hover:bg-blue-700",
    isIcon = false,
    borderShape = "rounded-full",
    onClick,
    className = ""


}){
    return(
        <>
        <button className={`${className} px-9 py-3 ${backgroundColor }  ${textColor} border ${borderColor} ${hoverColor} transition ${borderShape} font-semibold  ${
            isIcon? "flex items-center gap-2":""
        }
          cursor-pointer`} onClick={onClick}>
            {btnName}
            
               {isIcon &&
                <span className="relative w-6 h-6 flex items-center justify-center">
                <img src={Circle} className="w-full border-2 rounded-full  h-full invert brightness-0" alt="circle" />
                <img src={Arrow} className="w-3 h-3 absolute inset-0 m-auto invert brightness-0" alt="arrow" />
              </span>}
          </button>
        </>

    )
}

export default Button;