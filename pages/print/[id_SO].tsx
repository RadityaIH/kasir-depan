import { Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

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

interface Product {
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    stok: number;
    remarks: string;
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

export default function PrintSO() {
    const router = useRouter();
    const { id_SO } = router.query;

    const { data: resSO, error } = useSWR(`${process.env.BACKEND_API}/getSOById/${id_SO}`, fetcher);
    const [data, setData] = useState<SOResponse>();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        if (resSO) {
            setData(resSO[0]);
            const parsedProducts: Product[] = [];

            const namaProduks: string[] = resSO[0].nama_produk.split(", ");
            const kodeProduks: string[] = resSO[0].kode_produk.split(", ");
            const qtys: string[] = resSO[0].qty.split(", ");
            const hargaItemPPNs: string[] = resSO[0].harga_item_ppn.split(", ");
            const remarksArray: string[] = resSO[0].remarks.split(',');

            // Menyiapkan objek produk untuk setiap produk
            for (let i = 0; i < namaProduks.length; i++) {
                const product: Product = {
                    id_produk: 0,
                    kode_produk: kodeProduks[i],
                    nama_produk: namaProduks[i],
                    qty: parseInt(qtys[i]),
                    harga: parseFloat(hargaItemPPNs[i]),
                    stok: 0,
                    remarks: remarksArray[i],
                };
                parsedProducts.push(product);
            }
            setProducts(parsedProducts);
        }
    }, [resSO]);
    console.log(products)

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

    useEffect(() => {
        if (data) {
            window.print()
        }
    }, [data])

    if (error) {
        return <div>Error loading</div>
    }
    return (
        <div className="mx-5">
            <Head>
                <title>Print SO</title>
            </Head>
            <div className="flex justify-center">
                <Typography variant="h4">SALES ORDER PRODUCT</Typography>
            </div>
            <div className="flex justify-between mt-10">
                <div className="flex w-1/2">
                    <Typography variant="h6" className="w-1/4">No:&nbsp;</Typography>
                    <Typography variant="paragraph">{data?.id_SO}</Typography>
                </div>
                <div className="flex w-1/2 justify-end">
                    <Typography variant="h6" className="w-1/4">Tanggal:&nbsp;</Typography>
                    <Typography variant="paragraph">{data && formatDate(data.tanggal_transaksi)}</Typography>
                </div>
            </div>
            <div className="mt-3 w-1/2">
                <div className="flex">
                    <Typography variant="h6" className="w-1/4">Customer:&nbsp;</Typography>
                    <Typography variant="paragraph">{data?.nama_cust}</Typography>
                </div>
                <div className="flex">
                    <Typography variant="h6" className="w-1/4">Alamat:&nbsp;</Typography>
                    <Typography variant="paragraph">{data?.alamat}</Typography>
                </div>
                <div className="flex">
                    <Typography variant="h6" className="w-1/4">No. Telp:&nbsp;</Typography>
                    <Typography variant="paragraph">{data?.no_telp}</Typography>
                </div>
            </div>
            <div className="flex justify-between mt-5">
                <div className="flex w-1/2">
                    <Typography variant="h6" className="w-auto">Estimasi Tanggal Kirim:&nbsp;&nbsp;&nbsp;</Typography>
                    <Typography variant="paragraph">{data && formatDate(data.jadwal_kirim)}</Typography>
                </div>
                <div className="flex w-1/2 justify-end">
                    <Typography variant="h6" className="w-1/3">Nama Sales:&nbsp;</Typography>
                    <Typography variant="paragraph">{data?.nama_sales}</Typography>
                </div>
            </div>
            <table className="w-full text-left mt-12 border border-collapse">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">No</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Nama Produk</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Kode Produk</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Qty</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Harga Satuan</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Total Harga</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 border">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((data, index) => (
                        <tr key={index} className="even:bg-blue-gray-50/50">
                            <td className="p-2 border border-blue-gray-100">{index + 1}</td>
                            <td className="p-2 border border-blue-gray-100">{data.nama_produk}</td>
                            <td className="p-2 border border-blue-gray-100">{data.kode_produk}</td>
                            <td className="p-2 border border-blue-gray-100">{data.qty}</td>
                            <td className="p-2 border border-blue-gray-100">{formatCurrency(data.harga)}</td>
                            <td className="p-2 border border-blue-gray-100">{formatCurrency(data.qty * data.harga)}</td>
                            <td className="p-2 border border-blue-gray-100">{data.remarks}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={6} className="p-2 border-b border border-blue-gray-100"><p className="text-center font-bold">Total</p></td>
                        <td className="p-1 border-b border border-blue-gray-100">{data && formatCurrency(data.total_harga)}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="p-2 border-b border border-blue-gray-100"><p className=" text-center font-bold">Down Payment 1</p></td>
                        <td className="p-1 border-b border border-blue-gray-100">{data?.metode_dp1}</td>
                        <td className="p-1 border-b border border-blue-gray-100">{data && formatCurrency(data.total_dp1)}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="p-2 border-b border border-blue-gray-100"><p className=" text-center font-bold">Down Payment 2</p></td>
                        <td className="p-1 border-b border border-blue-gray-100">{data && (data.metode_dp2 ? data.metode_dp2 : "-")}</td>
                        <td className="p-1 border-b border border-blue-gray-100">{data && (data.total_dp2 ? formatCurrency(data.total_dp2): "-")}</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="bg-blue-gray-50 p-2 border-b border border-blue-gray-100" color="lightblue"><p className="text-center font-bold">Balance Due</p></td>
                        <td className="p-1 border-b border border-blue-gray-100">{data && formatCurrency(data.balance_due)}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}