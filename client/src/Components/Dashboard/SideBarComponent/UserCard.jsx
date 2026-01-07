
function UserCard({
    name, 
    role
}){
    return(
    <>
        <div className= "flex flex-col justify-center items-center bg-darkblue text-white w-full">
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