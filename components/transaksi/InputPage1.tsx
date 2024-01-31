import { Button, Input, Progress, Textarea, Typography } from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Select from 'react-select'
import Fail from "../fail";
import axios from "axios";
import { set } from "lodash";

interface InputProps {
    onNext: () => void;
    dataCust: { nama: string, no_telp: string, alamat: string }
    setDataCust: (data: any) => void;
}

interface OptionType {
    value: string;
    label: string;
}

const token = getCookie("token");

export default function InputPage1({ onNext, dataCust, setDataCust }: InputProps) {
    // FOR SELECT OPTIONS
    const [resCust, setResCust] = useState<any | null>(null);

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
                    setResCust(data);
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserData();
    }, [token]);

    const newCustomerOption: OptionType = { value: 'add', label: 'Customer Baru' };

    const customerOptions: OptionType[] = resCust ? [newCustomerOption, ...resCust.map((cust: any) => ({
        value: cust.id.toString(),
        label: cust.nama_cust
    }))] : [newCustomerOption];


    // HANNDLE SELECT
    const [selectedCustomer, setSelectedCustomer] = useState({ value: 'add', label: 'Customer Baru' });
    const [nama_cust, setNamaCustomer] = useState("");
    const [no_telp, setNoCustomer] = useState("");
    const [alamat, setAlamat] = useState("");
    const handleChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedCustomer(selectedOption);
            const selectedCustomerData = resCust.find((cust: any) => cust.id.toString() === selectedOption.value);
            if (selectedCustomerData) {
                setNamaCustomer(selectedCustomerData.nama_cust);
                setNoCustomer(selectedCustomerData.no_telp);
                setAlamat(selectedCustomerData.alamat);
            } else {
                setNamaCustomer("");
                setNoCustomer("");
                setAlamat("");
            }
        }
    };

    //HANDLE SUBMIT
    const [notFilled, setNotFilled] = useState(false);
    const [error, setError] = useState(false);
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!nama_cust || !no_telp || !alamat) {
            setNotFilled(true);
            setError(false);
            return;
        }

        if (nama_cust || no_telp || alamat) {
            setDataCust({
                nama: nama_cust,
                no_telp: no_telp,
                alamat: alamat,
            });
        }

        try {
            const token = getCookie("token");

            if (token) {
                if (selectedCustomer.value === "add") {
                    const response = await axios.post(`${process.env.BACKEND_API}/addCust`, {
                        nama: nama_cust,
                        no_telp: no_telp,
                        alamat: alamat
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true // Ensure credentials are sent with the request
                    });
                    // Check response status
                    if (response.status !== 200) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    setNotFilled(false);
                    setError(false);
                    onNext();
                } else {
                    const response = await axios.put(`${process.env.BACKEND_API}/updateCust`, {
                        id: selectedCustomer.value,
                        nama: nama_cust,
                        no_telp: no_telp,
                        alamat: alamat
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true // Ensure credentials are sent with the request
                    });
                    // Check response status
                    if (response.status !== 200) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    setNotFilled(false);
                    setError(false);
                    onNext();
                }

            }

        } catch (error: any) {
            console.error('Fetch error:', error);
            setNotFilled(false);
            setError(true);
        }


    }

    // SET DATA JIKA SUDAH ADA DARI PARENTS
    useEffect(() => {
        const existingCustomerOption = customerOptions.find((option) => option.label === dataCust.nama);
        if (existingCustomerOption) {
            setSelectedCustomer(existingCustomerOption);
        }
        setNamaCustomer(dataCust.nama)
        setNoCustomer(dataCust.no_telp)
        setAlamat(dataCust.alamat)

    }, [dataCust, resCust])



    return (
        <>
            <Progress value={0} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="text-center">Data Customer</Typography>

            {(notFilled || error) && <Fail Title="Gagal Menyimpan!" Caption={notFilled ? `Seluruh Kolom Harus Diisi!` : `Terjadi kesalahan`} />}
            <div className="flex ml-1 mb-1 mt-5">
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
                    // value={dataCust ? dataCust.nama : ""}
                    value={nama_cust}
                    onChange={(e) => setNamaCustomer(e.target.value)}
                    // onChange={(e) => setDataCust({ ...dataCust, nama: e.target.value })}
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
                    // value={dataCust ? dataCust.no_telp : ""}
                    // onChange={(e) => setDataCust({ ...dataCust, no_telp: e.target.value })}
                    value={no_telp}
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
                    // value={dataCust ? dataCust.alamat : ""}
                    // onChange={(e) => setDataCust({ ...dataCust, alamat: e.target.value })}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="bg-gray-50"></Textarea>
            </div>

            <div className="justify-end flex mt-5">
                <Button
                    className="bg-gray-100 border border-green-500"
                    onClick={handleSubmit}
                    placeholder="">
                    <p className="text-green-500">Simpan & Selanjutnya</p>
                </Button>
            </div>
        </>
    )
}