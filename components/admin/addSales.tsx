import { Button, Card, CardBody, CardFooter, Dialog, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Fail from "../fail";

interface InputProps {
    handleOpen: () => void;
    open: boolean;
    handleChanges: () => void;
    op: string;
    sales: { id_sales: number, nama_sales: string };
}

export default function AddSalesDialog({ handleOpen, open, handleChanges, op, sales }: InputProps) {
    const [namaSales, setNamaSales] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const handleSubmit = async (event: any) => {
        event.preventDefault()

        if (namaSales === "") {
            setError(true)
            return;
        }

        try {
            const token = getCookie("token");

            if (token) {
                if (op === "Add") {
                    const response = await axios.post(`${process.env.BACKEND_API}/addSales`, {
                        nama_sales: namaSales,
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
                } else if (op === "Update") {
                    const response = await axios.put(`${process.env.BACKEND_API}/updateSales`, {
                        id_sales: sales.id_sales,
                        nama_sales: namaSales,
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
                }
                handleOpen()
                setNamaSales("")
                setError(false)
                handleChanges()
            }
        } catch (error: any) {
            console.error('Fetch error');
        }
    }

    useEffect(() => {
        if (op === "Update") {
            setNamaSales(sales.nama_sales)
        }
    }, [op, sales])
    return (
        <>
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shador-none"
                placeholder="">
                <Card placeholder="" className="overflow-y-auto p-3">
                    {error && <Fail Title="Gagal" Caption="Nama Sales tidak boleh kosong" />}
                    <CardBody placeholder="">
                        <Typography variant="h4">{op==="Add"?`Tambahkan Sales Baru`:`Edit Sales`}</Typography>
                        <div className="ml-1 mb-1 mt-5">
                            <Typography variant="paragraph">Nama</Typography>
                        </div>
                        <div className="ml-1">
                            <Input
                                id="nama_sales"
                                name="nama_sales"
                                crossOrigin=""
                                placeholder="Nama Sales"
                                value={namaSales}
                                onChange={(e) => setNamaSales(e.target.value)}
                                autoComplete="off"
                                className="bg-gray-50"></Input>
                        </div>
                    </CardBody>
                    <CardFooter placeholder="" className="flex justify-between">
                        <Button color="red" onClick={handleOpen} placeholder="">Tutup</Button>
                        <Button color="green" onClick={handleSubmit} placeholder="">Simpan</Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    )
}