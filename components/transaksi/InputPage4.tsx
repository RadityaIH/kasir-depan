import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { useState } from "react";
import Select from 'react-select'

interface InputProps {
    onPrev: () => void;
}

export default function InputPage4 ({ onPrev }: InputProps) {
    return (
        <>
        <Progress value={100} placeholder="" className="mb-3" color="red"></Progress>
        <Typography variant="h5" className="my-5 text-center">Rekap</Typography>
        
        <form>
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
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Color</Typography>
                </div>
                <Input
                    id="color"
                    name="color"
                    crossOrigin=""
                    className="bg-gray-50"
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
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Metode Pembayaran</Typography>
                </div>
                <Input
                    id="metode_bayar"
                    name="metode_bayar"
                    crossOrigin=""
                    className="bg-gray-50"
                    disabled></Input>
            </div>
            <div className="ml-1 mt-3 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Down Payment</Typography>
                </div>
                <Input
                    id="down_payment"
                    name="down_payment"
                    crossOrigin=""
                    className="bg-gray-50"
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
                    disabled></Input>
            </div>

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
                    // type="submit"
                    placeholder="">
                    Konfirmasi & Simpan
                </Button>
            </div>
        </form>
        </>
    )
}