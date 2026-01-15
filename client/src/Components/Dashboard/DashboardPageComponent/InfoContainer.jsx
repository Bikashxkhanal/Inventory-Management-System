import {stockImg, purchaseImg, salesImg } from '../../../assets/Imagesender';


const InfoContainer = ({
    amount = null, 
    img, 
    title, 
    percent,
    count = null,
    color = 'text-red-700 ' //red if comparative less, and green for comperative more
}) => {
  return (
    <div className='w-1/2 lg:w-1/4 flex flex-row justify-start flex-1 mx-1 md:ml-4 mt-4 pr-2 py-2 md:pt-4 md:pb-2 md:px-4 border border-slate-300 rounded-xl gap-3 bg-slate-200 shadow-md  '>
      {/* img and text */}
      <img src={img} className='size-5 md:size-8 ' alt="" />

      <div className='flex flex-col justify-start gap-5  '> 
        <p className='text-xl md:text-3xl text-gray-700'>{title}</p>
      {/* total value */}
      <div className='flex flex-row justify-start gap-2 md:gap-3'>
        <p>
          {
            amount && 'Rs.'
          }
          <span className={`text-lg md:text-4xl ${color} font-semi font-mono`}>{/* amount */}
            {
              amount ?? count ?? <p>Bikash</p>
            }
          </span>
        </p>
        <p className={`${color} text-lg md:text-xl`} >{/* up or down % */}
            {percent}
        </p>
      </div>
       </div>
    </div>
  );
};



export default InfoContainer;
