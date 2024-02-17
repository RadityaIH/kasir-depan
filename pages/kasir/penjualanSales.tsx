import TabelSales from "@/components/penjualanSales/tableSales";
import { Button, Card, Input, Spinner, Typography, select } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import Select from 'react-select'
import DateInput from "@/components/transaksi/dateInput";

interface SalesResponse {
    Nama: string;
    penjualan: number;
}

interface OptionType {
    value: string;
    label: string;
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

export default function penjualanSales() {
    //Fetch and set options
    const { data: resSO, error } = useSWR(`${process.env.BACKEND_API}/getSalesAll`, fetcher);

    const newSalesOption: OptionType = { value: 'all', label: 'Semua' };

    const salesOptions: OptionType[] = resSO ? [newSalesOption, ...resSO.map((sales: any) => ({
        value: (sales.id_sales.toString()),
        label: sales.Nama
    }))] : [newSalesOption];

    const [selectedSales, setSelectedSales] = useState({ value: 'all', label: 'Semua' });
    const handleChangeSales = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedSales(selectedOption);
        }
    };

    const TABLE_HEAD = ["No", "Nama", "Penjualan", "Aksi"];

    const [data, setData] = useState<SalesResponse[]>([]); // Initialize with empty array

    useEffect(() => {
        if (resSO) {
            setData(resSO); // Update data when resSO changes
        }
    }, [resSO]);


    //DATE
    const [dateSQL1, setDateSQL1] = useState<string>("");
    const handleSetDateSQL1 = (tanggal: string) => {
        setDateSQL1(tanggal);
    };
    const [dateSQL2, setDateSQL2] = useState<string>("");
    const handleSetDateSQL2 = (tanggal: string) => {
        setDateSQL2(tanggal);
    };

    const handleFilter = async () => {
        try {
            const token = getCookie("token");

            if (token) {
                const response = await fetch(`${process.env.BACKEND_API}/getSalesAllByDate?dateStart=${dateSQL1}&dateEnd=${dateSQL2}`, {
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
                setData(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const handleReset = () => {
        handleSetDateSQL1("");
        handleSetDateSQL2("");
        setData(resSO)
    }


    const finalData = data.map((item, index) => ({
        ...item,
        No: index + 1,
    }));

    console.log(data)


    //Error
    if (error) {
        console.error('Fetch error:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <Typography variant="h5">Error fetching data</Typography>
            </div>
        );
    }

    if (!resSO) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="red" />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Penjualan Sales</title>
            </Head>
            <Card className="p-3 h-screen" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Penjualan Sales</Typography>

                    <div className="flex ml-1 mb-1 mt-5">
                        <Typography variant="paragraph">Pilih Sales</Typography>
                    </div>
                    <div className="ml-1">
                        <Select
                            id="pilih_customer"
                            name="pilih_customer"
                            value={selectedSales}
                            onChange={handleChangeSales}
                            options={salesOptions}
                            className="w-full bg-gray-50"
                        />
                    </div>
                    <div className="mt-2 mb-8 flex border border-gray-400 p-3 rounded-lg justify-between">
                        <Typography variant="paragraph" className="mr-3 font-semibold">Filter Date</Typography>
                        <div className="flex">
                            <Typography variant="paragraph" className="mr-3">From</Typography>
                            <div className="">
                                <DateInput key={`date1-${dateSQL1}`} dateSQL={dateSQL1} setDateSQL={handleSetDateSQL1} canBefore={true} />
                            </div>
                            <Typography variant="paragraph" className="mr-3 ml-3">To</Typography>
                            <div className="">
                                <DateInput key={`date2-${dateSQL2}`} dateSQL={dateSQL2} setDateSQL={handleSetDateSQL2} canBefore={true} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button color="red" placeholder="" onClick={handleReset}>Batal</Button>
                            <Button className="bg-gray-100 border border-blue-500" placeholder="" onClick={handleFilter}>
                                <p className="text-blue-500">Filter</p>
                            </Button>
                        </div>
                    </div>
                    {selectedSales.value === "all" ?
                        <TabelSales TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={finalData} />
                        :
                        <div className="">
                            <p>{selectedSales.label}</p>
                        </div>}
                </div>
                <div className="fixed bottom-5 right-5">
                    <button className="ml-1 mt-3 p-3 rounded-full bg-orange"
                        // onClick={handleAddProduct}
                        type="button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-8"
                        >
                            <title />
                            <g
                                fill="none"
                                stroke="#FFF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                data-name="add"
                            >
                                <path d="M12 19V5M5 12h14" />
                            </g>
                        </svg>
                    </button>
                </div>
            </Card>
        </>
    );
}
