import { Button, Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import _ from "lodash";
import Pagination from "../pagination";
import Link from "next/link";
import DialogFoto from "../profile/uploadFoto";
import { getCookie } from "cookies-next";
import axios from "axios";
import SalesDialog from "./salesDialog";

interface SalesResponse {
    Nama: string;
    penjualan: number;
}

interface SalesTableProps {
    TABLE_HEAD: string[];
    TABLE_ROWS: SalesResponse[];
}

export default function TabelSales({ TABLE_HEAD, TABLE_ROWS }: SalesTableProps) {
    const [posts, setposts] = useState<SalesResponse[]>([]);
    const [currentPage, setcurrentPage] = useState(1);

    const pageSize = 8;
    const handlePageChange = (page: number) => {
        setcurrentPage(page);
    };
    const paginate = (items: any[], pageNumber: number, pageSize: number) => {
        const startIndex = (pageNumber - 1) * pageSize;
        return _(items).slice(startIndex).take(pageSize).value();
    };

    const finalPosts = paginate(posts, currentPage, pageSize);

    useEffect(() => {
        setposts(TABLE_ROWS);
    }, [TABLE_ROWS]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen((cur) => !cur)
    };
    const [selectedIdSales, setSelectedIdSales] = useState<number>(0);
    const [selectedSalesName, setSelectedSalesName] = useState<string>("");

    return (
        <>
            <SalesDialog handleOpen={handleOpen} open={open} idSales={selectedIdSales} salesName={selectedSalesName}/>
            <Card className="overflow-auto h-auto" placeholder="">
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
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={TABLE_HEAD.length} className="text-center py-4 text-gray-900">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) :
                            finalPosts.map((data, rowIndex) => (
                                <tr key={rowIndex} className="even:bg-blue-gray-50/50">
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {data.No}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {data.Nama}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {data.Penjualan}
                                        </Typography>
                                    </td>
                                    <td>
                                        <div className="flex">
                                            <div className="p-2 hover:bg-blue-200 bg-blue-500 cursor-pointer border-1 border-solid rounded-xl"
                                            onClick={() =>  {
                                                handleOpen()
                                                setSelectedIdSales(data.id_sales)
                                                setSelectedSalesName(data.Nama)}}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="#FFF"
                                                >
                                                    <title />
                                                    <path d="M8 12a2 2 0 1 1-2-2 2 2 0 0 1 2 2Zm10-2a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm-6 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Card>
            <Pagination
                items={posts.length}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange} />
        </>
    )
}