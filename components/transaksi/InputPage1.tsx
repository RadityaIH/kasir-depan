import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Select from 'react-select'

interface InputProps {
    onNext: () => void;
}

interface OptionType {
    value: string;
    label: string;
}

const token = getCookie("token");

export default function InputPage1({ onNext }: InputProps) {
    const [custData, setCustData] = useState<any | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getCookie("token");

                if (token) {
                    const response = await fetch(`${process.env.BACKEND_API}/getCust`, {
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
                    setCustData(data);
                    console.log(data);
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserData();
        console.log(custData);
    }, [token]);

    const newCustomerOption: OptionType = { value: 'add', label: 'Customer Baru' };

    // Buat opsi dari custData atau array kosong jika custData masih kosong
    const customerOptions: OptionType[] = custData ? [newCustomerOption, ...custData.map((cust: any) => ({
        value: cust.id.toString(), // Ubah ke string jika perlu
        label: cust.nama_cust
    }))] : [newCustomerOption];

    const [selectedCustomer, setSelectedCustomer] = useState({ value: 'add', label: 'Customer Baru' });
    const [nama_cust, setNamaCustomer] = useState("");
    const [no_telp, setNoCustomer] = useState("");
    const [alamat, setAlamat] = useState("");
    const handleChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedCustomer(selectedOption);

            // Cari data pelanggan yang sesuai dengan opsi yang dipilih
            const selectedCustomerData = custData.find((cust: any) => cust.id.toString() === selectedOption.value);

            // Jika data pelanggan ditemukan, isi nilai input dengan data tersebut
            if (selectedCustomerData) {
                setNamaCustomer(selectedCustomerData.nama_cust);
                setNoCustomer(selectedCustomerData.no_telp);
                setAlamat(selectedCustomerData.alamat);
            } else {
                // Jika data pelanggan tidak ditemukan, reset nilai input
                setNamaCustomer("");
                setNoCustomer("");
                setAlamat("");
            }
        }
    };

    return (
        <>
            <Progress value={0} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="my-5 text-center">Data Customer</Typography>

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
                    value={nama_cust ? nama_cust : ""}
                    onChange={(e) => setNamaCustomer(e.target.value)}
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
                    value={no_telp ? no_telp : ""}
                    onChange={(e) => setNoCustomer(e.target.value)}
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
                    value={alamat ? alamat : ""}
                    onChange={(e) => setAlamat(e.target.value)}
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
        </>
    )
}