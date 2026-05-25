
const MainContentLayout = ({ children }) => {
  return (
    <div className="app-main min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 pt-14 pb-6 md:pt-6 md:pb-8">
      <div className="app-main__inner">{children}</div>
    </div>
  );
};


export default MainContentLayout;