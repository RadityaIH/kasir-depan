import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Select from 'react-select'

interface InputProps {
    onNext: () => void;
}

interface OptionType {
    value: string;
    label: string;
}

export default function InputPage1({ onNext }: InputProps) {
    
    const customerOptions = [
        { value: 'add', label: 'Customer Baru' },
        { value: '1', label: 'Customer 1' },
        // Add more customer options as needed
    ];
    
    const [selectedCustomer, setSelectedCustomer] = useState({ value: 'add', label: 'Customer Baru' });
    
    const handleChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedCustomer(selectedOption);
        }
    };

    return (
        <>
        <Progress value={0} placeholder="" className="mb-3" color="red"></Progress>
        <Typography variant="h5" className="my-5 text-center">Data Customer</Typography>
        
        <form>
            <div className="flex ml-1 mb-1">
                <Typography variant="paragraph">Pilih Customer</Typography>
            </div>
            <div className="ml-1">
                <Select
                    id="pilih_customer"
                    name="pilih_customer"
                    value={selectedCustomer}
                    onChange={handleChange}
                    options={customerOptions}
                    className="w-full bg-gray-50"
                />
            </div>

            <div className="ml-1 mb-1 mt-5">
                <Typography variant="paragraph">Nama</Typography>
            </div>
            <div className="ml-1">
                <Input
                    id="nama_customer"
                    name="nama_customer"
                    crossOrigin=""
                    label="Nama Customer"
                    className="bg-gray-50"></Input>
            </div>

            <div className="ml-1 mb-1 mt-5">
                <Typography variant="paragraph">No Telepon</Typography>
            </div>
            <div className="ml-1">
                <Input
                    id="no_customer"
                    name="no_customer"
                    crossOrigin=""
                    label="No Telepon Customer"
                    className="bg-gray-50"></Input>
            </div>

            <div className="ml-1 mb-1 mt-5">
                <Typography variant="paragraph">Alamat</Typography>
            </div>
            <div className="ml-1">
                <Textarea
                    id="alamat"
                    name="alamat"
                    label="Alamat Customer"
                    className="bg-gray-50"></Textarea>
            </div>

            <div className="justify-end flex mt-5">
                <Button
                    className="bg-gray-100 border border-green-500"
                    // type="submit"
                    onClick={onNext}
                    placeholder="">
                    <p className="text-green-500">Simpan & Selanjutnya</p>
                </Button>
            </div>
        </form>                           
    </>
    )
}