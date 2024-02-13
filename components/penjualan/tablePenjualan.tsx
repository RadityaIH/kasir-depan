import { Button, Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import _ from "lodash";
import Pagination from "../pagination";
import Link from "next/link";
import DialogFoto from "../profile/uploadFoto";
import DialogEdit from "./editSO";
import { getCookie } from "cookies-next";
import axios from "axios";
import ConfirmDialog from "./confirmDialog";

interface SOResponse {
    alamat: string;
    balance_due: number;
    harga_item_ppn: string;
    id: number;
    id_SO: string;
    jadwal_kirim: string;
    kode_produk: string;
    metode_dp1: string;
    metode_dp2: string | null;
    nama_cust: string;
    nama_produk: string;
    nama_sales: string;
    no_telp: string;
    qty: string;
    remarks: string;
    status_terima: number;
    tanggal_transaksi: string;
    total_dp1: number;
    total_dp2: number | null;
    total_harga: number;
}

interface InventoryTableProps {
    TABLE_HEAD: string[];
    TABLE_ROWS: SOResponse[];
    isSearched: boolean;
    handleChanges: () => void;
}

export default function TabelPenjualan({ TABLE_HEAD, TABLE_ROWS, isSearched, handleChanges }: InventoryTableProps) {
    const [posts, setposts] = useState<SOResponse[]>([]);
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen((cur) => !cur)
    };
    const [selectedIdSO, setSelectedIdSO] = useState("")
    const [selectedSO, setSelectedSO] = useState<SOResponse>({} as SOResponse)
    useEffect(() => {
        const sSO = TABLE_ROWS.find((so) => so.id_SO === selectedIdSO)
        if (sSO) {
            setSelectedSO(sSO)
        }
    }, [selectedIdSO])
   
    
    //delete
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedIdSOToDelete, setSelectedIdSOToDelete] = useState("");

    const handleOpenDeleteDialog = (id_SO: string) => {
        setSelectedIdSOToDelete(id_SO);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        await handleDelete(selectedIdSOToDelete);
        setOpenDeleteDialog(false);
    };

    const handleDelete = async (id_SO: string) => {
        const sSO = TABLE_ROWS.find((so) => so.id_SO === id_SO)
        if (sSO?.status_terima === 1) {
            alert("Barang sudah diterima, tidak bisa dihapus")
            return
        }

        const token = getCookie("token");
        if (token) {
            try {
                const response = await axios.delete(`${process.env.BACKEND_API}/deleteSO/${id_SO}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                handleChanges()
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    }

    return (
        <>
            <ConfirmDialog
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
            />
            <DialogEdit handleOpen={handleOpen} open={open} selectedSO={selectedSO} />

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
                                            {formatDate(data.tanggal_transaksi)}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {data.nama_produk}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {data.nama_sales}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {formatCurrency(data.total_harga)}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" classname="font-normal">
                                            {formatCurrency(data.balance_due)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <div className="inline-block">
                                                    <div className="p-2 hover:bg-yellow-400 cursor-pointer bg-yellow-700 rounded-xl"
                                                    onClick={() =>  {handleOpen()
                                                                    setSelectedIdSO(data.id_SO)}}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fill="#000"
                                                                fillRule="evenodd"
                                                                d="M21.121 2.707a3 3 0 0 0-4.242 0l-1.68 1.68-7.906 7.906a1 1 0 0 0-.263.464l-1 4a1 1 0 0 0 1.213 1.213l4-1a1 1 0 0 0 .464-.263l7.849-7.848 1.737-1.738a3 3 0 0 0 0-4.242l-.172-.172Zm-2.828 1.414a1 1 0 0 1 1.414 0l.172.172a1 1 0 0 1 0 1.414l-1.017 1.017-1.555-1.617.986-.986Zm-2.4 2.4 1.555 1.617-6.96 6.959-2.114.529.529-2.115 6.99-6.99ZM4 8a1 1 0 0 1 1-1h5a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5a1 1 0 0 0-2 0v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                            </div>
                                            <div className="inline-block ml-2">
                                                <div className={`p-2 hover:bg-red-300 rounded-xl ${data.status_terima === 0 ? 'cursor-pointer bg-red-500' : 'bg-red-500/35 cursor-not-allowed'}`}
                                                onClick={(e) => data.status_terima === 0 ? handleOpenDeleteDialog(data.id_SO) : null}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            stroke="#FFF"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7ZM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
                                                        />
                                                    </svg>
                                                </div>
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