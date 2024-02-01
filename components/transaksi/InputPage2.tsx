import { Button, Input, Progress, Spinner, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { use, useEffect, useState } from "react";
import Select from 'react-select'
import React from "react";
import { getCookie } from "cookies-next";
import Fail from "../fail";

interface InputProps {
    onPrev: () => void;
    onNext: () => void;
    dataPage2: { sales: string, jadwal_kirim: string, id_produk: number, kode_produk: string, nama_produk: string, qty: number, harga: number, remarks: string}
    setDataPage2: (data: any) => void;
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

const token = getCookie("token");

export default function InputPage2({ onPrev, onNext, dataPage2, setDataPage2 }: InputProps) {
    //SALES
    const [resSales, setResSales] = useState<any | null>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getCookie("token");

                if (token) {
                    const response = await fetch(`${process.env.BACKEND_API}/getSales`, {
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
                    setResSales(data);
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserData();
    }, [token]);

    const salesOptions: OptionType[] = resSales ? [...resSales.map((sales: any) => ({
        value: sales.id_sales.toString(),
        label: sales.nama_sales
    }))] : [];
    const [selectedSales, setSelectedSales] = useState({ value: 'add', label: 'Sales yang Menjual Produk' });
    const handleChangeSales = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedSales(selectedOption);
        }
    };

    //DATE
    const [dateSQL, setDateSQL] = React.useState<string>("");
    const handleSetDateSQL = (tanggal: string) => {
        setDateSQL(tanggal);
    };

    // const [products, setProducts] = useState([{ id: 1, selectedProduct: '', remarks: '' }]);

    // const handleAddProduct = () => {
    //     const newProductId = products.length + 1;
    //     setProducts([...products, { id: newProductId, selectedProduct: '', remarks: '' }]);
    // };

    // const handleRemoveProduct = (productId: number) => {
    //     const updatedProducts = products.filter(product => product.id !== productId);
    //     setProducts(updatedProducts);
    // };

    // const handleChangeProduct = (selectedOption: OptionType | null, productId: number) => {
    //     if (selectedOption) {
    //         const updatedProducts = products.map(product =>
    //             product.id === productId ? { ...product, selectedProduct: selectedOption.value } : product
    //         );
    //         setProducts(updatedProducts);
    //     }
    // };


    //PRODUCTS
    const [resProduct, setResProduct] = useState<{ products: Product[] }>({ products: [] });
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('https://gudang-back-end.vercel.app/products')
            .then(response => response.json())
            .then((dataFetch) => {
                setResProduct(dataFetch)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }, [])

    const [dataProduct, setDataProduct] = useState<Product[]>([]);
    useEffect(() => {
        setDataProduct(resProduct.products);
    }, [resProduct]);

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
        if (qtyInt > stok) {
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

    //HANDLE NEXT
    const [notFilled, setNotFilled] = useState(false);
    const [movePage, setMovePage] = useState(false);
    const [alertOOSShow, setAlertOOSShow] = useState(false);
    const handleSave = (direction: string) => {
        setMovePage(true);
        setDataPage2({
            sales: selectedSales.label,
            jadwal_kirim: dateSQL,
            id_produk: parseInt(selectedProduct.value),
            kode_produk: kode_produk,
            nama_produk: nama_produk,
            qty: parseInt(qty),
            harga: harga,
            remarks: remarks
        })
        if (direction === 'left'){
            onPrev()
            return;
        }
        if (selectedProduct.value === '0' || qty === '' || parseInt(qty) === 0 || dateSQL === '' || selectedSales.value === '0') {
            // console.log(selectedProduct.value === '0', qty === '', dateSQL === '', selectedSales.value === '0', OOS)
            setMovePage(false);
            setNotFilled(true);
            setAlertOOSShow(false);
            return;
        }
        const qtyInt = parseInt(qty);
        if (qtyInt > stok){
            setMovePage(false);
            setNotFilled(false);
            setAlertOOSShow(true);
            return;
        }
        if (direction === 'right'){
            onNext()
        }
        setMovePage(true);
        setNotFilled(false);
        setAlertOOSShow(false);
    }

    useEffect(() => {
        const existingSalesOption = salesOptions.find((option) => option.label === dataPage2.sales);
        if (existingSalesOption) {
            setSelectedSales(existingSalesOption);
        }
        const existingProductOption = productOptions.find((option) => option.value === dataPage2.id_produk.toString());
        if (existingProductOption) {
            setSelectedProduct(existingProductOption);
        }
        if (dataPage2.qty !== 0) {
            setQty(dataPage2.qty.toString());
        }
        setStok(dataProduct.find((product: Product) => product.id_produk === dataPage2.id_produk)?.stok || 0);
        setRemarks(dataPage2.remarks);
        setDateSQL(dataPage2.jadwal_kirim);
        setNamaProduk(dataPage2.nama_produk);
        setKodeProduk(dataPage2.kode_produk);
        setHarga(dataPage2.harga);

    }, [dataPage2, resProduct, resSales])
    return (
        <>
            <Progress value={33} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="text-center">Data Produk</Typography>
            {notFilled && <Fail Title="Peringatan!" Caption={`Seluruh Kolom Harus Diisi!`} />}

            {loading ?
                <div className="flex justify-center items-center h-screen">
                    <Spinner color="red" />
                </div>
                : <>
                    <div className="flex gap-5 mt-5">
                        <div className="w-3/4 ml-1">
                            <Typography variant="paragraph">Pilih Sales</Typography>
                            <Select
                                id="pilih_sales"
                                name="pilih_sales"
                                value={selectedSales}
                                onChange={handleChangeSales}
                                options={salesOptions}
                                className="w-full bg-gray-50"
                            />
                        </div>

                        <div className="w-1/2 ml-1">
                            <Typography variant="paragraph">Estimasi Tanggal Pengantaran</Typography>
                            <DateInput dateSQL={dateSQL} setDateSQL={handleSetDateSQL} />
                        </div>
                    </div>

                    {/* {products.map((product) => */}
                    {/* <div key={product.id} className="p-3 border-4 border-dashed mt-7 rounded-lg"> */}
                    <div className="p-3 border border-dashed mt-7 rounded-lg bg-gray-50">
                        <Typography variant="h6" className="ml-1">Produk 1</Typography>
                        {alertOOSShow && <Fail Title="Stok Tidak Mencukupi!" Caption={``} />}
                        <div className="flex ml-1 mb-1 mt-4">
                            <Typography variant="paragraph">Pilih Produk</Typography>
                        </div>
                        <div className="ml-1">
                            <Select
                                id="pilih_produk"
                                name="pilih_produk"
                                // value={product.selectedProduct}
                                value={selectedProduct}
                                // onChange={(selectedOption) => handleChangeProduct(selectedOption, product.id)}
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
                                    value={harga && formatCurrency(harga * (1.11 / 0.7))}
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

                        {/* <div className="justify-center flex">
                        {products.length > 1 && (
                            <button
                                className="ml-1 mt-3 bg-red-500 rounded-full p-2"
                                onClick={() => handleRemoveProduct(product.id)}
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                >
                                    <path
                                        stroke="#FFF"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7ZM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
                                    />
                                </svg>
                            </button>
                        )}
                    </div> */}
                    </div>
                    {/* )} */}

                    {/* <div className="justify-center flex">
                <button className="ml-1 mt-3 bg-black p-1 rounded-full" onClick={handleAddProduct} type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                    >
                        <title />
                        <g
                            fill="none"
                            stroke="#FFF"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            data-name="add"
                        >
                            <path d="M12 19V5M5 12h14" />
                        </g>
                    </svg>
                </button>
            </div> */}
                </>}
            <div className="justify-between flex">
                <Button
                    className="mt-5 ml-1 bg-gray-100 border border-blue-500"
                    onClick={() => {
                        handleSave('left'); 
                        // onPrev();
                    }}
                    placeholder="">
                    <p className="text-blue-500">Sebelumnya</p>
                </Button>

                <Button
                    className="bg-blue-500 mt-5"
                    onClick={() => {
                        handleSave('right'); 
                        // if (movePage) {
                        //     onNext();
                        // }
                    }}
                    placeholder="">
                    Selanjutnya
                </Button>
            </div>
        </>
    )
}