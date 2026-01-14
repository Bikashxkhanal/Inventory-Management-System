import { Line, Pie, Bar } from "react-chartjs-2"

const CustomChart  = ({
    data, 
    options , 
    type
} ) => {

    if(type === 'bar') return <Bar data={data} options={options} />
    if(type === 'line') return <Line data={data} options={options} />
    if(type === 'pie' ) return <Pie data={data} options={options} />

}

export default CustomChart;