import React, {useState} from 'react';
import BarChart from "./BarChart";
import CandlestickGraph from "./CandlestickGraph";
import useSWR from "swr";
import {Select} from "flowbite-react";

const apiKey = process.env.REACT_APP_ALPHAVANTAE_API_KEY || 'demo';
const Trending: React.FC = () => {

    const getCandlestickExtremes = (data: any[]): {
        highest: number,
        lowest: number,
        totalClose: string,
        lowestLow: number
        highestOpening: number,
        lowestOpening: number,
        highestClosing: number
    } => {
        let highest = Number.MIN_SAFE_INTEGER;
        let lowest = Number.MAX_SAFE_INTEGER;
        let lowestLow = Number.MAX_SAFE_INTEGER;
        let highestOpening = Number.MIN_SAFE_INTEGER;
        let lowestOpening = Number.MAX_SAFE_INTEGER;
        let highestClosing = Number.MIN_SAFE_INTEGER;
        let totalClose = 0;

        data.forEach(({open, high, low, close}) => {
            highest = Math.max(highest, open, high, low, close);
            lowest = Math.min(lowest, open, high, low, close);
            lowestLow = Math.min(lowestLow, low);
            totalClose += close;
            highestOpening = Math.max(highestOpening, open);
            lowestOpening = Math.min(lowestOpening, open, high);
            highestClosing = Math.max(highestClosing, close, low);

        });

        return {
            highest,
            lowest,
            totalClose: totalClose.toFixed(2),
            lowestLow,
            highestOpening,
            lowestOpening,
            highestClosing
        };
    };

    const intervalOptions = [
        '1min', '5min', '15min', '30min', '60min'
    ]

    const stockExchangeOptions = [
        'IBM',
        'TSCO.LON',
        'SHOP.TRT',
        'GPV.TRV',
        'MBG.DEX',
        'RELIANCE.BSE',
        '600104.SHH',
        '000002.SHZ'
    ]

    const extractCandleData = (data: any[]): any => {
        return Object.keys(data).map((key) => {
            const candleData = timeSeriesData[key]
            return {
                open: parseFloat(candleData['1. open']),
                high: parseFloat(candleData['2. high']),
                low: parseFloat(candleData['3. low']),
                close: parseFloat(candleData['4. close'])
            }
        })
    }

    const formatCandlestickData = (timeSeriesData: any = {}): { x: string, y: [number, number, number, number] }[] => {
        return Object.keys(timeSeriesData).map((key) => {
            const candleData = timeSeriesData[key];
            return {
                x: key,
                y: [
                    parseFloat(candleData['1. open']),
                    parseFloat(candleData['2. high']),
                    parseFloat(candleData['3. low']),
                    parseFloat(candleData['4. close'])
                ]
            };
        });
    };

    const [selectedSymbol, setSelectedSymbol] = useState('IBM')

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const {data = {}, error, isLoading} = useSWR(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selectedSymbol}&outputsize=full&apikey=${apiKey}`,
        fetcher
    );

    console.log('data, error, isLoading', data, error, isLoading)
    const {
        'Meta Data': metaData,
        'Information': errorInfo = '',
        'Time Series (Daily)': timeSeriesData = {}
    } = data || {};

    const {
        '1. Information': info = '',
        '2. Symbol': symbol = '',
        '3. Last Refreshed': lastUpdated = '',
        '4. Interval': interval = 'Daily',
    } = metaData || {}

    const {
        highest,
        lowest,
        totalClose,
        lowestLow,
        highestOpening,
        lowestOpening,
        highestClosing
    } = (getCandlestickExtremes(extractCandleData(timeSeriesData)));

    return (
        <div>
            {!errorInfo ? <>{isLoading ?
                    <div role="status">
                        <svg aria-hidden="true"
                             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <>
                        <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                            <h1 className="text-2xl font-bold">{symbol}</h1>
                            <p className="text-gray-700">{info}</p>
                            <p className="text-base font-normal text-gray-500 dark:text-gray-400">{lastUpdated}</p>

                            <div className="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Total
                                        closing
                                    </dt>
                                    <dd className="leading-none text-3xl font-bold text-gray-900 dark:text-white">{totalClose}</dd>
                                </dl>
                                <div>
      <span
          className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 10 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"/>
        </svg>
        highest {highest}
      </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Highest Open
                                    </dt>
                                    <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">{highestOpening}</dd>
                                </dl>
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Lowest
                                        Opening
                                    </dt>
                                    <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">{lowestOpening}</dd>
                                </dl>
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Highest
                                        closing
                                    </dt>
                                    <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">{highestClosing}</dd>
                                </dl>
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Lowest
                                        Opening
                                    </dt>
                                    <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">{lowestOpening}</dd>
                                </dl>
                            </div>

                            <div id="bar-chart"></div>
                            <div
                                className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                                <div className="flex justify-between items-center pt-5">
                                    <Select
                                        id="interval"
                                        required
                                        helperText="Select Exchange"
                                        defaultValue={selectedSymbol}
                                        onChange={(e) => {
                                            setSelectedSymbol(e.target.value);
                                        }}>
                                        {stockExchangeOptions.map((option) => <option>{option}</option>)}
                                    </Select>


                                    <p
                                        className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                                        Updated on {new Date(lastUpdated).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CandlestickGraph data={formatCandlestickData(timeSeriesData) as any}/>
                    </>
                }
                </> :
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Holy smokes!</strong>
                    <span className="block sm:inline">{errorInfo}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20"><title>Close</title><path
        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
                </div>
            }
        </div>
    );
};

export default Trending;
