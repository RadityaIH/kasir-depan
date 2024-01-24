import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Button, Card, CardHeader, Input, Typography } from "@material-tailwind/react";
import TabelPenjualan from "@/components/penjualan/tablePenjualan";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditSO() {
    const router = useRouter();
    const { SO } = router.query;
    return (
        <>
            <Head>
                <title>Detail Penjualan</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-2">Detail Penjualan</Typography>
                    <div>
                        <button onClick={() => router.back()} className="flex items-center gap-1 hover:bg-blue-gray-100/40 rounded-lg p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1024 1024"
                            className="w-6 h-6"
                        >
                            <path 
                                fill="#ea5a0c"
                                d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-.8 88.8l309.6 280z" />
                        </svg>
                            <Typography variant="h6" className="text-orange">Kembali</Typography>
                        </button>
                    </div>
                    <h1 className="mt-5">Edit Sales Order {SO}</h1>
                    <p>Edit Order</p>
                </div>
            </Card>
        </>
    )
}