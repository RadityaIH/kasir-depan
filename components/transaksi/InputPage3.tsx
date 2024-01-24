import { Button, Input, Option, Progress, Radio, Select, Typography } from "@material-tailwind/react";
import { useState } from "react";

interface InputProps {
    onPrev: () => void;
    onNext: () => void;
}

export default function InputPage3 ({ onPrev, onNext }: InputProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };
    return (
        <>
        <Progress value={66} placeholder="" className="mb-3" color="red"></Progress>
        <Typography variant="h5" className="my-5 text-center">Data Pembayaran</Typography>

        <form>
            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Total Harga</Typography>
                </div>
                <Input
                    id="total_harga"
                    name="total_harga"
                    crossOrigin=""
                    className="bg-gray-50"
                    disabled
                    value={"5.500.000"}></Input>
            </div>

            <div className="flex ml-1 mt-5 items-center">
                <div className="w-1/5">
                    <Typography variant="paragraph">Metode Pembayaran</Typography>
                </div>

                <div className="" id="metode_bayar">
                    <Radio name="type" label="Cash" color="red" crossOrigin=""/>
                    <Radio name="type" label="Debit" color="red" crossOrigin=""/>
                    <Radio name="type" label="CC" color="red" crossOrigin=""/>
                </div>
            </div>

            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/5">
                    <Typography variant="paragraph">Bank</Typography>
                </div>
                <div className="w-1/4">
                    <Select placeholder="" label="Bank yang Digunakan">
                        <Option>Mandiri</Option>
                        <Option>BNI</Option>
                    </Select>
                </div>
            </div>
            
            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Down Payment</Typography>
                </div>
                <Input
                    id="down_payment"
                    name="down_payment"
                    type="number"
                    crossOrigin=""
                    className="bg-gray-50"
                    label="Biaya yang dibayarkan saat ini"></Input>
            </div>

            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Balance Due</Typography>
                    {/** Total Harga - Down Payment. AUTO!*/}
                </div>
                <Input
                    id="balance_due"
                    name="balance_due"
                    type="number"
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
                    className="bg-blue-500 mt-5"
                    // type="submit"
                    onClick={onNext}
                    placeholder="">
                    Selanjutnya
                </Button>
            </div>
        </form>
        </>
    )
}