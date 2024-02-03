import { Card, Typography } from "@material-tailwind/react";
import Head from "next/head";

export default function penjualanSales() {
    return (
        <>
            <Head>
                <title>Penjualan Sales</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Penjualan Sales</Typography>
                    <p>Tabel Sales</p>
                </div>
            </Card>
        </>
    )
}