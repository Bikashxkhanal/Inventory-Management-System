const DashboardLayout = ({
    children
}) => {

    return <div className='flex h-screen w-full min-w-0 flex-col overflow-hidden md:flex-row' >
      {children}
    </div>;

}

export default DashboardLayout;