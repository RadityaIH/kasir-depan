import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Card, CardHeader, Typography } from "@material-tailwind/react";
import LineChartAll from "@/components/dashboard/chartAll";
import useSWR from "swr";

const token = getCookie("token");

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

export default function DashboardKasir () {
    const { data: resSales, error: errSales } = useSWR(`${process.env.BACKEND_API}/getAllSales`, fetcher);
    const { data: resKasir, error: errKasir } = useSWR(`${process.env.BACKEND_API}/getKasir`, fetcher);
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-8">Dashboard</Typography>
                    <Typography variant="h5" className="mb-5">Statistik Akun</Typography>
                    <div className="flex gap-5">
                        <Card className="w-1/2 p-5 h-auto bg-orange text-white" placeholder={"card"}>
                            <div className="flex justify-between align-bottom">
                                <Typography variant="h6" className="mb-3">Jumlah Kasir</Typography>
                                <Typography variant="h1" className="mb-3">{resKasir && resKasir.length}</Typography>
                            </div>
                        </Card>
                        <Card className="w-1/2 p-5 h-auto bg-gray-200 text-gray-800 border-2" placeholder={"card"}>
                            <div className="flex justify-between align-bottom">
                                <Typography variant="h6" className="mb-3">Jumlah Sales Aktif</Typography>
                                <Typography variant="h1" className="mb-3">{resSales && resSales.filter((sale: { aktif: number; }) => sale.aktif === 1).length}</Typography>
                            </div>
                        </Card>
                    </div>
                    <div className="flex gap-5 mt-5">
                        <Card className="w-1/2 p-5 h-auto bg-gray-800 text-white border-2" placeholder={"card"}>
                            <div className="flex justify-between align-bottom">
                                <Typography variant="h6" className="mb-3">Jumlah Sales Tidak Aktif</Typography>
                                <Typography variant="h1" className="mb-3">{resSales && resSales.filter((sale: { aktif: number; }) => sale.aktif === 0).length}</Typography>
                            </div>
                        </Card>
                        <div className="w-1/2 p-5 h-auto">
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}