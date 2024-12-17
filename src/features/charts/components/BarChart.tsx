import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    hours: string[];
}

const BarChart: React.FC<BarChartProps> = (props) => {

    const data = {
        labels: props.hours,
        datasets: [{
            label: "369",
            data: [3, 6, 9],
            backgroundColor: "royalblue",
            borderColor: "black",
            borderWidth: 1
        }],
    };

    const options = {};

    return (
        <div className='w-full'>
            <Bar data={data} options={options}></Bar>
        </div>
    )
}

export default BarChart;