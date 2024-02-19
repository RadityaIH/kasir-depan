import { Button, Input, Progress, Spinner, Textarea, Typography } from "@material-tailwind/react";
import DateInput from "./dateInput";
import { use, useEffect, useState } from "react";
import Select from 'react-select'
import React from "react";
import { getCookie } from "cookies-next";
import Fail from "../fail";
import ProductInput from "./productInput";

interface InputProps {
    onPrev: () => void;
    onNext: () => void;
    dataPage2: { sales: string, jadwal_kirim: string, produkPage2: ProductChosen[], total_harga: number };
    setDataPage2: (data: any) => void;
    canEdit: boolean;
    hargaLama: number;
}

interface OptionType {
    value: string;
    label: string;
}

interface ProductResponse {
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

const token = getCookie("token");

export default function InputPage2({ onPrev, onNext, dataPage2, setDataPage2, canEdit, hargaLama }: InputProps) {
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

    //PRODUCTS
    const [resProduct, setResProduct] = useState<{ products: ProductResponse[] }>({ products: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch('https://gudang-back-end.vercel.app/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status: ' + response.status);
                }
                return response.json();
            })
            .then((dataFetch) => {
                setResProduct(dataFetch)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
                setError('Error saat memuat data gudang');
            })
    }, [])

    const [dataProduct, setDataProduct] = useState<ProductResponse[]>([]);
    useEffect(() => {
        setDataProduct(resProduct.products);
    }, [resProduct]);

    useEffect(() => {
        dataProduct.forEach((product) => {
            product.harga = (product.harga * (1.11 / 0.7));
        });
    }, [dataProduct])

    //HANDLE NEXT
    const [notFilled, setNotFilled] = useState(false);
    const [alertOOS, setAlertOOS] = useState(false);
    const handleSave = (direction: string) => {
        setDataPage2({
            sales: selectedSales.label,
            salesId: selectedSales.value,
            jadwal_kirim: dateSQL,
            produkPage2: products,
            total_harga: total_harga
        })
        console.log(dataPage2)
        if (direction === 'left') {
            ``
            onPrev()
            return;
        }
        if (dateSQL === ''
            || selectedSales.value === '0'
            || products.length === 0
            || products.some(product => product.id_produk === 0 || product.qty === 0)) {
            // console.log(selectedProduct.value === '0', qty === '', dateSQL === '', selectedSales.value === '0', OOS)
            setNotFilled(true);
            setAlertOOS(false);
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            return;
        }
        if (products.some(product => product.qty > product.stok)) {
            setAlertOOS(true);
            setNotFilled(false);
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            return;
        }
        if (direction === 'right') {
            onNext()
        }
        setNotFilled(false);
        setAlertOOS(false);
    }

    //For Edit Page
    const [errorHarga, setErrorHarga] = useState(false);
    const handleEdit = () => {
        if (total_harga < hargaLama) {
            setErrorHarga(true);
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            return;
        }

        console.log(products.length === 0, products.some(product => product.id_produk === 0 || product.qty === 0))
        if (products.length === 0
            || products.some(product => product.id_produk === 0 || product.qty === 0)) {
            // console.log(selectedProduct.value === '0', qty === '', dateSQL === '', selectedSales.value === '0', OOS)
            setNotFilled(true);
            setAlertOOS(false);
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            return;
        }
        setDataPage2({
            sales: selectedSales.label,
            salesId: selectedSales.value,
            jadwal_kirim: dateSQL,
            produkPage2: products,
            total_harga: total_harga
        })
        setErrorHarga(false);
        setNotFilled(false);
        setAlertOOS(false);
        onPrev()
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    useEffect(() => {
        const existingSalesOption = salesOptions.find((option) => option.label === dataPage2.sales);
        if (existingSalesOption) {
            setSelectedSales(existingSalesOption);
        }
        setDateSQL(dataPage2.jadwal_kirim);
        setProducts(dataPage2.produkPage2);
        setIndex(getNextIndex())
    }, [dataPage2, resProduct, resSales])

    const [products, setProducts] = useState<ProductChosen[]>([]);
    const [index, setIndex] = useState(0)

    const getNextIndex = () => {
        if (products.length === 0) {
            return 0; // Jika tidak ada produk, indeks dimulai dari 0
        } else {
            // Temukan indeks terbesar dan tambahkan satu
            const maxIndex = Math.max(...products.map(product => product.idx));
            return maxIndex + 1;
        }
    };

    const [filteredDataProduct, setFilteredDataProduct] = useState<ProductResponse[]>([]);
    useEffect(() => {
        const fdp = dataProduct.filter(product => {
            return !products.some(p => p.id_produk === product.id_produk);
        });
        setFilteredDataProduct(fdp);
    }, [dataProduct, products])
    // console.log(filteredDataProduct)

    const handleAddProduct = () => {
        setIndex(index + 1)
        setProducts([
            ...products,
            {
                idx: index, id_produk: 0, kode_produk: '', nama_produk: '', qty: 0, harga: 0, remarks: '', stok: 0
            }]);
    }

    const handleDeleteProduct = (idx: number) => {
        const delProductName = products.find(product => product.id_produk === idx)?.id_produk.toString();
        const deletedProduct = dataProduct.find(product => product.id_produk.toString() === delProductName);
        if (deletedProduct) {
            setFilteredDataProduct([...filteredDataProduct, {
                id_produk: deletedProduct.id_produk,
                kode_produk: deletedProduct.kode_produk,
                nama_produk: deletedProduct.nama_produk,
                stok: deletedProduct.stok,
                deskripsi: deletedProduct.deskripsi,
                harga: deletedProduct.harga
            }]);
        }

        const updatedProducts = products.filter(product => product.idx !== idx);
        updatedProducts.forEach((product, index) => {
            product.idx = index;
        });
        setIndex(getNextIndex())
        setProducts(updatedProducts);
    }

    const [total_harga, setTotalHarga] = useState<number>(0)
    useEffect(() => {
        const totalHarga = products.reduce((acc, product) => acc + (product.qty * (product.harga)), 0);
        setTotalHarga(totalHarga);
    }, [products])

    const handleUpdateProduct = (productData: ProductChosen) => {
        const existingProductIndex = products.findIndex(product => product.idx === productData.idx);

        if (existingProductIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = productData;
            setProducts(updatedProducts);
        } else {
            setProducts([...products, productData]);
        }
    };

    useEffect(() => {
        if (canEdit) {
            const updatedProducts = products.map(product => {
                // Cari data produk yang sesuai dengan id_produk di dalam products
                const matchedProduct = dataProduct.find(p => p.kode_produk === product.kode_produk);
                // Jika produk ditemukan, perbarui nilai id_produk dan stok
                if (matchedProduct) {
                    product.id_produk = matchedProduct.id_produk;
                    product.stok = matchedProduct.stok;
                }
                return product;
            });
            // Setelah mengupdate produk, atur nilai produk yang diperbarui
            setProducts(updatedProducts);
        }
    }, [dataPage2, resProduct])

    if (error) {
        return (
            <>
                <div className="flex justify-center">
                    <div className="text-red-500">{error}</div>
                </div>
                <Button
                    className="mt-5 ml-1 bg-red-500"
                    onClick={onPrev}
                    placeholder="">
                    <p className="">Kembali</p>
                </Button>
            </>
        );
    }

    return (
        <>
            {!canEdit && <Progress value={33} placeholder="" className="mb-3" color="red"></Progress>}
            <Typography variant="h5" className="text-center">Data Produk</Typography>
            {notFilled && <Fail Title="Peringatan!" Caption={`Seluruh Kolom Harus Diisi!`} />}
            {alertOOS && <Fail Title="Peringatan!" Caption={`Stok Produk Tidak Mencukupi`} />}
            {errorHarga && <Fail Title="Harga Baru Tidak Boleh Kurang dari Harga Lama!" Caption={`Ganti produk, atau buat Order Baru jika harga produk yang diganti lebih rendah dari produk sebelumnya`} />}

            {loading ?
                <div className="flex justify-center items-center h-screen">
                    <Spinner color="red" />
                </div>
                : <>
                    {!canEdit ?
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
                                <DateInput dateSQL={dateSQL} setDateSQL={handleSetDateSQL} canBefore={false} />
                            </div>
                        </div>
                        :
                        <>
                            {errorHarga &&
                                <Typography variant="paragp" className="flex mt-5">
                                    <a className="font-bold w-1/5">Harga Lama: </a>
                                    <Input value={formatCurrency(hargaLama)} placeholder="" crossOrigin="" disabled>
                                    </Input>
                                </Typography>
                            }
                            <Typography variant="paragp" className="flex mt-5">
                                <a className="font-bold w-1/5">Total Harga: </a>
                                <Input value={formatCurrency(total_harga)} placeholder="" crossOrigin="" disabled>
                                </Input>
                            </Typography>
                        </>
                    }
                    {products.map((product, idx) =>
                        <>
                            <ProductInput
                                key={product.id_produk}
                                dataProduct={filteredDataProduct}
                                productChosen={product}
                                handleDeleteProduct={handleDeleteProduct}
                                onUpdateProduct={handleUpdateProduct}
                                idx={product.idx} />
                        </>
                    )}

                    <div className="justify-center flex">
                        <button className="ml-1 mt-3 p-1 rounded-full"
                            onClick={handleAddProduct}
                            type="button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-6"
                            >
                                <title />
                                <g
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    data-name="add"
                                >
                                    <path d="M12 19V5M5 12h14" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </>}
            <div className="justify-between flex">
                {!canEdit ?
                    <>
                        <Button
                            className="mt-5 ml-1 bg-gray-100 border border-blue-500"
                            onClick={() => {
                                handleSave('left');
                            }}
                            placeholder="">
                            <p className="text-blue-500">Sebelumnya</p>
                        </Button>

                        <Button
                            className="bg-blue-500 mt-5"
                            onClick={() => {
                                handleSave('right');
                            }}
                            placeholder="">
                            Selanjutnya
                        </Button>
                    </>
                    : <>
                        <Button
                            className="mt-5 ml-1 bg-gray-100 border border-red-500"
                            onClick={onPrev}
                            placeholder="">
                            <p className="text-red-500">Batal</p>
                        </Button>
                        <Button
                            className="mt-5 ml-1 bg-gray-100 border border-green-500"
                            onClick={handleEdit}
                            placeholder="">
                            <p className="text-green-500">Simpan</p>
                        </Button>
                    </>}
            </div>
        </>
    )
}