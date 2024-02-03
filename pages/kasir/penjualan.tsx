import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Card, CardHeader, Input, Spinner, Typography } from "@material-tailwind/react";
import TabelPenjualan from "@/components/penjualan/tablePenjualan";
import { useEffect, useState } from "react";

const token = getCookie("token");

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
    remarks: string | null;
    status_terima: number; 
    tanggal_transaksi: string; 
    total_dp1: number; 
    total_dp2: number | null; 
    total_harga: number; 
}

export default function Penjualan() {
    const [resSO, setResSO] = useState<SOResponse[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchSOData = async () => {
            try {
                const token = getCookie("token");

                if (token) {
                    const response = await fetch(`${process.env.BACKEND_API}/getSO`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setResSO(data);
                    setLoading(false);
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchSOData();
    }, [token]);
    console.log(resSO)

    const TABLE_HEAD = ["No", "Sales Order", "Nama Customer", "Tanggal Transaksi", "Produk", "Sales", "Harga", "Balance Due", "Aksi"]

    const [data, setData] = useState<SOResponse[]>([]);
    useEffect(() => {
        setData(resSO);
    }, [resSO]);
    
    const [searched, setSearched] = useState(false);
    const handleSearchChange = (value: string) => {
        if (value === "") {
            // setData(dataFetch.products)
            setData(resSO);
        } else {
            // const filteredData = dataFetch.products.filter((row) => {
            const filteredData = resSO.filter((row: SOResponse) => {
                console.log(row.nama_cust.toLowerCase().includes(value.toLowerCase()) || row.nama_produk.toLowerCase().includes(value.toLowerCase()))
                return row.nama_cust.toLowerCase().includes(value.toLowerCase()) || row.nama_produk.toLowerCase().includes(value.toLowerCase());
            });
            setData(filteredData);
            setSearched(true);
        }
    };

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
      }));

    return (
        <>
            <Head>
                <title>Penjualan</title>
            </Head>
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">History Penjualan</Typography>
                    <p>Tabel History Penjualan. Bisa Updt Del. Filter search per waktu, status(lunas/belum), sales </p>
                    <p>Tabel: No, Nama Cust, Nama Produk, Qty, Tanggal Order, Tanggal Pelunasan</p>
                    <div className="justify-end flex">
                        <div className="w-4/12 mb-5">
                            <Input
                                label="Cari Nama Produk atau Customer"
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
                    {loading ? 
                        <div className="flex justify-center items-center h-screen">
                        <Spinner color="red" />
                        </div>
                    : <>
                    <TabelPenjualan TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} isSearched={searched}/>
                    </>
}
                </div>
            </Card>
        </>
    )
}