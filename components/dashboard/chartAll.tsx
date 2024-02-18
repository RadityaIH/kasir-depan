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
    const [month, setMonth] = useState<string>("1");
    const [filteredData, setFilteredData] = useState<{ tanggal_transaksi: string, Jumlah: number }[]>([]);

    useEffect(() => {
        // Filter data based on selected month
        const filtered = value.filter(item => {
            const transactionDate = new Date(item.tanggal_transaksi);
            const transactionMonth = transactionDate.getMonth() + 1;
            return transactionMonth.toString() === month;
        });
        setFilteredData(filtered);
    }, [month, value]);

    const generateChartData = () => {
        const chartData: { labels: string[], datasets: any[] } = {
            labels: [],
            datasets: [{
                label: 'Jumlah',
                data: [],
                borderColor: 'orange',
                fill: false,
                backgroundColor: 'black',
                pointRadius: 4
            }]
        };

        const daysInMonth = new Date(2024, parseInt(month), 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            chartData.labels.push(`${i}/${month}`);
            const transactionsOnDay = filteredData.filter(item => {
                const transactionDay = new Date(item.tanggal_transaksi).getDate();
                return transactionDay === i;
            });
            const totalAmount = transactionsOnDay.reduce((acc, curr) => acc + curr.Jumlah, 0);
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
                    text: 'Tanggal'
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
                    <Select placeholder="" label="Pilih Bulan" value={month} onChange={(value) => setMonth(value as string)}>
                        <Option value="1">Januari</Option>
                        <Option value="2">Februari</Option>
                        <Option value="3">Maret</Option>
                        <Option value="4">April</Option>
                        <Option value="5">Mei</Option>
                        <Option value="6">Juni</Option>
                        <Option value="7">Juli</Option>
                        <Option value="8">Agustus</Option>
                        <Option value="9">September</Option>
                        <Option value="10">Oktober</Option>
                        <Option value="11">November</Option>
                        <Option value="12">Desember</Option>
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