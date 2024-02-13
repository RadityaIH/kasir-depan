import { Button, Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import _ from "lodash";
import Pagination from "../pagination";
import Link from "next/link";
import DialogFoto from "../profile/uploadFoto";
import { getCookie } from "cookies-next";
import axios from "axios";

interface SalesResponse {
    Nama: string;
    penjualan: number;
}

interface SalesTableProps {
    TABLE_HEAD: string[];
    TABLE_ROWS: SalesResponse[];
    isSearched: boolean;
}

export default function TabelSales({ TABLE_HEAD, TABLE_ROWS, isSearched }: SalesTableProps) {
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
        if (isSearched) {
            setcurrentPage(1);
        }
    }, [TABLE_ROWS]);

    return (
        <>
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
                                            <div className="p-2 hover:bg-gray-400 cursor-pointer border-1 border-solid rounded-xl"
                                            // onClick={() =>  {handleOpen()
                                            //                 setSelectedIdSO(data.id_SO)}}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Zm1 9h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2Zm0 8h9a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2Z" />
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