const DashboardLayout = ({
    children
}) => {

    return <div className='w-full h-screen flex flex-col md:flex-row' >
      {children}
    </div>;

}

export default DashboardLayout;