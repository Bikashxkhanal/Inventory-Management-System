import {Chart as ChartJs, CategoryScale, LinearScale, ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend, Title, plugins } from "chart.js";
ChartJs.register(CategoryScale, LineElement, ArcElement, BarElement, PointElement , LinearScale, Tooltip, Legend, Title)
import { baseOptions } from "./BaseOption"

 const getChartFor = (type, title = "default") => {
    switch (type) {
        case "bar" : return {
            ...baseOptions,
            plugins : {
                title : {
                    ...baseOptions.plugins.title,
                   text : title,
                },
                legend :{
                    ...baseOptions.plugins.legend,
                },
                scales : {
                    y: {beginAtZero : true}
                }
            }

        }
        
        case "pie" : return {
            ...baseOptions,
            plugins : {
                title : {
                    ...baseOptions.plugins.title,
                    text : title,
                },
                legend : {
                    ...baseOptions.plugins.legend,
                    position : "bottom",
                },
            },

        }
        

        case  "line" : return {
            ...baseOptions,
            plugins : {
            title : {
                ...baseOptions.plugins.title,
                text : title,
            },
        },
            
                tension : 0.3,
        

        }
            
        default : return {
            ...baseOptions
        }

    }

}

export default getChartFor;

