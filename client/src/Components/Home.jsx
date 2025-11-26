import inventoryImage from '../../public/inventory.png'
import Button from './Button';

function HomePage(){
    return(
        <>
         <div id="home" className="w-full py-5 bg-darkblue">
    <div className="flex flex-col-reverse md:flex-row items-center justify-between md:max-w-7xl mx-auto px-4 lg:pl-30">
      
     
      <div className="flex flex-col gap-6 max-w-lg">
        
       
        <div className="font-extrabold leading-tight text-2xl md:text-4xl">
          <p className="text-white">Your Inventory,</p>
          <p className="text-white">Organized,</p>
          <p className="text-white">Automated, Simplified.</p>
        </div>

        
        <p className="text-graywhite text-sm md:text-base max-w-md">
          Stop guessing and start managing your inventory with real-time tracking,
          automated stock updates, batch control, expiry alerts, and seamless reporting —
          everything your business needs to stay ahead.
        </p>

       
        <div className="flex gap-4">
          <Button name="" isIcon={true} btnName="Buy our service"  />
          <Button btnName="Contact Us"  props=' shadow-2xs'  borderColor='border-skyblue' hoverColor='bg-blue-700' backgroundColor=''  />
         
        </div>

      </div>

      
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img src={inventoryImage} alt="inventory" className="max-w-xs md:max-w-md w-full object-contain"></img>
      </div>

    </div>
  </div>


        </>
    )
}

export default HomePage;