import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Button, Card, CardHeader, Input, Option, Progress, Select, Textarea, Typography } from "@material-tailwind/react";
import InputPage1 from "@/components/transaksi/InputPage1";
import InputPage2 from "@/components/transaksi/InputPage2";
import InputPage3 from "@/components/transaksi/InputPage3";
import { useState } from "react";
import InputPage4 from "@/components/transaksi/InputPage4";

export default function Transaksi() {
    const [currentPage, setCurrentPage] = useState(1);

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    }
    
    return (
        <>
            <Head>
                <title>Transaksi</title>
            </Head>
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Transaksi Baru</Typography>

                    <Card className="p-3 border-solid border-2" placeholder="">
                        {currentPage === 1 && <InputPage1 onNext={handleNext}/>}
                        {currentPage === 2 && <InputPage2 onPrev={handlePrev} onNext={handleNext}/>}
                        {currentPage === 3 && <InputPage3 onPrev={handlePrev} onNext={handleNext}/>}
                        {currentPage === 4 && <InputPage4 onPrev={handlePrev}/>}
                    </Card>
                </div>
            </Card>
        </>
    )
}