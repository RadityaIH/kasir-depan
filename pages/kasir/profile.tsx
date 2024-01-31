import { getCookie, setCookie, deleteCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Image from 'next/image';
import profile from '../../public/default_profile.jpg';
import DialogFoto from "@/components/profile/uploadFoto";
import router from "next/router";
import Success from "@/components/success";
import Fail from "@/components/fail";
import axios from "axios";

const token = getCookie("token");

interface UserData {
    username: string;
    nama: string;
    role: string;
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
        console.log(userData);
    }, [token]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const [filled, setFilled] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wPassword, setWPassword] = useState(false);

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
        if (!username || !nama_lengkap) {
            setFilled(true);
            setSuccess(false);
            setError(true);
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
        
                if (response && response.data.error === "Password lama salah") {
                    setWPassword(true);
                    setError(true);
                    setFilled(false);
                    setSuccess(false);
                }

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
                window.location.reload();
            }



        } catch (error) {
            console.error('Fetch error:', error);
            setError(true);
            setSuccess(false);
            setFilled(false);
        }
    };

    return (
        <>
            <DialogFoto handleOpen={handleOpen} open={open} />

            <Head>
                <title>Profil</title>
            </Head>
            
            <Card className="p-3 h-auto" placeholder={"card"}>
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Profil</Typography>
                    {/* {filled && (
                        <Fail Title="Gagal Menyimpan!" Caption="Seluruh kolom harus diisi!" />
                    )
                    } */}
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
                            
                            <div className="relative w-1/5 flex items-center justify-center">
                                <Image
                                className="rounded-full"
                                src={profile}
                                alt="photo-profile"
                                />
                                <label htmlFor="photo">
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
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                        />
                                    </svg>
                                    </div>
                                </div>
                                </label>
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