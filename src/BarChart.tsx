import React from 'react';
import Chart from 'react-apexcharts';

interface BarChartProps {
    data: number[];
    labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels }) => {
    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: '55%',
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: labels,
        },
        yaxis: {
            title: {
                text: 'Values'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val.toFixed(0);
                }
            }
        }
    };

    const series = [{
        name: 'Data',
        data: data
    }];

    return (
        <div className="w-full max-w-xl">
            <Chart
                options={options as any}
                series={series}
                type="bar"
                width="100%"
                height="350"
            />
        </div>
    );
};

export default BarChart;
