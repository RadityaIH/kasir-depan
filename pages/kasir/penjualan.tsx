import { getCookie, setCookie, deleteCookie } from "cookies-next";
import Head from "next/head";
import { Button, Card, CardHeader, Input, Option, Select, Spinner, Typography } from "@material-tailwind/react";
import TabelPenjualan from "@/components/penjualan/tablePenjualan";
import { useEffect, useState } from "react";
import DateInput from "@/components/transaksi/dateInput";
import { set } from "lodash";
import { da } from "date-fns/locale";

const token = getCookie("token");

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

export default function Penjualan() {
    const [changes, setChanges] = useState(0);
    const handleChanges = () => {
        setChanges(changes + 1);
    }

    const [resSO, setResSO] = useState<SOResponse[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchSOData = async () => {
            try {
                const token = getCookie("token");

                if (token) {
                    const response = await fetch(`${process.env.BACKEND_API}/getSO`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setResSO(data);
                    setLoading(false);
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchSOData();
    }, [token, changes]);
    // console.log(resSO)

    const TABLE_HEAD = ["No", "Sales Order", "Nama Customer", "Tanggal Transaksi", "Produk", "Status Kirim", "Pembayaran", "Harga", "Aksi"]

    const [data, setData] = useState<SOResponse[]>([]);
    useEffect(() => {
        setData(resSO);
    }, [resSO]);

    //DATE
    const [dateStart, setDateStart] = useState<string>("");
    const handleSetDateStart = (tanggal: string) => {
        setDateStart(tanggal);
    };
    const [dateEnd, setDateEnd] = useState<string>("");
    const handleSetDateEnd = (tanggal: string) => {
        setDateEnd(tanggal);
    };

    const handleReset = () => {
        handleSetDateStart("");
        handleSetDateEnd("");
        setSearchQuery("");
        setStatusPembayaran("all");
        setData(resSO)
        setSearched(false);
    }

    //STATUS PEMBAYARAN
    const [statusPembayaran, setStatusPembayaran] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searched, setSearched] = useState(false);

    //SEARCH
    useEffect(() => {
        let filteredData = resSO;

        // Filter berdasarkan status pembayaran
        if (statusPembayaran !== "all") {
            filteredData = filteredData.filter(item => {
                if (statusPembayaran === "lunas") {
                    return item.balance_due === 0; // Jika balance_due === 0, berarti lunas
                } else {
                    return item.balance_due !== 0; // Jika balance_due !== 0, berarti belum lunas
                }
            });
        }

        // Filter berdasarkan rentang tanggal
        if (dateStart && dateEnd) {
            filteredData = filteredData.filter(item => {
                const tanggalTransaksi = new Date(item.tanggal_transaksi).getTime();
                const tanggalMulaiTime = new Date(dateStart).getTime();
                const tanggalAkhirTime = new Date(dateEnd).getTime();
                return tanggalTransaksi >= tanggalMulaiTime && tanggalTransaksi <= tanggalAkhirTime;
            });
        } else if (dateStart) {
            filteredData = filteredData.filter(item => {
                const tanggalTransaksi = new Date(item.tanggal_transaksi).getTime();
                const tanggalMulaiTime = new Date(dateStart).getTime();
                return tanggalTransaksi >= tanggalMulaiTime;
            });
        } else if (dateEnd) {
            filteredData = filteredData.filter(item => {
                const tanggalTransaksi = new Date(item.tanggal_transaksi).getTime();
                const tanggalAkhirTime = new Date(dateEnd).getTime();
                return tanggalTransaksi <= tanggalAkhirTime;
            });
        }

        if (searchQuery) {
            filteredData = filteredData.filter(item => {
                return item.id_SO.toLowerCase().includes(searchQuery.toLowerCase()) || item.nama_cust.toLowerCase().includes(searchQuery.toLowerCase())
            });
        }
        if (statusPembayaran || dateStart || dateEnd || searchQuery) {
            setSearched(true);
        }
        setData(filteredData);
    }, [resSO, statusPembayaran, dateStart, dateEnd, searchQuery]);

    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));

    return (
        <>
            <Head>
                <title>Penjualan</title>
            </Head>
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">History Penjualan</Typography>
                    <div className="flex gap-3 justify-between mb-8">
                        <div className="flex border border-gray-400 p-3 rounded-lg">
                            <Typography variant="paragraph" className="mr-3 font-semibold">Filter Date</Typography>
                            <div className="flex">
                                <Typography variant="paragraph" className="mr-3">From</Typography>
                                <div className="">
                                    <DateInput key={`date1-${dateStart}`} dateSQL={dateStart} setDateSQL={handleSetDateStart} canBefore={true} />
                                </div>
                                <Typography variant="paragraph" className="mr-3 ml-3">To</Typography>
                                <div className="">
                                    <DateInput key={`date2-${dateEnd}`} dateSQL={dateEnd} setDateSQL={handleSetDateEnd} canBefore={true} />
                                </div>
                            </div>
                        </div>

                        <div className="w-1/4 2xl:flex 2xl:w-1/2 2xl:gap-7">
                            <div className="2xl:w-3/4">
                                <Input
                                    label="Cari SO atau Customer"
                                    crossOrigin=""
                                    value={searchQuery}
                                    icon={<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            stroke="#000"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.796 15.811 21 21m-3-10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                        />
                                    </svg>}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="mt-3 2xl:mt-0">
                                <Select placeholder="" label="Pilih Status Pembayaran" value={statusPembayaran} onChange={(value) => setStatusPembayaran(value as string)}>
                                    <Option value="all">Semua</Option>
                                    <Option value="lunas">Lunas</Option>
                                    <Option value="belumLunas">Belum Lunas</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="">
                            <Button color="red" placeholder="" onClick={handleReset}>X</Button>
                        </div>
                    </div>
                    {loading ?
                        <div className="flex justify-center items-center h-screen">
                            <Spinner color="red" />
                        </div>
                        : <>
                            <TabelPenjualan TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} isSearched={searched} handleChanges={handleChanges} />
                        </>
                    }
                </div>
            </Card>
        </>
    )
}