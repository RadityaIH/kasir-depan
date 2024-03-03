import { Input, Typography } from "@material-tailwind/react"
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import _ from "lodash";
import Pagination from "../pagination";
import AddKasirDialog from "./addKasir";
import ConfirmDialog from "../penjualan/confirmDialog";

interface KasirResponse {
    id: number;
    nama: string;
    username: string;
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

export default function AkunKasir({ changes, handleChanges }: InputProps) {
    //FETCHING DATA
    const { data: resKasir, error } = useSWR(
        `${process.env.BACKEND_API}/getKasir`,
        fetcher,
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
        }
    );
    useEffect(() => {
        mutate(`${process.env.BACKEND_API}/getKasir`);
    }, [changes]);

    const [data, setData] = useState<KasirResponse[]>([]);
    useEffect(() => {
        if (resKasir) {
            setData(resKasir); // Update data when resKasir changes
        }
    }, [resKasir]);

    //SEARCH HANDLE
    const handleSearchChange = (value: string) => {
        if (value === "") {
            setData(resKasir);
        } else {
            const filteredData = resKasir.filter((row: any) => {
                return row.nama.toLowerCase().includes(value.toLowerCase()) || row.username.toLowerCase().includes(value.toLowerCase());
            });
            setData(filteredData);
        }
    };

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));

    //PAGINATION
    const [posts, setposts] = useState<KasirResponse[]>([]);
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

    const TABLE_HEAD = ["No", "Nama Lengkap", "Username", "Aksi"]

    //Edit
    const [selectedIdKasir, setSelectedIdKasir] = useState<number>(0);
    const [selectedNamaKasir, setSelectedNamaKasir] = useState<string>("");
    const [selectedUsernameKasir, setSelectedUsernameKasir] = useState<string>("");
    const [kasir, setKasir] = useState<KasirResponse>({
        id: 0,
        nama: "",
        username: "",
    });
    useEffect(() => {
        setKasir({
            id: selectedIdKasir,
            nama: selectedNamaKasir,
            username: selectedUsernameKasir,
        });
    }, [selectedIdKasir, selectedNamaKasir, selectedUsernameKasir]);
    const [openKasir, setOpenKasir] = useState(false);
    const handleOpenKasir = () => {
        setOpenKasir((cur) => !cur)
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
                const response = await fetch(`${process.env.BACKEND_API}/deleteKasir/${id}`, {
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
            <AddKasirDialog handleOpen={handleOpenKasir} open={openKasir} handleChanges={handleChanges} op={"Update"} kasir={kasir} />
            <div className="justify-end flex">
                <div className="w-4/12 mb-5">
                    <Input
                        placeholder="Cari Nama atau Username Kasir"
                        crossOrigin=""
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
                        onChange={(e) => handleSearchChange(e.target.value)}
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
                    {finalPosts.map((data, index) => (
                        <tr key={index} className="even:bg-blue-gray-50/50">
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.No}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.nama}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.username}
                                </Typography>
                            </td>
                            <td>
                                <div className="flex items-center">
                                    <div className="inline-block ml-2">
                                        <div className={`p-2 hover:bg-yellow-400 rounded-xl cursor-pointer bg-yellow-700`}
                                            onClick={() => {
                                                handleOpenKasir()
                                                setSelectedIdKasir(data.id)
                                                setSelectedNamaKasir(data.nama)
                                                setSelectedUsernameKasir(data.username)
                                            }}
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
                                        <div className={`p-2 hover:bg-red-300 rounded-xl cursor-pointer bg-red-500`}
                                        onClick={(e) => handleOpenDeleteDialog(data.id)}
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
        </div>
    )
}