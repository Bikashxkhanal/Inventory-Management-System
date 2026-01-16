import { useState } from "react";

const SegmentedProgressBar = ({ type = "", datas = [] }) => {
  //datas has object with {name:(eg. categoryName) , color:(tailwind (name-value)) , value, Total for whole object }

  const [hoverIndex, setHoverIndex] = useState(null);
  return (
    <div className="min-w-max flex flex-row flex-1 bg-white  border-r-2 border-white rounded-r-xl shadow-sm">
      <div className="min-w-max md:2/5 px-2 py-4 mx-5 flex flex-col justify-center items-start  gap-4">
        <div className="flex flex-row justify-start gap-4 ">
          <p className="text-2xl font-semibold">{datas[0].total}</p>
          <p className="text-gray-600 font-medium text-xl">{type}</p>
        </div>
        <div className="w-full h-2.5  flex flex-row justify-start gap-1 relative">
          {datas?.map((item, idx) => {
            const percent = (item.value / item.total) * 100;

            return (
              <div
                key={idx}
                className={`h-full border rounded-lg shadow-sm`}
                style={{
                  width: `${percent}%`,
                  backgroundColor: `${item.color}`,
                  borderColor: `${item.color}`,
                }}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {hoverIndex === idx && (
                  <p className="absolute top-6 left-1/2 -translate-x-1/2 px-2 bg-gray-100 text-black text-xs rounded shadow">
                    {percent.toFixed(2)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <div className="w-full flex flex-row flex-1 justify-start gap-8 md:gap-6 items-center  ">
            {datas?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className=" flex flex-row  text-sm  justify-start items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full "
                    style={{
                      backgroundColor: `${item.color}`,
                    }}
                  ></div>
                  <div className="text-md text-gray-700 ">
                    <p className="flex flex-col md:flex-row md:gap-2 items-center justify-center md:min-w-max">{item.name} 
                        <span>{item.value}</span>
                    </p>
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentedProgressBar;
