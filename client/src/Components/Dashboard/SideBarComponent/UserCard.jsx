
function UserCard({
    name, 
    role
}){
    return(
    <>
        <div className= "flex flex-col justify-center items-center text-white w-[97%]">
            {/* user name */}
            <p className="font-bold font-sans"> 
                    {name}
            </p>
            {/* user role */}
            <p className="font-light font-sans">
                {role}
            </p>
        </div>

    </>
    );
}

export default UserCard;