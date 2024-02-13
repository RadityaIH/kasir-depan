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

export default function DialogEdit({ handleOpen, open, selectedSO }: InputProps) {
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

    //PRODUCTS
    const [resProduct, setResProduct] = useState<{ products: ProductResponse[] }>({ products: [] });
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)
    useEffect(() => {
        fetch('https://gudang-back-end.vercel.app/products')
            .then(response => response.json())
            .then((dataFetch) => {
                setResProduct(dataFetch)
                setLoading(false)
                setError(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
                setError(true)
            })
    }, [])

    const [dataProduct, setDataProduct] = useState<ProductResponse[]>([]);
    useEffect(() => {
        setDataProduct(resProduct.products);
    }, [resProduct]);

    useEffect(() => {
        if (!!dataProduct) {
            dataProduct.forEach((product) => {
                product.harga = (product.harga * (1.11 / 0.7));
            });
        }
    }, [dataProduct])

    return (
        <Dialog
            size="lg"
            open={open}
            handler={handleOpen}
            className="bg-transparent shador-none"
            placeholder="">
            <Card placeholder="" className="overflow-y-auto h-screen">
                {error ? 
                     <Typography variant="h6" className="flex justify-center">Terjadi Error!</Typography>
               :
                    <>
                        <CardBody placeholder="" className="z-0">
                            <div className="flex justify-center">
                                <Typography variant="h4">{selectedSO && selectedSO.id_SO}</Typography>
                            </div>
                            <div className="flex mt-5 justify-between gap-5">
                                <div className="w-1/2">
                                    <Typography variant="paragp" className="flex">
                                        <a className="font-bold w-1/3">Nama Customer: </a>
                                        <a className="">{selectedSO && selectedSO.nama_cust}</a>
                                    </Typography>
                                    <Typography variant="paragp" className="flex mt-3">
                                        <a className="font-bold w-1/2">No Telepon: </a>
                                        <Input value={selectedSO && selectedSO.no_telp} placeholder="" crossOrigin="">
                                        </Input>
                                    </Typography>
                                </div>
                                <Typography variant="paragp" className="flex w-1/2">
                                    <a className="font-bold w-1/4">Alamat: </a>
                                    <Textarea value={selectedSO && selectedSO.alamat} placeholder="">
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
                                        <DateInput dateSQL={dateSQL} setDateSQL={handleSetDateSQL} />
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
                            <Button color="green" onClick={handleOpen} placeholder="">Simpan</Button>
                        </CardFooter>
                    </>
                }
            </Card>
        </Dialog>
    )
}