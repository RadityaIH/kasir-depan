import { Typography } from "@material-tailwind/react"
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

interface SalesResponse {
    nama_sales: string;
}

interface InputProps {
    changes: number;
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

export default function AkunSales({changes}: InputProps) {
    const { data: resSO, error } = useSWR(
        `${process.env.BACKEND_API}/getSales`,
        fetcher,
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
        }
    );
    useEffect(() => {
        mutate(`${process.env.BACKEND_API}/getSales`);
    }, [changes]);

    const [data, setData] = useState<SalesResponse[]>([]);
    useEffect(() => {
        if (resSO) {
            setData(resSO); // Update data when resSO changes
        }
    }, [resSO]);

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));
    
    const TABLE_HEAD = ["No", "Nama Lengkap", "Aksi"]

    return (
        <div>
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
                    {finalData.map((data, index) => (
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
                                        <div className={`p-2 hover:bg-red-300 rounded-xl cursor-pointer bg-red-500`}
                                        // onClick={(e) => data.status_terima === 0 ? handleOpenDeleteDialog(data.id_SO) : null}
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
        </div>
    )
}