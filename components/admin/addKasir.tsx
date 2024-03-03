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
    kasir: {id: number, nama: string, username: string};
}

export default function AddKasirDialog({ handleOpen, open, handleChanges, op, kasir }: InputProps) {
    const [namaKasir, setNamaKasir] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error , setError] = useState<boolean>(false);
    const handleSubmit = async (event: any) => {
        event.preventDefault()

        if (namaKasir === "") {
            setError(true)
            return;
        }

        try {
            const token = getCookie("token");

            if (token) {
                if (op === "Add") {
                    const response = await axios.post(`${process.env.BACKEND_API}/addKasir`, {
                        nama: namaKasir,
                        username: username,
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
                    const response = await axios.put(`${process.env.BACKEND_API}/updateKasir`, {
                        id: kasir.id,
                        nama: namaKasir,
                        username: username,
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
                setNamaKasir("")
                setUsername("")
                setError(false)
                handleChanges()
            }
        } catch (error: any) {
            console.error('Fetch error');
        }
    }
    const [idKasir, setIdKasir] = useState<number>(0)
    useEffect(() => {
        if (op === "Update") {
            setNamaKasir(kasir.nama)
            setUsername(kasir.username)
        }
    }, [op, kasir])
    return (
        <>
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shador-none"
                placeholder="">
                <Card placeholder="" className="overflow-y-auto p-3">
                    {error && <Fail Title="Gagal" Caption="Nama Kasir tidak boleh kosong" />}
                    <CardBody placeholder="">
                        <Typography variant="h4">Tambahkan Kasir Baru</Typography>
                        <div className="ml-1 mb-1 mt-5">
                            <Typography variant="paragraph">Username</Typography>
                        </div>
                        <div className="ml-1">
                            <Input
                                id="username"
                                name="username"
                                crossOrigin=""
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                className="bg-gray-50"></Input>
                        </div>
                        <div className="ml-1 mb-1 mt-5">
                            <Typography variant="paragraph">Nama Lengkap</Typography>
                        </div>
                        <div className="ml-1">
                            <Input
                                id="nama_kasir"
                                name="nama_kasir"
                                crossOrigin=""
                                placeholder="Nama Kasir"
                                value={namaKasir}
                                onChange={(e) => setNamaKasir(e.target.value)}
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