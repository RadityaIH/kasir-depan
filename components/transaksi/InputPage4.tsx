import { Button, Card, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { useState } from "react";
import Select from 'react-select'
import Success from "../success";
import { getCookie } from "cookies-next";
import axios from "axios";
import Fail from "../fail";
import Link from "next/link";

interface InputProps {
    onPrev: () => void;
    dataCust: { nama: string, no_telp: string, alamat: string }
    dataPage2: { salesId: number, sales: string, jadwal_kirim: string, produkPage2: ProductChosen[], total_harga: number };
    dataPage3: { total_harga: number, metodeBayar1Mix: string, metodeBayar2Mix: string, downPayment1: number, downPayment2: number, balance_due: number }
    setSavedStat: (data: boolean) => void;
}

interface ProductChosen {
    idx: number
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    remarks: string;
}
const token = getCookie("token");

export default function InputPage4({ onPrev, dataCust, dataPage2, dataPage3, setSavedStat }: InputProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    function formatDate(dateString: string) {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${months[monthIndex]} ${year}`;
    }

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(false);
    const [id_SO, setId_SO] = useState("");
    const handleSubmit = async (event: any) => {
        event.preventDefault()

        try {
            const token = getCookie("token");

            if (token) {
                const response = await axios.post(`${process.env.BACKEND_API}/addSO`, {
                    nama_cust: dataCust.nama,
                    no_telp: dataCust.no_telp,
                    alamat: dataCust.alamat,
                    sales_id: dataPage2.salesId,
                    jadwal_kirim: dataPage2.jadwal_kirim,
                    produkPage2: dataPage2.produkPage2,
                    total_harga: dataPage3.total_harga,
                    metode_dp1: dataPage3.metodeBayar1Mix,
                    total_dp1: dataPage3.downPayment1,
                    metode_dp2: dataPage3.metodeBayar2Mix,
                    total_dp2: dataPage3.downPayment2,
                    balance_due: dataPage3.balance_due
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                setSaved(true);
                setSavedStat(true)
                setError(false);
                setId_SO(response.data.id_SO);
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        } catch (error: any) {
            console.error('Fetch error');
            setSaved(false)
            setSavedStat(false)
            setError(true);
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    const handleReload = () => {
        window.location.reload();
    }

    // console.log("cust:", dataCust)
    // console.log("page2:", dataPage2)
    // console.log("page3:", dataPage3)
    return (
        <>
            <Progress value={100} placeholder="" className="mb-3" color="red"></Progress>
            {saved &&
                <>
                    <div className="flex justify-between gap-5 mt-10">
                        <div className="w-full">
                            <Success Title="Berhasil!" Caption="Transaksi berhasil disimpan. Periksa halaman&ldquo;Penjualan&rdquo;" />
                        </div>
                        <Link href={`/print/${id_SO}`} target="blank">
                            <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -2 32 32"
                                    className="w-6 ml-1"
                                >
                                    <path
                                        fill="#000"
                                        fillRule="evenodd"
                                        d="M30 21a2 2 0 0 1-2 2h-2.142A3.99 3.99 0 0 0 22 20H10a3.99 3.99 0 0 0-3.858 3H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v2Zm-8 5H10a2 2 0 0 1 0-4h12a2 2 0 0 1 0 4ZM8 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11H8V4Zm20 11h-2V4a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v11H4a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h2.142A3.988 3.988 0 0 0 10 28h12a3.988 3.988 0 0 0 3.858-3H28a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4Z"
                                    />
                                </svg>
                                <Typography variant="paragraph">print</Typography>
                            </div>
                        </Link>
                    </div>
                    <Typography variant="paragraph" className="mt-2 flex justify-start">Transaksi Baru? <button className=" text-orange" onClick={handleReload}>Klik Disini</button></Typography>
                </>
            }
            {error && <Fail Title="Gagal Menyimpan!" Caption="Terjadi kesalahan" />}
            <Typography variant="h5" className="my-1 text-center">{saved ? "" : "Konfirmasi"} Sales Order {saved ? id_SO : ""}</Typography>

            {/* <Typography variant="h6" className="my-1 text-center">Data Customer</Typography> */}
            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Nama</Typography>
                </div>
                <Input
                    id="nama"
                    name="nama"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataCust.nama}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">No Telepon</Typography>
                </div>
                <Input
                    id="no_customer"
                    name="no_customer"
                    type="number"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataCust.no_telp}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Alamat</Typography>
                </div>
                <Textarea
                    id="alamat"
                    name="alamat"
                    className="bg-gray-50"
                    value={dataCust.alamat}
                    disabled></Textarea>
            </div>


            <Typography variant="h6" className="my-1 mt-3 text-center">Produk</Typography>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Sales</Typography>
                </div>
                <Input
                    id="sales"
                    name="sales"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage2.sales}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 my-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Tanggal Pengantaran</Typography>
                </div>
                <Input
                    id="tgl_antar"
                    name="tgl_antar"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formatDate(dataPage2.jadwal_kirim)}
                    disabled></Input>
            </div>
            <div className="flex flex-wrap gap-7 justify-center">
                {dataPage2.produkPage2 && dataPage2.produkPage2.map((produk, idx) => (
                    <Card key={idx} placeholder="" className="p-3 w-2/5 border-solid border-2 bg-gray-50">
                        <Typography variant="h6" className="my-1 mt-3 text-center">Produk {idx + 1}</Typography>

                        <div className="ml-1 mt-3 flex items-center">
                            <div className="w-1/2">
                                <Typography variant="paragraph">Nama</Typography>
                            </div>
                            <Input
                                id="nama_produk"
                                name="nama_produk"
                                crossOrigin=""
                                className="bg-gray-50"
                                value={produk.nama_produk}
                                disabled
                            />
                        </div>
                        <div className="ml-1 mt-3 flex items-center">
                            <div className="w-1/2">
                                <Typography variant="paragraph">Kode</Typography>
                            </div>
                            <Input
                                id="kode_produk"
                                name="kode_produk"
                                crossOrigin=""
                                className="bg-gray-50"
                                value={produk.kode_produk}
                                disabled
                            />
                        </div>
                        <div className="ml-1 mt-3 flex items-center">
                            <div className="w-1/2">
                                <Typography variant="paragraph">Harga</Typography>
                            </div>
                            <Input
                                id="harga"
                                name="harga"
                                crossOrigin=""
                                className="bg-gray-50"
                                value={formatCurrency(produk.harga)}
                                disabled
                            />
                        </div>
                        <div className="ml-1 mt-3 flex items-center">
                            <div className="w-1/2">
                                <Typography variant="paragraph">Quantity</Typography>
                            </div>
                            <Input
                                id="qty"
                                name="qty"
                                crossOrigin=""
                                className="bg-gray-50"
                                value={produk.qty}
                                disabled
                            />
                        </div>
                        <div className="ml-1 mt-3 flex items-center">
                            <div className="w-1/2">
                                <Typography variant="paragraph">Remarks</Typography>
                            </div>
                            <Textarea
                                id="remarks"
                                name="remarks"
                                className="bg-gray-50"
                                value={dataPage2.produkPage2[idx].remarks ? produk.remarks : "-"}
                                disabled
                            />
                        </div>
                    </Card>
                ))}
            </div>


            <Typography variant="h6" className="my-6 text-center">Data Pembayaran</Typography>
            <div className="ml-1 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Total Harga</Typography>
                </div>
                <Input
                    id="total_harga"
                    name="total_harga"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formatCurrency(dataPage3.total_harga)}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Metode Pembayaran 1</Typography>
                </div>
                <Input
                    id="metode_bayar"
                    name="metode_bayar"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage3.metodeBayar1Mix}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Down Payment 1</Typography>
                </div>
                <Input
                    id="down_payment"
                    name="down_payment"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formatCurrency(dataPage3.downPayment1)}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Metode Pembayaran 2</Typography>
                </div>
                <Input
                    id="metode_bayar"
                    name="metode_bayar"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={(dataPage3.metodeBayar2Mix === " " || dataPage3.metodeBayar2Mix === " undefined") ? "-" : dataPage3.metodeBayar2Mix}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Down Payment 2</Typography>
                </div>
                <Input
                    id="down_payment"
                    name="down_payment"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage3.downPayment2 ? formatCurrency(dataPage3.downPayment2) : "-"}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Balance Due</Typography>
                </div>
                <Input
                    id="balance_due"
                    name="balance_due"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formatCurrency(dataPage3.balance_due)}
                    disabled></Input>
            </div>

            {!saved &&
                <div className="justify-between flex">
                    <Button
                        className="mt-5 ml-1 bg-gray-100 border border-blue-500"
                        // type="submit"
                        onClick={onPrev}
                        placeholder="">
                        <p className="text-blue-500">Sebelumnya</p>
                    </Button>
                    <Button
                        className="bg-green-500 mt-8"
                        onClick={handleSubmit}
                        placeholder="">
                        Konfirmasi & Simpan
                    </Button>
                </div>
            }
        </>
    )
}