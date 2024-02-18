import { Button, Card, Input, Textarea, Typography } from "@material-tailwind/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { isEqual, set } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ProductChosen {
    idx: number
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    remarks: string;
}

interface InputProps {
    onNext: () => void;
    data: { id_SO: string, nama_cust: string, no_telp: string, alamat: string, total_harga: number, metodeBayar1Mix: string, metodeBayar2Mix: string | null, downPayment1: number, downPayment2: number | null, balance_due: number, nama_sales: string, status_terima: number, tanggal_transaksi: string, jadwal_kirim: string }
    dataPage2: { salesId: number, sales: string, jadwal_kirim: string, produkPage2: ProductChosen[], total_harga: number };
    hargaLama: number;
    productChanged: boolean;
}

export default function ViewEditSO({ onNext, data, dataPage2, hargaLama, productChanged }: InputProps) {
    const router = useRouter();
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
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    const [balDue, setBalDue] = useState(data.balance_due);
    useEffect(() => {
        if (dataPage2.total_harga > hargaLama) {
            setBalDue(balDue + (dataPage2.total_harga - hargaLama));
        } else {
            setBalDue(data.balance_due)
        }
    }, [dataPage2.total_harga])

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        console.log(dataPage2)
        try {
            const token = getCookie("token");

            if (token) {
                const response = await axios.put(`${process.env.BACKEND_API}/updateSO/${data.id_SO}`, {
                    produkPage2: dataPage2.produkPage2,
                    total_harga: dataPage2.total_harga,
                    balance_due: data.balance_due,
                    productChanged: productChanged
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
                router.push("/kasir/penjualan");
            } 
        } catch (error: any) {
            console.error(error);
        }
    }
    return (
        <div>
            <div className="flex justify-center">
                <Typography variant="h4">{data.id_SO}</Typography>
            </div>
            <div className="flex mt-5 justify-between gap-5">
                <div className="w-1/2">
                    <Typography variant="paragp" className="flex">
                        <a className="font-bold w-1/3">Nama Customer: </a>
                        <a className="">{data.nama_cust}</a>
                    </Typography>
                    <Typography variant="paragp" className="flex mt-3">
                        <a className="font-bold w-1/3">No Telepon: </a>
                        <a className="">{data.no_telp}</a>
                    </Typography>
                </div>
                <Typography variant="paragp" className="flex w-1/2">
                    <a className="font-bold w-1/4">Alamat: </a>
                    <Textarea value={data.alamat} placeholder="" disabled>
                    </Textarea>
                </Typography>
            </div>
            <hr className="h-px my-4 bg-gray-300 border-0 dark:bg-gray-300"></hr>
            <div className="flex justify-between gap-5">
                <div className="w-1/2">
                    <Typography variant="paragp" className="flex">
                        <a className="font-bold w-1/3">Nama Sales: </a>
                        <a className="">{data.nama_sales}</a>
                    </Typography>
                    <Typography variant="paragp" className="flex">
                        <a className="font-bold w-1/3">Status Terima: </a>
                        <a className="">{(data.status_terima === 0 ? "Belum" : "Sudah")}</a>
                    </Typography>
                    <Typography variant="paragp" className="flex">
                        <a className="font-bold w-1/3">Tgl. Transaksi: </a>
                        <a className="">{formatDate(data.tanggal_transaksi)}</a>
                    </Typography>
                </div>
                <Typography variant="paragp" className="flex w-1/2">
                    <a className="font-bold w-1/3">Tgl. Pengiriman: </a>
                    <div className="w-2/3">
                        <a className="">{formatDate(data.jadwal_kirim)}</a>
                    </div>
                </Typography>
            </div>
            <div className="flex flex-wrap gap-7 justify-center">
                {dataPage2.produkPage2 && dataPage2.produkPage2.map((produk, idx) => (
                    <Card key={idx} placeholder="" className="p-3 w-2/5 border-solid border-2 bg-gray-50 mt-3">
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
            <div className="flex justify-center my-3">
                <Button
                    className="bg-orange"
                    onClick={onNext}
                    placeholder="">
                    <p>Edit Produk</p>
                </Button>
            </div>
            {dataPage2.total_harga > hargaLama &&
                <Typography variant="paragp" className="flex mt-5">
                    <a className="font-bold w-1/5">Harga Lama: </a>
                    <Input value={formatCurrency(hargaLama)} placeholder="" crossOrigin="" disabled>
                    </Input>
                </Typography>
            }
            <Typography variant="paragp" className="flex mt-5">
                <a className="font-bold w-1/5">Total Harga: </a>
                <Input value={formatCurrency(dataPage2.total_harga)} placeholder="" crossOrigin="" disabled>
                </Input>
            </Typography>
            <div className="flex justify-between mt-3 gap-5">
                <div className="w-1/3">
                    <Typography variant="paragp" className="flex mt-3">
                        <a className="font-bold w-1/2">Metode DP1: </a>
                        <a className="">{data.metodeBayar1Mix}</a>
                    </Typography>
                    <Typography variant="paragp" className="flex mt-3">
                        <a className="font-bold w-1/2">Total DP1: </a>
                        <a className="">{formatCurrency(data.downPayment1)}</a>
                    </Typography>
                </div>
                <div className="w-1/3">
                    <Typography variant="paragp" className="flex mt-3">
                        <a className="font-bold w-1/2">Metode DP2: </a>
                        <a className="">{(data.metodeBayar2Mix ? data.metodeBayar2Mix : "-")}</a>
                    </Typography>
                    <Typography variant="paragp" className="flex mt-3">
                        <a className="font-bold w-1/2">Total DP2: </a>
                        <a className="">{data.downPayment2 ? formatCurrency(data.downPayment2) : 0}</a>
                    </Typography>
                </div>
                <Typography variant="paragp" className="flex mt-3 w-1/3">
                    <a className="font-bold w-1/2">Balance Due: </a>
                    <a className="">{formatCurrency(balDue)}</a>
                </Typography>
            </div>

            <div className="justify-end flex mt-5">
                <Button
                    className="bg-green-500"
                    onClick={handleSubmit}
                    placeholder="">
                    <p className="">Simpan</p>
                </Button>
            </div>
        </div>
    )
}