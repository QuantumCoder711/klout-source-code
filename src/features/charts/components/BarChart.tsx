import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from 'chart.js'; // Import the correct type for options

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    hours: string[];
    checkedInUsers: number;
    allCounts: number[];
    className?: string;
}

const BarChart: React.FC<BarChartProps> = (props) => {

    // Helper function to generate random colors
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const alpha = (Math.random() * (0.8 - 0.4) + 0.4).toFixed(2); // Random opacity between 0.4 and 0.8
        return `rgba(${r},${g},${b},${alpha})`; // rgba format to include alpha
    };

    // Create random colors for each bar
    const randomColors = props.allCounts.map(() => getRandomColor());

    const data = {
        labels: props.hours,
        datasets: [{
            label: "Check-Ins",
            data: props.allCounts,
            backgroundColor: randomColors, // Apply random colors here
            maxBarThickness: 60,
            minBarLength: 0,
        }],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category', // X-axis is categorical with bin labels
                title: {
                    display: true,
                    text: 'Time (Hours)', // Can be adjusted based on your data
                },
            },
            y: {
                type: 'linear', // Y-axis is continuous, representing the frequency of items
                title: {
                    display: true,
                    text: 'Number of Check-Ins',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className={`w-full h-80 ${props.className}`}>
            <Bar data={data} options={options}></Bar>
        </div>
    );
};

export default BarChart;
