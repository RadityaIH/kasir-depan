import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { useState } from "react";
import Select from 'react-select'
import Success from "../success";

interface InputProps {
    onPrev: () => void;
    dataCust: { nama: string, no_telp: string, alamat: string }
    dataPage2: { sales: string, jadwal_kirim: string, id_produk: number, kode_produk: string, nama_produk: string, qty: number, harga: number, remarks: string }
    dataPage3: { total_harga: number, metodeBayar1Mix: string, metodeBayar2Mix: string, downPayment1: number, downPayment2: number, balance_due: number }
}

export default function InputPage4({ onPrev, dataCust, dataPage2, dataPage3 }: InputProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    const [saved, setSaved] = useState(false);
    const handleSubmit = () => {
        setSaved(true);
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

    }
    return (
        <>
            <Progress value={100} placeholder="" className="mb-3" color="red"></Progress>
            {saved &&
                <div className="flex justify-between gap-5 mt-10">
                    <div className="w-full">
                        <Success Title="Berhasil!" Caption="Transaksi berhasil disimpan" />
                    </div>
                    <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-lg" onClick={(e) => setSaved(false)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -2 32 32"
                            className="w-6"
                        >
                            <path
                                fill="#000"
                                fillRule="evenodd"
                                d="M30 21a2 2 0 0 1-2 2h-2.142A3.99 3.99 0 0 0 22 20H10a3.99 3.99 0 0 0-3.858 3H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v2Zm-8 5H10a2 2 0 0 1 0-4h12a2 2 0 0 1 0 4ZM8 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11H8V4Zm20 11h-2V4a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v11H4a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h2.142A3.988 3.988 0 0 0 10 28h12a3.988 3.988 0 0 0 3.858-3H28a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4Z"
                            />
                        </svg>
                        <Typography variant="paragraph">print</Typography>
                    </div>
                </div>
            }
            <Typography variant="h5" className="my-5 text-center">Rekap</Typography>

            <Typography variant="h6" className="my-5 text-center">Data Customer</Typography>
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


            <Typography variant="h6" className="my-5 text-center">Data Produk</Typography>
            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Nama Produk</Typography>
                </div>
                <Input
                    id="nama_produk"
                    name="nama_produk"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage2.nama_produk}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Kode Produk</Typography>
                </div>
                <Input
                    id="kode_produk"
                    name="kode_produk"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage2.kode_produk}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Harga</Typography>
                </div>
                <Input
                    id="harga"
                    name="harga"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formatCurrency(dataPage2.harga)}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Quantity</Typography>
                </div>
                <Input
                    id="qty"
                    name="qty"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage2.qty}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Estimasi Tanggal Pengantaran</Typography>
                </div>
                <Input
                    id="color"
                    name="color"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={dataPage2.jadwal_kirim}
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Remarks</Typography>
                </div>
                <Textarea
                    id="remarks"
                    name="remarks"
                    className="bg-gray-50"
                    value={dataPage2.remarks ? dataPage2.remarks : "-"}
                    disabled></Textarea>
            </div>


            <Typography variant="h6" className="my-5 text-center">Data Pembayaran</Typography>
            <div className="ml-1 mt-5 flex items-center">
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