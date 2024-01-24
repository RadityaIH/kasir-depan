import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Card, CardHeader, Typography } from "@material-tailwind/react";

export default function Profile() {
    return (
        <>
            <Head>
                <title>Profil</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Profil</Typography>
                    <p>Ganti Foto Profil, Nama Lengkap, Username, dan Password</p>
                </div>
            </Card>
        </>
    )
}