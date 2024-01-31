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

    const salesOptions = [
        { value: '1', label: 'Sales 1' },
        { value: '2', label: 'Sales 2' },
        // Add more customer options as needed
    ];
    const [selectedSales, setSelectedSales] = useState({ value: 'add', label: 'Sales yang Menjual Produk' });
    const handleChangeSales = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setSelectedSales(selectedOption);
        }
    };

    const [products, setProducts] = useState([{ id: 1, selectedProduct: '', remarks: '' }]);

    const handleAddProduct = () => {
        const newProductId = products.length + 1;
        setProducts([...products, { id: newProductId, selectedProduct: '', remarks: '' }]);
    };

    const handleRemoveProduct = (productId: number) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
    };

    const handleChangeProduct = (selectedOption: OptionType | null, productId: number) => {
        if (selectedOption) {
            const updatedProducts = products.map(product =>
                product.id === productId ? { ...product, selectedProduct: selectedOption } : product
            );
            setProducts(updatedProducts);
        }
    };

    return (
        <>
            <Progress value={33} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="my-5 text-center">Data Produk</Typography>

            <div className="flex gap-5">
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
                    <DateInput />
                </div>
            </div>

            {products.map((product) =>
                <div key={product.id} className="p-3 border-4 border-dashed mt-7 rounded-lg">
                    <div className="flex ml-1 mb-1 mt-4">
                        <Typography variant="paragraph">Pilih Produk</Typography>
                    </div>
                    <div className="ml-1">
                        <Select
                            id="pilih_produk"
                            name="pilih_produk"
                            value={product.selectedProduct}
                            onChange={(selectedOption) => handleChangeProduct(selectedOption, product.id)}
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

                    <div className="flex gap-10">
                        <div className="ml-1 mb-1 mt-5 w-1/2">
                            <Typography variant="paragraph">Kode Produk</Typography>
                            <Input
                                id="kode_produk"
                                name="kode_produk"
                                crossOrigin=""
                                label="Kode Produk"
                                className="bg-gray-50"
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
                                disabled></Input>
                        </div>

                        <div className="mr-1 mb-1 mt-5 w-1/2">
                            <Typography variant="paragraph">Quantity</Typography>
                            {/** Validasi stok dari gudang */}
                            <Input
                                id="qty"
                                name="qty"
                                crossOrigin=""
                                className="bg-gray-50"
                                type="number"
                                label=""></Input>
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

                    <div className="justify-center flex">
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
                    </div>
                </div>
            )}

            <div className="justify-center flex">
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
        </>
    )
}