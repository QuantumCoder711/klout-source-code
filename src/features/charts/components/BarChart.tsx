import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    hours: string[];
    checkedInUsers: number;
    allCounts: number[];
}

const BarChart: React.FC<BarChartProps> = (props) => {

    const data = {
        labels: props.hours,
        datasets: [{
            label: "Check-Ins",
            data: props.allCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: "rgba(75, 192, 192)",
            borderWidth: 1,
            // barThickness: ,
            maxBarThickness: 60,
            minBarLength: 0,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };



    return (
        <div className='w-full h-80'>
            <Bar data={data} options={options}></Bar>
        </div>
    )
}

export default BarChart;