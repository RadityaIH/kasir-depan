import InputPage2 from "@/components/transaksi/InputPage2";
import { Card, Typography } from "@material-tailwind/react";
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

export default function EditSO() {
    //fetch from parameter
    const router = useRouter();
    const { id_SO } = router.query;

    //fetch data SO from db
    const { data: resSO, error } = useSWR(`${process.env.BACKEND_API}/getSOById/${id_SO}`, fetcher);
    const [data, setData] = useState<SOResponse[]>([]); // Initialize with empty array
    useEffect(() => {
        if (resSO) {
            setData(resSO); // Update data when resSO changes
            if (resSO[0].status_terima === 1) {
                router.push("/kasir/penjualan");
            }
        }
    }, [resSO]);

    //Page state based on 'transaksi'
    const [currentPage, setCurrentPage] = useState(1);

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    }

    const [dataCust, setDataCust] = useState({ nama: "", no_telp: "", alamat: "" });
    const [dataPage2, setDataPage2] = useState({ sales: "", salesId: 0, jadwal_kirim: "", produkPage2: [], total_harga: 0 });
    const [dataPage3, setDataPage3] = useState({ total_harga: 0, metodeBayar1Mix: "", metodeBayar2Mix: "", downPayment1: 0, downPayment2: 0, balance_due: 0 })

    const [savedStat, setSavedStat] = useState(false);
    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            if (currentPage !== 1 && !savedStat) {
                event.preventDefault();
                event.returnValue = "Data yang sedang dimasukkan akan hilang jika anda keluar dari halaman ini, yakin?";
            }
        };

        const handleRouteChangeStart = (url: string, { shallow }: { shallow: boolean }) => {
            if (currentPage !== 1 && !savedStat) {
                if (!window.confirm("Data yang sedang dimasukkan akan hilang jika anda keluar dari halaman ini, yakin?")) {
                    router.events.emit("routeChangeError");
                    throw 'routeChange aborted.';
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        router.events.on("routeChangeStart", handleRouteChangeStart);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            router.events.off("routeChangeStart", handleRouteChangeStart);
        };
    }, [currentPage, router, savedStat]);

    return (
        <>
            <Head>
                <title>Edit {id_SO}</title>
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
                    <Card className="p-3 border-solid border-2" placeholder="">
                        {data[0].nama_produk}
                    </Card>
                </div>
            </Card>
        </>
    )
}