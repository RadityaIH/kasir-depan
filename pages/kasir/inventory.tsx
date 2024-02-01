import Head from "next/head";
import { Card, Input, Typography, Spinner } from "@material-tailwind/react";
import InventoryTable from "@/components/inventory/tableinventory";
import { useEffect, useState } from "react";

interface Product {
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
    deskripsi: string;
    harga: number;
}

export default function Inventory() {
    const TABLE_HEAD = ["No", "Kode", "Nama", "Stok", "Harga"]
    
    const [dataFetch, setDataFetch] = useState<{ products: Product[] }>({ products: [] });
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('https://gudang-back-end.vercel.app/products')
        .then(response => response.json())
        .then((dataFetch) => {
            setDataFetch(dataFetch)
            setLoading(false)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
        })
    }, [])

    const [data, setData] = useState<Product[]>([]);
    useEffect(() => {
        setData(dataFetch.products);
    }, [dataFetch]);
    
    const [searched, setSearched] = useState(false);
    const handleSearchChange = (value: string) => {
        if (value === "") {
            setData(dataFetch.products);
        } else {
            const filteredData = dataFetch.products.filter((row) => {
                return row.kode_produk.toLowerCase().includes(value.toLowerCase()) || row.nama_produk.toLowerCase().includes(value.toLowerCase());
            });
            setData(filteredData);
            setSearched(true);
        }
    };

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
      }));

    console.log(data)

    return (
        <>
            <Head>
                <title>Inventory</title>
            </Head>
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Inventory Gudang</Typography>
                    
                    <div className="justify-end flex">
                        <div className="w-4/12 mb-5">
                            <Input
                                label="Cari Kode atau Nama Produk"
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
                    <InventoryTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} isSearched={searched}/>
                    </>}
                </div>
            </Card>
        </>
    )
}