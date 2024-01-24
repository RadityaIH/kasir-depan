import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Card, CardHeader, Input, Typography } from "@material-tailwind/react";
import TabelPenjualan from "@/components/penjualan/tablePenjualan";
import { useEffect, useState } from "react";

export default function Penjualan() {
    const TABLE_HEAD = ["No", "Nama Cust", "Nama Produk", "Qty", "Tanggal Order", "Tanggal Pelunasan", "Aksi"]
    const TABLE_ROWS = [
        {
        nama_cust: 'Budi',
        nama_produk: 'Sofa',
        qty: 1,
        tgl_order: '2021-08-01',
        tgl_pelunasan: '2021-08-02'
        },
        {
        nama_cust: 'Anton',
        nama_produk: 'Kursi',
        qty: 2,
        tgl_order: '2021-08-01',
        tgl_pelunasan: '2021-08-02'
        },
    ]

    // const [data, setData] = useState<Product[]>([]);
    // useEffect(() => {
    //     setData(dataFetch.products);
    // }, [dataFetch]);
    const [data, setData] = useState(TABLE_ROWS);
    
    const [searched, setSearched] = useState(false);
    const handleSearchChange = (value: string) => {
        if (value === "") {
            // setData(dataFetch.products)
            setData(TABLE_ROWS);
        } else {
            // const filteredData = dataFetch.products.filter((row) => {
            const filteredData = TABLE_ROWS.filter((row) => {
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
            <Card className="p-3 h-screen" placeholder={"card"}>
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
                    <TabelPenjualan TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} isSearched={searched}/>
                </div>
            </Card>
        </>
    )
}