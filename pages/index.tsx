import Head from "next/head";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie, deleteCookie, getCookie } from "cookies-next"
import Fail from "@/components/fail";

// type User = {
//   username: string;
// }

export default function Login() {
  // const [data, setData] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(false);
  const [notFilled, setNotFilled] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(`${process.env.BACKEND_API}/cekUser`);
  //       const responseData = await res.json();
  //       setData(responseData)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   };
  //   fetchData();
  // }, [])

  // console.log(data)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setNotFilled(true);
      setError(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.BACKEND_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const responseData = await res.json();
      setCookie("token", responseData.token, {maxAge: 60 * 60 * 12,})
      console.log(responseData)

      if (responseData.success) {
        router.push("/kasir");
      } else {
        setError(true);
        setNotFilled(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const token = getCookie("token");
  useEffect(() => {
    deleteCookie("token")
    console.log("cek:", token)
  }, [token])

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="h-screen w-screen relative flex">
        <div className="w-1/2 h-full flex justify-center items-center">
            <Image
                src="/../../offo-living.png"
                width={500}
                height={500}
                alt="Picture of the author"></Image>
            <Typography className="text-center mt-2 absolute bottom-3 text-gray-500">by Raditya Ilham Hastoro - Informatika &rsquo;21 - Diponegoro University</Typography>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center bg-orange">
          <div className="flex flex-col justify-center bg-white shadow-lg shadow-blue-500/20 z-30 px-14 py-5 border-solid border-2 w-5/6 h-5/6 rounded-lg">
            <Typography variant="h1" className="text-center">Login</Typography>
            {/* If error is true, show error message */}
            {error && (
                  <Fail Title="Login gagal." 
                  Caption="Username atau password salah!" />
              )
            }
            {notFilled && (
                  <Fail Title="Login gagal." 
                  Caption="Username atau password harus diisi!" />
              )
            }
            <form className="flex flex-col">
              <Typography variant="paragraph" className="mt-8">Username</Typography>
              <Input
                size="lg"
                placeholder="Masukkan Username"
                crossOrigin=''
                className="h-10 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit(e);
                    }
                }}
              />
              <Typography variant="paragraph" className="mt-4">Password</Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Masukkan password"
                crossOrigin=''
                className="h-10 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                    className: "before:content-none after:content-none",
                }}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    handleSubmit(e);
                    }
                }}
              />
              <Button className="mt-14 bg-orange" fullWidth placeholder="Login" onClick={handleSubmit}>Login</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}