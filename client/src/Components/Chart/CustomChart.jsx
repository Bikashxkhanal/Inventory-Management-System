import { Line, Pie, Bar } from "react-chartjs-2"

const CustomChart  = ({
    data, 
    options , 
    type
} ) => {

    const wrap = (Chart) => (
        <div className="h-full w-full">
            <Chart data={data} options={options} />
        </div>
    );

    if(type === 'bar') return wrap(Bar);
    if(type === 'line') return wrap(Line);
    if(type === 'pie' ) return wrap(Pie);

}

export default CustomChart;