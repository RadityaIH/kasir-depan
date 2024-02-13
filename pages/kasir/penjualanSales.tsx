import TabelSales from "@/components/penjualanSales/tableSales";
import { Card, Input, Spinner, Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from 'swr';

interface SalesResponse {
    Nama: string;
    penjualan: number;
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

export default function penjualanSales() {
    const { data: resSO, error } = useSWR(`${process.env.BACKEND_API}/getSalesAll`, fetcher);

    const TABLE_HEAD = ["No", "Nama", "Penjualan", "Aksi"];

    const [data, setData] = useState<SalesResponse[]>([]); // Initialize with empty array

    useEffect(() => {
        if (resSO) {
            setData(resSO); // Update data when resSO changes
        }
    }, [resSO]);

    const [searched, setSearched] = useState(false);
    const handleSearchChange = (value: string) => {
        if (value === "") {
            setData(resSO); // Use resSO or initialize with empty array
        } else {
            const filteredData = (resSO).filter((row: SalesResponse) => {
                return row.Nama.toLowerCase().includes(value.toLowerCase());
            });
            setData(filteredData);
            setSearched(true);
        }
    };

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));

    if (error) {
        console.error('Fetch error:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <Typography variant="h5">Error fetching data</Typography>
            </div>
        );
    }

    if (!resSO) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="red" />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Penjualan Sales</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Penjualan Sales</Typography>

                    <div className="justify-end flex">
                        <div className="w-4/12 mb-5">
                            <Input
                                label="Cari Nama Sales"
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

                    <TabelSales TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} isSearched={searched} />
                </div>
                <div className="fixed bottom-5 right-5">
                        <button className="ml-1 mt-3 p-3 rounded-full bg-orange"
                            // onClick={handleAddProduct}
                            type="button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-8"
                            >
                                <title />
                                <g
                                    fill="none"
                                    stroke="#FFF"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    data-name="add"
                                >
                                    <path d="M12 19V5M5 12h14" />
                                </g>
                            </svg>
                        </button>
                    </div>
            </Card>
        </>
    );
}
