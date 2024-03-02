import { Option, Select, Typography } from "@material-tailwind/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    TimeScale
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    TimeScale
);

interface InputProps {
    value: { tanggal_transaksi: string, Jumlah: number }[];
}

export default function LineChartAll({ value }: InputProps) {
    const [year, setYear] = useState<string>((new Date().getFullYear()).toString());
    const [filteredData, setFilteredData] = useState<{ tanggal_transaksi: string, Jumlah: number }[]>([]);

    useEffect(() => {
        // Filter data based on selected year
        const filtered = value.filter(item => {
            const transactionDate = new Date(item.tanggal_transaksi);
            const transactionYear = transactionDate.getFullYear().toString();
            return transactionYear === year;
        });
        setFilteredData(filtered);
    }, [year, value]);

    const generateChartData = () => {
        const chartData: { labels: string[], datasets: any[] } = {
            labels: [],
            datasets: [{
                label: 'Jumlah',
                data: [],
                borderColor: 'orange',
                fill: false,
                backgroundColor: 'black',
                pointRadius: 4,
                tension: 0.4
            }]
        };

        for (let i = 1; i <= 12; i++) {
            chartData.labels.push(i.toString());
            const transactionsInMonth = filteredData.filter(item => {
                const transactionDate = new Date(item.tanggal_transaksi);
                const transactionMonth = transactionDate.getMonth() + 1;
                return transactionMonth === i;
            });
            const totalAmount = transactionsInMonth.reduce((acc, curr) => acc + curr.Jumlah, 0);
            chartData.datasets[0].data.push(totalAmount);
        }

        return chartData;
    };

    const chartData = generateChartData();

    const options = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Bulan'
                },
            },
            y: {
                suggestedMin: 0,
                suggestedMax: 3,
                title: {
                    display: true,
                    text: 'Jumlah'
                },
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <>
            <div className="flex">
                <Typography variant="h4" className="mb-5 w-3/4 flex justify-center">Chart Penjualan</Typography>
                <div className="w-1/4">
                    <Select placeholder="" label="Pilih Tahun" value={year} onChange={(value) => setYear(value as string)}>
                        <Option value={(new Date().getFullYear() - 2).toString()}>{(new Date().getFullYear() - 2).toString()}</Option>
                        <Option value={(new Date().getFullYear() - 1).toString()}>{(new Date().getFullYear() - 1).toString()}</Option>
                        <Option value={new Date().getFullYear().toString()}>{new Date().getFullYear().toString()}</Option>
                    </Select>
                </div>
            </div>
            <div>
                <Line
                    data={chartData}
                    options={options}
                />
            </div>
        </>
    );
}
