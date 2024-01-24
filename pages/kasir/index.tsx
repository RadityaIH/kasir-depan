import { useRouter } from "next/router";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Card, CardHeader, Typography } from "@material-tailwind/react";

const token = getCookie("token");

export default function dashboardKasir () {
    const router = useRouter();
    console.log(token)
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Dashboard</Typography>
                    <p>Line chart Penjualan</p>
                </div>
            </Card>
        </>
    )
}