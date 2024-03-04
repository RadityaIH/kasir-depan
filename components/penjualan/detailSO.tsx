import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    Textarea,
} from "@material-tailwind/react";
import DateInput from "../transaksi/dateInput";
import { useEffect, useState } from "react";
import { format } from "path";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

interface InputProps {
    handleOpen: () => void;
    open: boolean;
    selectedSO: SOResponse;
}

interface ProductChosen {
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    stok: number;
    remarks: string;
}

interface ProductResponse {
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
    deskripsi: string;
    harga: number;
}

interface SOResponse {
    nama_cust: string;
    alamat: string;
    no_telp: string;
    nama_sales: string;
    tanggal_transaksi: string;
    jadwal_kirim: string;
    status_terima: number;
    kode_produk: string;
    nama_produk: string;
    harga_item_ppn: string;
    qty: string;
    remarks: string;
    total_harga: number;
    balance_due: number;
    metode_dp1: string;
    total_dp1: number;
    metode_dp2: string | null;
    total_dp2: number | null;
    id: number;
    id_SO: string;
}

export default function DialogDetail({ handleOpen, open, selectedSO }: InputProps) {
    const router = useRouter();

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

    const [dateSQL, setDateSQL] = useState<string>(selectedSO.tanggal_transaksi);
    const handleSetDateSQL = (tanggal: string) => {
        setDateSQL(tanggal);
    };

    const [selectedSOProducts, setSelectedSOProducts] = useState<ProductChosen[]>([]);
    useEffect(() => {
        if (selectedSO.nama_produk) {
            setSelectedSOProducts(selectedSO.nama_produk.split(',').map((productName, index) => {
                return {
                    id_produk: parseInt(selectedSO.kode_produk.split(',')[index]),
                    kode_produk: selectedSO.kode_produk.split(',')[index],
                    nama_produk: selectedSO.nama_produk.split(',')[index],
                    stok: parseInt(selectedSO.qty.split(',')[index]),
                    remarks: selectedSO.remarks.split(',')[index] !== " " ? selectedSO.remarks.split(',')[index] : "-",
                    harga: parseInt(selectedSO.harga_item_ppn.split(',')[index]),
                    qty: parseInt(selectedSO.qty.split(',')[index])
                }
            }))
        }
    }, [selectedSO])

    const handleEdit = (id_SO: string) => {
        router.push(`/kasir/penjualan/${id_SO}`);
    }

    return (
        <Dialog
            size="lg"
            open={open}
            handler={handleOpen}
            className="bg-transparent shador-none"
            placeholder="">
            <Card placeholder="" className="h-screen overflow-scroll">
                <>
                    <CardBody placeholder="" className="z-0">
                        <div className="flex justify-end">
                            <Link href={`/print/${selectedSO.id_SO}`} target="blank">
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
                        <div className="flex justify-center" id="id_SO">
                            <Typography variant="h4">{selectedSO && selectedSO.id_SO}</Typography>
                        </div>
                        <div className="flex mt-5 justify-between gap-5">
                            <div className="w-1/2">
                                <Typography variant="paragp" className="flex">
                                    <a className="font-bold w-1/3">Nama Customer: </a>
                                    <a className="">{selectedSO && selectedSO.nama_cust}</a>
                                </Typography>
                                <Typography variant="paragp" className="flex mt-3">
                                    <a className="font-bold w-1/3">No Telepon: </a>
                                    <a className="">{selectedSO && selectedSO.no_telp}</a>
                                </Typography>
                            </div>
                            <Typography variant="paragp" className="flex w-1/2">
                                <a className="font-bold w-1/4">Alamat: </a>
                                <Textarea value={selectedSO && selectedSO.alamat} placeholder="" disabled>
                                </Textarea>
                            </Typography>
                        </div>
                        <hr className="h-px my-4 bg-gray-300 border-0 dark:bg-gray-300"></hr>
                        <div className="flex justify-between gap-5">
                            <div className="w-1/2">
                                <Typography variant="paragp" className="flex">
                                    <a className="font-bold w-1/3">Nama Sales: </a>
                                    <a className="">{selectedSO && selectedSO.nama_sales}</a>
                                </Typography>
                                <Typography variant="paragp" className="flex">
                                    <a className="font-bold w-1/3">Status Terima: </a>
                                    <a className="">{selectedSO && (selectedSO.status_terima === 0 ? "Belum" : "Sudah")}</a>
                                </Typography>
                                <Typography variant="paragp" className="flex">
                                    <a className="font-bold w-1/3">Tgl. Transaksi: </a>
                                    <a className="">{selectedSO && formatDate(selectedSO.tanggal_transaksi)}</a>
                                </Typography>
                            </div>
                            <Typography variant="paragp" className="flex w-1/2">
                                <a className="font-bold w-1/3">Tgl. Pengiriman: </a>
                                <div className="w-2/3">
                                    <a className="">{selectedSO && formatDate(selectedSO.jadwal_kirim)}</a>
                                </div>
                            </Typography>
                        </div>
                        <div className="flex flex-wrap gap-7 justify-center">
                            {selectedSOProducts.map((productName, index) => (
                                <Card key={index} placeholder="" className="p-3 w-2/5 border-solid border-2 bg-gray-50 mt-3">
                                    <Typography variant="h6" className="my-1 mt-3 text-center">Produk {index + 1}</Typography>

                                    <div className="ml-1 mt-3 flex items-center">
                                        <div className="w-1/2">
                                            <Typography variant="paragraph">Nama</Typography>
                                        </div>
                                        <Input
                                            id="nama_produk"
                                            name="nama_produk"
                                            crossOrigin=""
                                            className="bg-gray-50"
                                            value={selectedSOProducts[index].nama_produk}
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
                                            value={selectedSOProducts[index].kode_produk}
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
                                            value={formatCurrency(selectedSOProducts[index].harga)}
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
                                            value={selectedSOProducts[index].qty}
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
                                            value={selectedSOProducts[index].remarks !== '' ? selectedSOProducts[index].remarks : '-'}
                                            disabled
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <Typography variant="paragp" className="flex mt-5">
                            <a className="font-bold w-1/5">Total Harga: </a>
                            <Input value={selectedSO && formatCurrency(selectedSO.total_harga)} placeholder="" crossOrigin="" disabled>
                            </Input>
                        </Typography>
                        <div className="flex justify-between mt-3 gap-5">
                            <div className="w-1/3">
                                <Typography variant="paragp" className="flex mt-3">
                                    <a className="font-bold w-1/2">Metode DP1: </a>
                                    <a className="">{selectedSO && selectedSO.metode_dp1}</a>
                                </Typography>
                                <Typography variant="paragp" className="flex mt-3">
                                    <a className="font-bold w-1/2">Total DP1: </a>
                                    <a className="">{selectedSO && formatCurrency(selectedSO.total_dp1)}</a>
                                </Typography>
                            </div>
                            <div className="w-1/3">
                                <Typography variant="paragp" className="flex mt-3">
                                    <a className="font-bold w-1/2">Metode DP2: </a>
                                    <a className="">{selectedSO && (selectedSO.metode_dp2 ? selectedSO.metode_dp2 : "-")}</a>
                                </Typography>
                                <Typography variant="paragp" className="flex mt-3">
                                    <a className="font-bold w-1/2">Total DP2: </a>
                                    <a className="">{selectedSO.total_dp2 ? formatCurrency(selectedSO.total_dp2) : 0}</a>
                                </Typography>
                            </div>
                            <Typography variant="paragp" className="flex mt-3 w-1/3">
                                <a className="font-bold w-1/2">Balance Due: </a>
                                <a className="">{selectedSO && formatCurrency(selectedSO.balance_due)}</a>
                            </Typography>
                        </div>
                    </CardBody>
                    <CardFooter placeholder="" className="flex justify-between">
                        <Button color="red" onClick={handleOpen} placeholder="">Tutup</Button>
                        {selectedSO.status_terima === 0 ?
                            <Button className="bg-yellow-700" onClick={(e) => handleEdit(selectedSO.id_SO)} placeholder="">
                                <div className="flex gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            fill="#000"
                                            fillRule="evenodd"
                                            d="M21.121 2.707a3 3 0 0 0-4.242 0l-1.68 1.68-7.906 7.906a1 1 0 0 0-.263.464l-1 4a1 1 0 0 0 1.213 1.213l4-1a1 1 0 0 0 .464-.263l7.849-7.848 1.737-1.738a3 3 0 0 0 0-4.242l-.172-.172Zm-2.828 1.414a1 1 0 0 1 1.414 0l.172.172a1 1 0 0 1 0 1.414l-1.017 1.017-1.555-1.617.986-.986Zm-2.4 2.4 1.555 1.617-6.96 6.959-2.114.529.529-2.115 6.99-6.99ZM4 8a1 1 0 0 1 1-1h5a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5a1 1 0 0 0-2 0v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-black text-center">Edit</p>
                                </div>
                            </Button>
                            :
                            <div>
                                <p className="text-red-500">Barang yang sudah diterima tidak bisa diedit.</p>
                            </div>}
                    </CardFooter>
                </>
            </Card>
        </Dialog>
    )
}