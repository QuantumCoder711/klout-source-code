import React, { useEffect, useState } from 'react';

interface CustomBarChartProps {
    labels: string[];
    color: string;
    allCounts: number[];
}

interface CustomData {
    label: string;
    counts: number;
}

const CustomBarChart: React.FC<CustomBarChartProps> = (props) => {

    const [data, setData] = useState<CustomData[]>([]);
    const barColor = `bg-${props.color}-500`;

    useEffect(() => {
        const temp = props.labels.map((label, index) => ({
            label,
            counts: props.allCounts[index] || 0,
        }));

        temp.sort((a, b) => b.counts - a.counts);

        setData(temp);
    }, [props.labels, props.allCounts]);


    const maxCount = Math.max(...props.allCounts);

    return (
        <div className='bg-white p-5'>
            <div className='space-y-3'>

                {/* Bars */}
                {data.map((item, index) => (
                    <div key={index} className='flex gap-[10px] items-center'>
                        <p className='font-semibold max-w-60 w-full text-ellipsis overflow-hidden text-nowrap text-right'>
                            {item.label}
                        </p>
                        <div
                            className={`h-6 rounded-sm grid font-sans min-w-fit font-semibold place-content-center ${barColor} text-center text-white p-1`}
                            style={{
                                width: `${(item.counts / maxCount) * 100 * 0.6}%`,
                            }}
                        >
                            {item.counts}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomBarChart;
