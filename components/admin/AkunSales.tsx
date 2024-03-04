import { Input, Select, Option, Typography } from "@material-tailwind/react"
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Pagination from "../pagination";
import _ from "lodash";
import AddSalesDialog from "./addSales";
import ConfirmDialog from "../penjualan/confirmDialog";

interface SalesResponse {
    id_sales: number;
    nama_sales: string;
    aktif: number;
}

interface InputProps {
    changes: number;
    handleChanges: () => void;
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

export default function AkunSales({ changes, handleChanges }: InputProps) {
    //FETCHING DATA
    const { data: resSales, error } = useSWR(
        `${process.env.BACKEND_API}/getAllSales`,
        fetcher,
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
        }
    );
    useEffect(() => {
        mutate(`${process.env.BACKEND_API}/getAllSales`);
    }, [changes]);

    const [data, setData] = useState<SalesResponse[]>([]);
    useEffect(() => {
        if (resSales) {
            setData(resSales); // Update data when resSales changes
        }
    }, [resSales]);

    //HANLDE SEARCH
    const [statusAktif, setStatusAktif] = useState<string>("aktif");
    const [searchValue, setSearchValue] = useState<string>("");
    useEffect(() => {
        let filteredData = resSales; // Gunakan resSales sebagai data awal

        // Filter berdasarkan statusAktif
        if (statusAktif === "aktif") {
            filteredData = resSales.filter((row: any) => row.aktif === 1);
        } else if (statusAktif === "tidak") {
            filteredData = resSales.filter((row: any) => row.aktif === 0);
        }

        // Filter berdasarkan pencarian
        if (searchValue !== "") {
            filteredData = filteredData.filter((row: any) =>
                row.nama_sales.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setData(filteredData); // Update data setelah filter dan pencarian
    }, [statusAktif, searchValue, resSales]);


    // const handleSearchChange = (value: string) => {
    //     if (value === "") {
    //         setData(resSales);
    //     } else {
    //         const filteredData = resSales.filter((row: any) => {
    //             return row.nama_sales.toLowerCase().includes(value.toLowerCase());
    //         });
    //         setData(filteredData);
    //     }
    // };

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));

    //PAGINATION
    const [posts, setposts] = useState<SalesResponse[]>([]);
    const [currentPage, setcurrentPage] = useState(1);

    const pageSize = 5;
    const handlePageChange = (page: number) => {
        setcurrentPage(page);
    };
    const paginate = (items: any[], pageNumber: number, pageSize: number) => {
        const startIndex = (pageNumber - 1) * pageSize;
        return _(items).slice(startIndex).take(pageSize).value();
    };

    const finalPosts = paginate(posts, currentPage, pageSize);

    useEffect(() => {
        if (data) {
            setposts(finalData);
        }
    }, [data]);

    const TABLE_HEAD = ["No", "Nama Lengkap", "Aksi"]

    //EDIT
    const [selectedIdSales, setSelectedIdSales] = useState<number>(0);
    const [selectedNamaSales, setSelectedNamaSales] = useState<string>("");
    const [sales, setSales] = useState<SalesResponse>({
        id_sales: 0,
        nama_sales: "",
        aktif: 1,
    });
    useEffect(() => {
        setSales({
            id_sales: selectedIdSales,
            nama_sales: selectedNamaSales,
            aktif: 1,
        });
    }, [selectedIdSales, selectedNamaSales]);
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => {
        setOpenSales((cur) => !cur)
    };

    //delete
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedIdToDelete, setSelectedIdtoDelete] = useState("");

    const handleOpenDeleteDialog = (id_SO: string) => {
        setSelectedIdtoDelete(id_SO);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        await handleDelete(selectedIdToDelete);
        setOpenDeleteDialog(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const token = getCookie("token");
            if (token) {
                const response = await fetch(`${process.env.BACKEND_API}/deleteSales/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            handleCloseDeleteDialog();
            handleChanges();
        } catch (error: any) {
            console.error('Fetch error');
        }
    }

    return (
        <div>
            <ConfirmDialog
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
                head="Konfirmasi Hapus Data"
                message="Apakah anda yakin ingin menghapus data ini?"
            />
            <AddSalesDialog handleOpen={handleOpenSales} open={openSales} handleChanges={handleChanges} op={"Update"} sales={sales} />
            <div className="justify-between flex">
                <div className="w-4/12 mb-5">
                    <Select placeholder="" label="Pilih Status Aktif" value={statusAktif} onChange={(value) => setStatusAktif(value as string)}>
                        <Option value="all">Semua</Option>
                        <Option value="aktif">Aktif</Option>
                        <Option value="tidak">Tidak Aktif</Option>
                    </Select>
                </div>
                <div className="w-4/12 mb-5">
                    <Input
                        placeholder="Cari Nama Sales"
                        crossOrigin=""
                        value={searchValue}
                        icon={<svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                        >
                            <path
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.796 15.811 21 21m-3-10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                            />
                        </svg>}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((item, index) => (
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4" key={index}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    classname="leading-none opacity-70 font-bold">
                                    {item}
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
                        finalPosts.map((data, index) => (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.No}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" classname="font-normal">
                                        {data.nama_sales}
                                    </Typography>
                                </td>
                                <td>
                                    <div className="flex items-center">
                                        <div className="inline-block ml-2">
                                            <div className={`${data.aktif === 1 ? `cursor-pointer bg-yellow-700` : `bg-yellow-500/35 cursor-not-allowed`} p-2 hover:bg-yellow-400 rounded-xl `}
                                                onClick={() => {
                                                    handleOpenSales()
                                                    setSelectedIdSales(data.id_sales)
                                                    setSelectedNamaSales(data.nama_sales)
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        fill={`${data.aktif === 1 ? `#000` : `#999`}`}
                                                        fillRule="evenodd"
                                                        d="M21.121 2.707a3 3 0 0 0-4.242 0l-1.68 1.68-7.906 7.906a1 1 0 0 0-.263.464l-1 4a1 1 0 0 0 1.213 1.213l4-1a1 1 0 0 0 .464-.263l7.849-7.848 1.737-1.738a3 3 0 0 0 0-4.242l-.172-.172Zm-2.828 1.414a1 1 0 0 1 1.414 0l.172.172a1 1 0 0 1 0 1.414l-1.017 1.017-1.555-1.617.986-.986Zm-2.4 2.4 1.555 1.617-6.96 6.959-2.114.529.529-2.115 6.99-6.99ZM4 8a1 1 0 0 1 1-1h5a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5a1 1 0 0 0-2 0v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="inline-block ml-2">
                                            <div className={`${data.aktif === 1 ? `cursor-pointer bg-red-500` : `bg-red-500/35 cursor-not-allowed`} p-2 hover:bg-red-300 rounded-xl `}
                                                onClick={(e) => handleOpenDeleteDialog(data.id_sales)}
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
            <Pagination
                items={posts.length}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange} />
        </div >
    )
}