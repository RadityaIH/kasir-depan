import { Typography } from "@material-tailwind/react";

interface InputProps {
    changes: number;
}

export default function AkunKasir({changes}: InputProps) {
    const TABLE_HEAD = ["No", "Nama Lengkap", "Username", "Aksi"]
    const TABLE_ROWS = [
        {
            no: 1,
            nama: "John Doe",
            username: "johndoe",
        },
        {
            no: 2,
            nama: "Jane Doe",
            username: "janedoe",
        },
    ]

    return (
        <div>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((item, index) => (
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4" key={index}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    classname="leading-none opacity-70 font-bold">
                                    {item}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TABLE_ROWS.map((data, index) => (
                        <tr key={index} className="even:bg-blue-gray-50/50">
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.no}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.nama}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" classname="font-normal">
                                    {data.username}
                                </Typography>
                            </td>
                            <td>
                                <div className="flex items-center">
                                    <div className="inline-block ml-2">
                                        <div className={`p-2 hover:bg-red-300 rounded-xl cursor-pointer bg-red-500`}
                                        // onClick={(e) => data.status_terima === 0 ? handleOpenDeleteDialog(data.id_SO) : null}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    stroke="#FFF"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7ZM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}