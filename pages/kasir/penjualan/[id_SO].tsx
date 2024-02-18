import ViewEditSO from "@/components/penjualan/editSO";
import InputPage2 from "@/components/transaksi/InputPage2";
import { Card, Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import { isEqual } from "lodash";
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

interface ProductChosen {
    idx: number
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    stok: number;
    remarks: string;
}

interface DataPage2State {
    sales: string;
    salesId: number;
    jadwal_kirim: string;
    produkPage2: ProductChosen[];
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

    const [dataView, setDataView] = useState({  id_SO: "", 
                                                nama_cust: "", 
                                                no_telp: "", 
                                                alamat: "", 
                                                total_harga: 0, 
                                                metodeBayar1Mix: "", 
                                                metodeBayar2Mix: "", 
                                                downPayment1: 0, 
                                                downPayment2: 0, 
                                                balance_due: 0,
                                                nama_sales: "",
                                                status_terima: 0,
                                                tanggal_transaksi: "",
                                                jadwal_kirim: ""})
    const [dataPage2, setDataPage2] = useState<DataPage2State>({ sales: "", salesId: 0, jadwal_kirim: "", produkPage2: [], total_harga: 0 });
    const [dataPage2Copy, setDataPage2Copy] = useState<DataPage2State>({ sales: "", salesId: 0, jadwal_kirim: "", produkPage2: [], total_harga: 0 });
    const [hargaLama, setHargaLama] = useState(0)
    useEffect(() => {
        if (resSO) {
            setData(resSO); // Update data when resSO changes
            if (resSO[0].status_terima === 1) {
                router.push("/kasir/penjualan");
            } else {
                // Page2
                const parsedProducts: ProductChosen[] = [];
    
                const namaProduks: string[] = resSO[0].nama_produk.split(", ");
                const kodeProduks: string[] = resSO[0].kode_produk.split(", ");
                const qtys: string[] = resSO[0].qty.split(", ");
                const hargaItemPPNs: string[] = resSO[0].harga_item_ppn.split(", ");
                const remarksArray: string[] = resSO[0].remarks.split(',');
    
                // Menyiapkan objek produk untuk setiap produk
                for (let i = 0; i < namaProduks.length; i++) {
                    const product: ProductChosen = {
                        idx: i,
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
    
                setDataPage2({
                    sales: resSO[0].nama_sales,
                    salesId: 0,
                    jadwal_kirim: resSO[0].jadwal_kirim,
                    produkPage2: parsedProducts,
                    total_harga: resSO[0].total_harga,
                });
                setDataPage2Copy({
                    sales: resSO[0].nama_sales,
                    salesId: 0,
                    jadwal_kirim: resSO[0].jadwal_kirim,
                    produkPage2: parsedProducts,
                    total_harga: resSO[0].total_harga,
                });

                setHargaLama(resSO[0].total_harga)
                setDataView({
                    id_SO: resSO[0].id_SO,
                    nama_cust: resSO[0].nama_cust,
                    no_telp: resSO[0].no_telp,
                    alamat: resSO[0].alamat,
                    total_harga: resSO[0].total_harga,
                    metodeBayar1Mix: resSO[0].metode_dp1,
                    metodeBayar2Mix: resSO[0].metode_dp2 ?? "", // Handle nullable metode_dp2
                    downPayment1: resSO[0].total_dp1,
                    downPayment2: resSO[0].total_dp2 ?? 0, // Handle nullable total_dp2
                    balance_due: resSO[0].balance_due,
                    nama_sales: resSO[0].nama_sales,
                    status_terima: resSO[0].status_terima,
                    tanggal_transaksi: resSO[0].tanggal_transaksi,
                    jadwal_kirim: resSO[0].jadwal_kirim,
                });
            }
        }
    }, [resSO]);

    const hasDataPage2Changed = () => {
        return !isEqual(dataPage2Copy.produkPage2, dataPage2.produkPage2);
    };
    
    //Page state based on 'transaksi'
    const [currentPage, setCurrentPage] = useState(1);

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    }
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
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-2">Edit Penjualan</Typography>
                    {currentPage === 1 &&
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
                    }
                    <Card className="p-3 border-solid border-2" placeholder="">
                        {currentPage === 1 && <ViewEditSO onNext={handleNext} data={dataView} dataPage2={dataPage2} hargaLama={hargaLama} productChanged={hasDataPage2Changed()}/>}
                        {currentPage === 2 && <InputPage2 onPrev={handlePrev} onNext={handleNext} dataPage2={dataPage2} setDataPage2={setDataPage2} canEdit={true} hargaLama={hargaLama}/>}
                    </Card>
                </div>
            </Card>
        </>
    )
}