import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Pagination from "../pagination";
import _ from "lodash";

interface TableRow {
    No: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
    harga: number;
  }
interface InventoryTableProps {
    TABLE_HEAD: string[];
    TABLE_ROWS: TableRow[];  
    isSearched: boolean; 
}

export default function InventoryTable({ TABLE_HEAD, TABLE_ROWS, isSearched }: InventoryTableProps) {
    const [posts, setposts] = useState<TableRow[]>([]);
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
            <Card className="overflow-auto h-auto" placeholder={"table"}>
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
                ): 
                        finalPosts.map((data, rowIndex) => (
                            <tr key={rowIndex} className="even:bg-blue-gray-50/50">
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.No}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.kode_produk}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.nama_produk}
                                    </Typography>
                                </td>   
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.stok}
                                    </Typography>
                                </td> 
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.harga}
                                    </Typography>
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
                onPageChange={handlePageChange}/>
        </>
    )
}