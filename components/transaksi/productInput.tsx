import { Input, Textarea, Typography } from "@material-tailwind/react";
import Fail from "../fail";
import Select from 'react-select'
import { useEffect, useState } from "react";
interface InputProps {
    dataProduct: Product[];
    productChosen: ProductChosen;
    handleDeleteProduct: (idx: number) => void;
    onUpdateProduct: (productData: ProductChosen) => void;
    idx: number;
}

interface OptionType {
    value: string;
    label: string;
}

interface Product {
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
    deskripsi: string;
    harga: number;
}

interface ProductChosen {
    idx: number
    id_produk: number;
    kode_produk: string;
    nama_produk: string;
    qty: number;
    harga: number;
    stok: number;
    remarks: string;
}

export default function ProductInput({ dataProduct, productChosen, handleDeleteProduct, onUpdateProduct, idx }: InputProps) {
    const productOptions: OptionType[] = dataProduct ? [...dataProduct.map((product: Product) => ({
        value: product.id_produk.toString(),
        label: `${product.kode_produk} - ${product.nama_produk}`
    }))] : [];
    const [selectedProduct, setSelectedProduct] = useState({ value: '0', label: 'Pilih Produk' });
    const [nama_produk, setNamaProduk] = useState("");
    const [kode_produk, setKodeProduk] = useState("");
    const [harga, setHarga] = useState(0);
    const [stok, setStok] = useState(0);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };
    const handleChangeProduct = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedProduct(selectedOption);
            const selectedProductData = dataProduct.find((product: Product) => product.id_produk.toString() === selectedOption.value);
            if (selectedProductData) {
                setNamaProduk(selectedProductData.nama_produk);
                setKodeProduk(selectedProductData.kode_produk);
                setHarga(selectedProductData.harga);
                setStok(selectedProductData.stok)
            } else {
                setNamaProduk("");
                setKodeProduk("");
                setHarga(0);
            }
        }
    }
    const [qty, setQty] = useState<string>('');
    const [OOS, setOOS] = useState(false);
    const [ready, setReady] = useState(false);
    const checkQty = (qty: string) => {
        setQty(qty)
        const qtyInt = parseInt(qty);
        if (qtyInt > stok || qtyInt <= 0) {
            setOOS(true)
            setReady(false)
        } else {
            setOOS(false)
            setReady(true)
        }
        if (qty === '') {
            setReady(false)
        }
    }
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (selectedProduct.value === '0') {
            return
        } else {
            onUpdateProduct({
                idx: idx,
                id_produk: parseInt(selectedProduct.value),
                kode_produk: kode_produk,
                nama_produk: nama_produk,
                qty: parseInt(qty),
                stok: stok,
                harga: harga,
                remarks: remarks
            })
        }
    }, [selectedProduct, kode_produk, nama_produk, qty, harga, remarks, stok])

    useEffect(() => {
        if (productChosen.idx === idx) {
            setSelectedProduct({ value: productChosen.id_produk.toString(), label: `${productChosen.kode_produk} - ${productChosen.nama_produk}` })
            setNamaProduk(productChosen.nama_produk)
            setKodeProduk(productChosen.kode_produk)
            setHarga(productChosen.harga)
            setQty(productChosen.qty.toString())
            setStok(productChosen.stok)
            setRemarks(productChosen.remarks)
        }
    }, [])

    return (
        <div className="p-3 border-2 mt-7 rounded-lg bg-gray-50">
            <div className="flex justify-between">
                <Typography variant="h6" className="ml-1">Produk {idx + 1}</Typography>
                {idx !== 0 &&
                <div onClick={() => handleDeleteProduct(idx)} className="cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-7"
                    >
                        <path
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7ZM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
                            />
                    </svg>
                </div>
                }
            </div>
            {/* {1 === 1 && <Fail Title="Stok Tidak Mencukupi!" Caption={``} />} */}
            <div className="flex ml-1 mb-1 mt-4">
                <Typography variant="paragraph">Pilih Produk</Typography>
            </div>
            <div className="ml-1">
                <Select
                    id="pilih_produk"
                    name="pilih_produk"
                    value={selectedProduct}
                    onChange={handleChangeProduct}
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
                    value={nama_produk}
                    disabled></Input>
            </div>

            <div className="flex gap-10">
                <div className="ml-1 mb-1 mt-5 w-1/2">
                    <Typography variant="paragraph">Kode Produk</Typography>
                    <Input
                        id="kode_produk"
                        name="kode_produk"
                        crossOrigin=""
                        label="Kode Produk"
                        className="bg-gray-50"
                        value={kode_produk}
                        disabled></Input>
                </div>

                <div className="mb-1 mt-5 w-1/2">
                    <Typography variant="paragraph">Harga</Typography>
                    <Input
                        id="harga"
                        name="harga"
                        crossOrigin=""
                        label="Harga"
                        className="bg-gray-50"
                        value={harga && formatCurrency(harga)}
                        disabled></Input>
                </div>

                <div className="mr-1 mb-1 mt-5 w-1/2">
                    <Typography variant="paragraph">Quantity</Typography>
                    <Input
                        id="qty"
                        name="qty"
                        crossOrigin=""
                        className="bg-gray-50"
                        type="number"
                        value={qty}
                        // onChange={(e) => setQty(e.target.value)}
                        onChange={(e) => checkQty(e.target.value)}
                        label="Jumlah Produk"></Input>
                    {ready &&
                        <Typography
                            variant="small"
                            color="green"
                            className="mt-2 flex items-center gap-1 font-normal">
                            Barang Tersedia!
                        </Typography>
                    }
                    {OOS &&
                        <Typography
                            variant="small"
                            color="red"
                            className="mt-2 flex items-center gap-1 font-normal">
                            Stok Tidak Mencukpi! Stok saat ini: {stok}
                        </Typography>
                    }
                </div>
            </div>

            <div className="ml-1 mb-1 mt-3">
                <Typography variant="paragraph">Remarks</Typography>
            </div>
            <div className="ml-1">
                <Textarea
                    id="remarks"
                    name="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    label="Keterangan (Optional)"
                    className="bg-gray-50"></Textarea>
            </div>
        </div>
    )
}