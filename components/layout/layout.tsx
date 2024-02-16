import React, { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { getCookie } from "cookies-next";
import { Spinner } from "@material-tailwind/react";
import { redirect } from "next/navigation";
import router from "next/router";

const token = getCookie("token");

interface UserData {
    username: string;
    nama: string;
    role: string;
  }

const Layout = ({ children }: PropsWithChildren) => {
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
                    console.log(data);
                } else {
                    router.push('/');
                    return;
                }

            } catch (error) {
                console.error('Fetch error:', error);
                return <div>Database Error!</div>
            }
        };
        
        fetchUserData();
        console.log(userData);
    }, [token]);

    return (
        <div>
            {userData ? (
            <>
            <div className="h-1/5 flex">
                <Navbar username={userData ? userData.username : ""}/>
            </div>
            <div className="flex h-4/5">
                <div className="w-1/5">
                    <Sidebar nama={userData ? userData.nama : ""} role={userData ? userData.role : ""}/>
                </div>
                <div className="w-4/5 flex-grow mt-3 ml-3 mr-3">
                    {children}
                </div>
            </div>
            </>
            ) : <div className="flex justify-center items-center h-screen">
            <Spinner color="red" />
            </div>}
        </div>
    );
};

export default Layout;
