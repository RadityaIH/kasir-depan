import Link from "next/link";
import Image from 'next/image';
import offo from "../../public/offo-living.png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";


const Sidebar = (props: { nama: string, role: string }) => {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setNama(props.nama)
    setRole(props.role)
  }, [props.nama, props.role])

  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const router = useRouter();

  return (
    <div className="px-8 pb-10 shadow-lg shadow-red-500/20 justify-center border-solid border-5 rounded-lg bg-gray-300 m-3 sticky top-3">
      {role === "Kasir" &&
        <div className="flex-none text-left">
          <div className="flex justify-center">
            <div className="">
              <Image
                src={offo}
                width={150}
                height={150}
                alt="Picture of the author"></Image>
            </div>
          </div>
          <div className="text-left ml-3">
            <p className="font-bold">{nama}</p>
            <p className="text-sm">{role}</p>
          </div>
          <div className="flex flex-col mt-5">
            <div>
              <Link href="/kasir">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100 rounded-t-lg" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#1C274C"
                      strokeLinecap="round"
                      strokeWidth={1.5}
                      d="M22 12.204v1.521c0 3.9 0 5.851-1.172 7.063C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212C2 19.576 2 17.626 2 13.725v-1.521c0-2.289 0-3.433.52-4.381.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2c1.108 0 2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715M15 18H9"
                    />
                  </svg>
                  <p className={`${router.pathname === "/kasir" && 'font-bold'}`}>Dashboard</p>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/kasir/transaksi">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path d="M17.002 13a1 1 0 0 1 .117 1.993l-.117.007H5.417l3.292 3.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083-5-5c-.603-.602-.22-1.614.593-1.701L3.002 13h14Zm-.39-8.79.095.083 5 5c.603.602.22 1.614-.593 1.701L21 11H7a1 1 0 0 1-.117-1.993L7 9h11.585l-3.292-3.293a1 1 0 0 1-.083-1.32l.083-.094a1 1 0 0 1 1.32-.083Z" />
                  </svg>
                  <p className={`${router.pathname === "/kasir/transaksi" && 'font-bold'}`}>Transaksi</p>
                </div>
              </Link>
            </div>
            <div>
              <div className={`flex items-center flex-row py-3 pl-3 hover:bg-gray-100 ${open && 'bg-blue-gray-50 rounded-md'}`} onClick={() => handleOpen(1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    stroke="#1C274C"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l2.5 2.5"
                  />
                  <path
                    fill="#1C274C"
                    d="m5.604 5.604-.53-.53.53.53ZM4.338 6.871l-.75.003a.75.75 0 0 0 .746.747l.004-.75Zm2.542.762a.75.75 0 1 0 .007-1.5l-.007 1.5ZM5.075 4.321a.75.75 0 0 0-1.5.008l1.5-.008ZM3.75 12a.75.75 0 0 0-1.5 0h1.5Zm13.125 8.445a.75.75 0 1 0-.75-1.298l.75 1.298Zm2.272-4.32a.75.75 0 1 0 1.298.75l-1.298-.75ZM5.14 5.07a.75.75 0 1 0 1.056 1.066L5.14 5.071Zm13.722.067c-3.82-3.82-9.993-3.859-13.788-.064l1.06 1.06c3.2-3.199 8.423-3.18 11.668.065l1.06-1.061ZM5.074 5.074 3.808 6.34l1.06 1.06 1.267-1.265-1.061-1.061Zm-.74 2.547 2.546.012.007-1.5-2.545-.012-.008 1.5Zm.754-.754L5.075 4.32l-1.5.008.013 2.545 1.5-.007ZM12 3.75A8.25 8.25 0 0 1 20.25 12h1.5c0-5.385-4.365-9.75-9.75-9.75v1.5Zm0 16.5A8.25 8.25 0 0 1 3.75 12h-1.5c0 5.385 4.365 9.75 9.75 9.75v-1.5Zm4.125-1.103A8.209 8.209 0 0 1 12 20.25v1.5c1.775 0 3.44-.475 4.875-1.305l-.75-1.298ZM20.25 12a8.209 8.209 0 0 1-1.103 4.125l1.298.75A9.708 9.708 0 0 0 21.75 12h-1.5ZM6.196 6.137A8.221 8.221 0 0 1 12 3.75v-1.5a9.721 9.721 0 0 0-6.86 2.821l1.056 1.066Z"
                  />
                </svg>
                <p className={`${router.pathname === "/kasir/penjualan" && 'font-bold'} ${router.pathname === "/kasir/penjualanSales" && 'font-bold'}`}>Penjualan</p>
                <div>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`ml-2 h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />
                </div>
              </div>
            </div>
            {open ? (
              <div className="ml-8">
                <div>
                  <Link href="/kasir/penjualan">
                    <div className="flex items-center flex-row py-2 pl-2 hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 mr-2"
                        viewBox="0 0 512 512"
                      >
                        <title>{"item-details"}</title>
                        <path
                          fill="#000"
                          fillRule="evenodd"
                          d="M469.333 85.333v341.334H42.667V85.333h426.666ZM426.667 128H85.333v256h341.334V128ZM384 298.667v32H277.333v-32H384Zm0-64v32H277.333v-32H384Zm-149.333-64V256H128v-85.333h106.667Zm149.333 0v32H277.333v-32H384Z"
                        />
                      </svg>
                      <p className={`${router.pathname === "/kasir/penjualan" && 'font-bold'}`}>Item</p>
                    </div>
                  </Link>
                </div>
                <div>
                  <Link href="/kasir/penjualanSales">
                    <div className="flex items-center flex-row py-2 pl-2 hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7"
                        viewBox="0 0 100 100"
                      >
                        <circle cx={63.3} cy={47.6} r={10.7} />
                        <path d="M63.6 60.3h-.8a16.43 16.43 0 0 0-16.1 13.9c0 .7.2 2.4 2.7 2.4h27.2c2.5 0 2.7-1.5 2.7-2.4a15.65 15.65 0 0 0-15.7-13.9ZM48.6 58.3c.4-.4.1-.7.1-.7a17.94 17.94 0 0 1-3.1-10 17.18 17.18 0 0 1 3.2-10.2.1.1 0 0 1 .1-.1 1.76 1.76 0 0 0 .4-1.1V25.4a2.15 2.15 0 0 0-2-2H22.5a2.18 2.18 0 0 0-2 2.1v46.2H40a24.12 24.12 0 0 1 8.6-13.4Zm-17 7.7a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm11.9 21a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Z" />
                      </svg>
                      <p className={`${router.pathname === "/kasir/penjualanSales" && 'font-bold'}`}>Sales</p>
                    </div>
                  </Link>
                </div>
              </div>
            ) : ""}
            <div>
              <Link href="/kasir/inventory">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100 rounded-b-lg" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 9h14M5 9v6m14-6v6m0 0v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4m14 0H5m3-3h.01M8 6h.01M8 18h.01"
                    />
                  </svg>
                  <p className={`${router.pathname === "/kasir/inventory" && 'font-bold'}`}>Inventory</p>
                </div>
              </Link>
            </div>
            {/* <Button className="bg-orange mt-2" placeholder="Logout" onClick={handleLogout}>Logout</Button> */}
          </div>
        </div>
      }
      {role === "Admin" &&
        <div className="flex-none text-left">
          <div className="flex justify-center">
            <div className="">
              <Image
                src={offo}
                width={150}
                height={150}
                alt="Picture of the author"></Image>
            </div>
          </div>
          <div className="text-left ml-3">
            <p className="font-bold">{nama}</p>
            <p className="text-sm">{role}</p>
          </div>
          <div className="flex flex-col mt-5">
            <div>
              <Link href="/admin">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100 rounded-t-lg" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#1C274C"
                      strokeLinecap="round"
                      strokeWidth={1.5}
                      d="M22 12.204v1.521c0 3.9 0 5.851-1.172 7.063C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212C2 19.576 2 17.626 2 13.725v-1.521c0-2.289 0-3.433.52-4.381.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2c1.108 0 2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715M15 18H9"
                    />
                  </svg>
                  <p className={`${router.pathname === "/admin" && 'font-bold'}`}>Dashboard</p>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/admin/akun">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100 rounded-t-lg" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 32 32"
                  >
                    <title />
                    <path d="M20 19a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3ZM8.94 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2ZM25 20H15a5 5 0 0 0-5 5v5h2v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5h2v-5a5 5 0 0 0-5-5ZM13 11H6a4 4 0 0 0-4 4v4h2v-4a2 2 0 0 1 2-2h7Z" />
                  </svg>
                  <p className={`${router.pathname === "/admin/akun" && 'font-bold'}`}>Manajemen Akun</p>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/admin/history">
                <div className="flex items-center flex-row py-3 pl-3 hover:bg-gray-100 rounded-b-lg" onClick={() => handleOpen(0)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      stroke="#1C274C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l2.5 2.5"
                    />
                    <path
                      fill="#1C274C"
                      d="m5.604 5.604-.53-.53.53.53ZM4.338 6.871l-.75.003a.75.75 0 0 0 .746.747l.004-.75Zm2.542.762a.75.75 0 1 0 .007-1.5l-.007 1.5ZM5.075 4.321a.75.75 0 0 0-1.5.008l1.5-.008ZM3.75 12a.75.75 0 0 0-1.5 0h1.5Zm13.125 8.445a.75.75 0 1 0-.75-1.298l.75 1.298Zm2.272-4.32a.75.75 0 1 0 1.298.75l-1.298-.75ZM5.14 5.07a.75.75 0 1 0 1.056 1.066L5.14 5.071Zm13.722.067c-3.82-3.82-9.993-3.859-13.788-.064l1.06 1.06c3.2-3.199 8.423-3.18 11.668.065l1.06-1.061ZM5.074 5.074 3.808 6.34l1.06 1.06 1.267-1.265-1.061-1.061Zm-.74 2.547 2.546.012.007-1.5-2.545-.012-.008 1.5Zm.754-.754L5.075 4.32l-1.5.008.013 2.545 1.5-.007ZM12 3.75A8.25 8.25 0 0 1 20.25 12h1.5c0-5.385-4.365-9.75-9.75-9.75v1.5Zm0 16.5A8.25 8.25 0 0 1 3.75 12h-1.5c0 5.385 4.365 9.75 9.75 9.75v-1.5Zm4.125-1.103A8.209 8.209 0 0 1 12 20.25v1.5c1.775 0 3.44-.475 4.875-1.305l-.75-1.298ZM20.25 12a8.209 8.209 0 0 1-1.103 4.125l1.298.75A9.708 9.708 0 0 0 21.75 12h-1.5ZM6.196 6.137A8.221 8.221 0 0 1 12 3.75v-1.5a9.721 9.721 0 0 0-6.86 2.821l1.056 1.066Z"
                    />
                  </svg>
                  <p className={`${router.pathname === "/admin/history" && 'font-bold'}`}>History Log</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      }
    </div>
  );
};
export default Sidebar;
