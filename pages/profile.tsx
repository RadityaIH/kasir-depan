import { getCookie, setCookie, deleteCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Image from 'next/image';
import profile from '../public/default_profile.jpg';
import DialogFoto from "@/components/profile/uploadFoto";
import router from "next/router";
import Success from "@/components/success";
import Fail from "@/components/fail";
import axios from "axios";
import ConfirmDialog from "@/components/penjualan/confirmDialog";

const token = getCookie("token");

interface UserData {
    username: string;
    nama: string;
    role: string;
    photo_url: string;
}

export default function Profile() {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getCookie("token");

                if (token) {
                    const response = await fetch(`${process.env.BACKEND_API}/getUser`, {
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
                    setUserData(data);
                    setUsername(data ? data.username : "");
                    setNamaLengkap(data ? data.nama : "");
                    setPhotoUrl(data ? data.photo_url : "");
                    console.log(data);
                } else {
                    router.push('/');
                    return;
                }

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserData();
        // console.log(userData);
    }, [token]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const [filled, setFilled] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wPassword, setWPassword] = useState(false);

    const [photoUrl, setPhotoUrl] = useState('')
    const [username, setUsername] = useState("");
    const [nama_lengkap, setNamaLengkap] = useState("");
    const [password_lama, setPasswordLama] = useState("");
    const [password_baru, setPasswordBaru] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevent default form submission

        console.log("Form data:", {
            username: username,
            nama_lengkap: nama_lengkap,
            password_lama: password_lama,
            password_baru: password_baru,
        });

        // Check if any field is empty or undefined
        if (!username || !nama_lengkap || (password_lama && !password_baru)) {
            setFilled(true);
            setError(true);
            setSuccess(false);
            setWPassword(false);
            return;
        }

        try {
            const token = getCookie("token");

            if (token) {
                const response = await axios.put(`${process.env.BACKEND_API}/updateUser`, {
                    username: username,
                    nama_lengkap: nama_lengkap,
                    password_lama: password_lama,
                    password_baru: password_baru,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true // Ensure credentials are sent with the request
                });

                // Check response status
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }


                const data = response.data;
                setSuccess(true);
                setError(false);
                setFilled(false);
                setWPassword(false);
                console.log(data);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            }

        } catch (error: any) {
            console.error('Fetch error:', error);
            if (error.response.data.error.includes("Password lama salah")) {
                setWPassword(true);
                setError(true);
                setFilled(false);
                setSuccess(false);
            } else {
                setError(true);
                setSuccess(false);
                setFilled(false);
                setWPassword(false);
            }
        }
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        await handleDelete();
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        // setSelectedFile(null);
        try {
            const token = getCookie("token");
            if (token) {
                await axios.put(`${process.env.BACKEND_API}/deletePhoto`, {
                    photo_url: photoUrl
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                window.location.reload();
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    return (
        <>
            <DialogFoto handleOpen={handleOpen} open={open} />
            <ConfirmDialog
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
                head="Konfirmasi Hapus Profil"
                message="Apakah anda yakin ingin menghapus foto profil ini?"
            />
            <Head>
                <title>Profil</title>
            </Head>

            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Profil</Typography>
                    {success && (
                        <Success Title="Berhasil!" Caption="Data Profil Berhasil Diperbarui." />
                    )
                    }
                    {error && (
                        <Fail Title="Gagal Menyimpan!"
                            Caption={filled ? `Seluruh kolom harus diisi!` :
                                wPassword ? `Password Lama Salah!` : `Data Profil Gagal Diperbarui.`} />
                    )
                    }
                    <div className="flex ml-10">

                        <div className="relative w-1/4 flex items-center justify-center">
                            <div className="">
                                <Image
                                    className="rounded-full aspect-square object-cover"
                                    src={photoUrl ? `${process.env.BACKEND_API}${photoUrl}` : profile}
                                    alt="photo-profile"
                                    width={500}
                                    height={500}
                                />
                                <label htmlFor="photo">
                                    {photoUrl && (
                                    <div className="absolute bottom-0 left-0">
                                        <div className={`p-1 hover:bg-gray-400 rounded-xl cursor-pointer bg-gray-300`}
                                        onClick={handleOpenDeleteDialog}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                className="w-6 h-6"
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
                                    </div>
                                    )}
                                    <div className="absolute bottom-0 right-0">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 hover:cursor-pointer" onClick={handleOpen}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    stroke="#000"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="ml-10 mt-5 flex items-center">
                                <div className="w-1/4">
                                    <Typography variant="paragraph">Username</Typography>
                                </div>
                                <div className="ml-3 flex-grow">
                                    <Input
                                        id="username"
                                        name="username"
                                        crossOrigin=""
                                        className="bg-gray-50"
                                        label="Username"
                                        value={username ? username : ""}
                                        onChange={(e) => setUsername(e.target.value)}
                                    ></Input>
                                </div>
                            </div>

                            <div className="ml-10 mt-5 flex items-center">
                                <div className="w-1/4">
                                    <Typography variant="paragraph">Nama Lengkap</Typography>
                                </div>
                                <div className="ml-3 flex-grow">
                                    <Input
                                        id="nama_lengkap"
                                        name="nama_lengkap"
                                        crossOrigin=""
                                        className="bg-gray-50"
                                        label="Nama Lengkap"
                                        value={nama_lengkap ? nama_lengkap : ""}
                                        onChange={(e) => setNamaLengkap(e.target.value)}
                                    ></Input>
                                </div>
                            </div>

                            <div className="ml-10 mt-5 flex items-center">
                                <div className="w-1/4">
                                    <Typography variant="paragraph">Password Lama</Typography>
                                </div>
                                <div className="ml-3 flex-grow">
                                    <Input
                                        id="password_lama"
                                        name="password_lama"
                                        crossOrigin=""
                                        type="password"
                                        className="bg-gray-50"
                                        label="Password"
                                        value={password_lama ? password_lama : ""}
                                        onChange={(e) => setPasswordLama(e.target.value)}
                                    ></Input>
                                </div>
                            </div>

                            <div className="ml-10 mt-5 flex items-center">
                                <div className="w-1/4">
                                    <Typography variant="paragraph">Password Baru</Typography>
                                </div>
                                <div className="ml-3 flex-grow">
                                    <Input
                                        id="password_baru"
                                        name="password_baru"
                                        crossOrigin=""
                                        type="password"
                                        className="bg-gray-50"
                                        label="Password"
                                        value={password_baru ? password_baru : ""}
                                        onChange={(e) => setPasswordBaru(e.target.value)}
                                    ></Input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="justify-center flex mt-5">
                        <Button
                            className="bg-green-500 mt-8"
                            type="submit"
                            placeholder=""
                            onClick={handleSubmit}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    )
}