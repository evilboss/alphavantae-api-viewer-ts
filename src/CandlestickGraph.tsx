import React from 'react';
import Chart from 'react-apexcharts';

interface CandlestickGraphProps {
    data: {
        x: string;
        y: [number, number, number, number];
    }[];
}

const CandlestickGraph: React.FC<CandlestickGraphProps> = ({ data }) => {
    const series = [{
        data: data.map(item => ({
            x: new Date(item.x).getTime(),
            y: item.y
        }))
    }];

    const options = {
        chart: {
            type: 'candlestick',
            height: 350
        },
        title: {
            text: 'Candlestick Chart',
            align: 'left'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    };

    return (
        <Chart
            options={options as any}
            series={series}
            type="candlestick"
            height={350}
        />
    );
}

export default CandlestickGraph;
