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
} from "@material-tailwind/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";
import Fail from "../fail";

interface InputProps {
    handleOpen: () => void;
    open: boolean;
}

export default function DialogFoto({ handleOpen, open }: InputProps) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [notFilled, setNotFilled] = useState(false)

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleCancel = () => {
        setSelectedFile(null);
        setNotFilled(false);
        handleOpen();
    }

    const handleUpload = async () => {
        console.log(selectedFile);
        if (selectedFile === null) {
            setNotFilled(true);
        } else {
            try {
                const token = getCookie("token");
                if (token) {
                    const formData = new FormData();
                    formData.append('photo', selectedFile)

                    await axios.post(`${process.env.BACKEND_API}/uploadPhoto`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true
                    });
                    setNotFilled(false);
                    handleOpen();
                    window.location.reload();
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    }
    return (
        <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shador-none"
            placeholder="">
            <Card placeholder="">
                <CardBody placeholder="">
                    <Typography variant="paragraph">Upload Foto Profil Baru</Typography>
                    {notFilled &&
                        <div className="mb-5">
                            <Fail Title="Gagal" Caption="Silahkan pilih foto terlebih dahulu" />
                        </div>
                    }
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2" />
                                </svg>
                                {selectedFile ? <>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{(selectedFile as File).name}</p>
                                </>
                                    :
                                    <>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                    </>}
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                </CardBody>
                <CardFooter placeholder="" className="flex justify-between">
                    <Button color="red" onClick={handleCancel} placeholder="">Batal</Button>
                    <Button color="green" onClick={handleUpload} placeholder="">Simpan</Button>
                </CardFooter>
            </Card>
        </Dialog>
    )
}