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
    const { data: resSO, error } = useSWR(`${process.env.BACKEND_API}/getSOperDate`, fetcher);
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Dashboard</Typography>
                    { (!error && !!resSO) && <LineChartAll value={resSO}/> }
                </div>
            </Card>
        </>
    )
}