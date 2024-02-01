import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Button, Card, CardHeader, Input, Option, Progress, Select, Textarea, Typography } from "@material-tailwind/react";
import InputPage1 from "@/components/transaksi/InputPage1";
import InputPage2 from "@/components/transaksi/InputPage2";
import InputPage3 from "@/components/transaksi/InputPage3";
import { useEffect, useState } from "react";
import InputPage4 from "@/components/transaksi/InputPage4";

export default function Transaksi() {
    const [currentPage, setCurrentPage] = useState(1);

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    }

    const [dataCust, setDataCust] = useState({ nama: "", no_telp: "", alamat: "" });
    const [dataPage2, setDataPage2] = useState({ sales: "", jadwal_kirim: "", id_produk: 0, kode_produk: "", nama_produk: "", qty: 0, harga: 0, remarks: "" });
    const [dataPage3, setDataPage3] = useState({ total_harga: 0, metodeBayar1Mix: "", metodeBayar2Mix: "", downPayment1: 0, downPayment2: 0, balance_due: 0 })

    if (currentPage !== 1) {
        window.onbeforeunload = function () {
            return "Data will be lost if you leave the page, are you sure?";
        };
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
                        {currentPage === 1 && <InputPage1 onNext={handleNext} dataCust={dataCust} setDataCust={setDataCust} />}
                        {currentPage === 2 && <InputPage2 onPrev={handlePrev} onNext={handleNext} dataPage2={dataPage2} setDataPage2={setDataPage2} />}
                        {currentPage === 3 && <InputPage3
                            onPrev={handlePrev}
                            onNext={handleNext}
                            total_harga={dataPage2.harga * (1.11 / 0.7) * dataPage2.qty}
                            dataPage3={dataPage3}
                            setDataPage3={setDataPage3} />}
                        {currentPage === 4 && <InputPage4 onPrev={handlePrev} dataCust={dataCust} dataPage2={dataPage2} dataPage3={dataPage3} />}
                    </Card>
                </div>
            </Card>
        </>
    )
}