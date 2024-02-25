import { Card, Dialog, Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface InputProps {
    handleOpen: () => void;
    open: boolean;
    idSales: number;
    salesName: string
}

interface SalesResultResponse {
    sales_id: number;
    id_SO: number;
    tanggal_transaksi: string;
    nama_cust: string;
    total_harga: number;
}

const fetcher = async (url: string) => {
    const token = getCookie("token");
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};

export default function SalesDialog({handleOpen, open, idSales, salesName}: InputProps) {
    const TABLE_HEAD = ["No", "Tanggal", "SO", "Nama Customer", "Harga"]

    const { data: resSalesResult, error } = useSWR(`${process.env.BACKEND_API}/getSalesResult/${idSales}`, fetcher);
    const [data, setData] = useState<SalesResultResponse[]>([]); // Initialize with empty array

    useEffect(() => {
        if (resSalesResult) {
            setData(resSalesResult); // Update data when resSalesResult changes
        }
    }, [resSalesResult]);

    function formatDate(dateString: string) {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${months[monthIndex]} ${year}`;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    return (
        <Dialog
            size="sm"
            open={open}
            handler={handleOpen}
            className="bg-transparent shador-none"
            placeholder="">
            <Card placeholder="" className="overflow-y-auto p-3">
                <>
                <div className="flex justify-between">
                    <Typography variant="h6" className="my-1 mt-3 text-center">Nama Sales:  {salesName}</Typography>
                    <p className="text-red-500 mr-1 cursor-pointer" onClick={handleOpen}>X</p>
                </div>

                <div>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4" key={index}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            classname="leading-none opacity-70 font-bold">
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="text-center py-4 text-gray-900">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) :
                                data.map((data, rowIndex) => (
                                    <tr key={rowIndex} className="even:bg-blue-gray-50/50">
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" classname="font-normal">
                                                {rowIndex + 1}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" classname="font-normal">
                                                {formatDate(data.tanggal_transaksi)}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" classname="font-normal">
                                                {data.id_SO}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" classname="font-normal">
                                                {data.nama_cust}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" classname="font-normal">
                                                {formatCurrency(data.total_harga)}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4} className="p-4 bg-blue-gray-50  text-center">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            Total
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {formatCurrency(data.reduce((acc, curr) => acc + curr.total_harga, 0))}
                                        </Typography>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
                </>
            </Card>
        </Dialog>
    )
}