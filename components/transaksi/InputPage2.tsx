import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { useState } from "react";
import Select from 'react-select'

interface InputProps {
    onPrev: () => void;
    onNext: () => void;
}

interface OptionType {
    value: string;
    label: string;
}

export default function InputPage2({ onPrev, onNext }: InputProps) {
    const productOptions = [
        { value: 'KY-777', label: 'KY-777 - Kursi Kayu 1 Seat' },
        { value: 'MB-115', label: 'MB-115 - Kursi Ergonomis' },
        // Add more customer options as needed
    ];
    
    const [selectedProduct, setSelectedCustomer] = useState({ value: '', label: 'Daftar Produk' });
    
    const handleChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedCustomer(selectedOption);
        }
    };

    return (
        <>
            <Progress value={33} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="my-5 text-center">Data Produk</Typography>

            <form>
                <div className="flex ml-1 mb-1">
                    <Typography variant="paragraph">Pilih Produk</Typography>
                </div>
                <div className="ml-1">
                    <Select
                        id="pilih_produk"
                        name="pilih_produk"
                        value={selectedProduct}
                        onChange={handleChange}
                        options={productOptions}
                        className="w-full bg-gray-50"
                    />
                </div>

                <div className="ml-1 mb-1 mt-5">
                    <Typography variant="paragraph">Nama Produk</Typography>
                </div>
                <div className="ml-1">
                    <Input
                        id="nama_produk"
                        name="nama_produk"
                        crossOrigin=""
                        label="Nama Produk"
                        className="bg-gray-50"
                        disabled></Input>
                </div>

                <div className="ml-1 mb-1 mt-5">
                    <Typography variant="paragraph">Kode Produk</Typography>
                </div>
                <div className="ml-1">
                    <Input
                        id="kode_produk"
                        name="kode_produk"
                        crossOrigin=""
                        label="Kode Produk"
                        className="bg-gray-50"
                        disabled></Input>
                </div>

                <div className="ml-1 mb-1 mt-5">
                    <Typography variant="paragraph">Color</Typography>
                </div>
                <div className="ml-1">
                    <Input
                        id="color"
                        name="color"
                        crossOrigin=""
                        label="Color"
                        className="bg-gray-50"
                        disabled></Input>
                </div>

                <div className="ml-1 mb-1 mt-5">
                    <Typography variant="paragraph">Harga</Typography>
                </div>
                <div className="ml-1">
                    <Input
                        id="harga"
                        name="harga"
                        crossOrigin=""
                        label="Harga"
                        className="bg-gray-50"
                        disabled></Input>
                </div>

                <div className="flex gap-10">
                    <div className="ml-1 mb-1 mt-5 w-1/2">
                        <Typography variant="paragraph">Quantity</Typography>
                        {/** Validasi stok dari gudang */}
                        <Input
                            id="qty"
                            name="qty"
                            crossOrigin=""
                            className="bg-gray-50"
                            type="number"></Input>
                    </div>

                    <div className="ml-1 mb-1 mt-5 w-1/2">
                        <Typography variant="paragraph">Estimasi Tanggal Pengantaran</Typography>
                        <DateInput />
                    </div>
                </div>

                <div className="ml-1 mb-1 mt-3">
                <Typography variant="paragraph">Remarks</Typography>
                    </div>
                    <div className="ml-1">
                        <Textarea
                            id="remarks"
                            name="remarks"
                            label="Keterangan (Optional)"
                            className="bg-gray-50"></Textarea>
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