import { Button, Input, Option, Progress, Radio, Select, Typography } from "@material-tailwind/react";
import { set } from "lodash";
import { useEffect, useState } from "react";
import Fail from "../fail";

interface InputProps {
    onPrev: () => void;
    onNext: () => void;
    total_harga: number;
    dataPage3: { total_harga: number, metodeBayar1Mix: string, metodeBayar2Mix: string, downPayment1: number, downPayment2: number, balance_due: number }
    setDataPage3: (data: any) => void;
}

export default function InputPage3({ onPrev, onNext, total_harga, dataPage3, setDataPage3 }: InputProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    const [metodePembayaran1, setMetodePembayaran1] = useState<string>("");
    const [metodePembayaran2, setMetodePembayaran2] = useState<string>("");

    const [bank1, setBank1] = useState<string>("");
    const [bank2, setBank2] = useState<string>("");

    const [metodeBayar1Mix, setMetodeBayar1Mix] = useState<string>("");
    useEffect(() => {
        if (metodePembayaran1 === "Cash") {
            setMetodeBayar1Mix("Cash");
        } else {
            setMetodeBayar1Mix(`${metodePembayaran1} ${bank1}`);
        }
    }, [metodePembayaran1, bank1])

    const [metodeBayar2Mix, setMetodeBayar2Mix] = useState<string>("");
    useEffect(() => {
        if (metodePembayaran2 === "Cash") {
            setMetodeBayar2Mix("Cash");
        } else {
            setMetodeBayar2Mix(`${metodePembayaran2} ${bank2}`);
        }
    }, [metodePembayaran2, bank2])

    const [downPayment1, setDownPayment1] = useState<number>();
    const [downPayment2, setDownPayment2] = useState<number>();

    const maxDP1 = total_harga;
    const handleDP1 = (value: number) => {
        if (value <= maxDP1) {
            setDownPayment1(value);
        }
    }

    const maxDP2 = total_harga - (downPayment1 || 0);
    const handleDP2 = (value: number) => {
        if (value <= maxDP2) {
            setDownPayment2(value);
        }
    }

    const handleDeleteDP2 = () => {
        setDownPayment2(undefined);
        setMetodePembayaran2("");
        setBank2("");
    }

    const balanceDue = total_harga - (downPayment1 || 0) - (downPayment2 || 0);
    const formattedBalanceDue = balanceDue >= 0 ? formatCurrency(balanceDue) : formatCurrency(0);

    const [notFilled, setNotFilled] = useState(false);
    const handleSave = (direction: string) => {
        setDataPage3({
            total_harga: total_harga,
            metodeBayar1Mix: metodeBayar1Mix,
            metodeBayar2Mix: metodeBayar2Mix,
            downPayment1: downPayment1,
            downPayment2: downPayment2,
            balance_due: balanceDue
        });
        if (direction === "left") {
            onPrev();
        }
        if (!downPayment1 || !metodePembayaran1 || (!downPayment2 && !!metodePembayaran2) || (!!downPayment2 && !metodePembayaran2) || (!bank1 && metodePembayaran1 !== "Cash") || (!bank2 && !!metodePembayaran2 && metodePembayaran2 !== "Cash")) {
            console.log(!downPayment1, !metodePembayaran1, (!downPayment2 && !!metodePembayaran2), (!!downPayment2 && !metodePembayaran2), (!bank1 && metodePembayaran1 !== "Cash"), (!bank2 && !!metodePembayaran2 && metodePembayaran2 !== "Cash"))
            setNotFilled(true);
            return;
        }
        if (direction === "right") {
            onNext();
        }
        setNotFilled(false);
    }

    useEffect(() => {
        if (dataPage3.downPayment1 !== 0){
            setDownPayment1(dataPage3.downPayment1);
        }
        if (dataPage3.downPayment2 !== 0) {
            setDownPayment2(dataPage3.downPayment2);
        }
        setMetodePembayaran1(dataPage3.metodeBayar1Mix.split(" ")[0]);
        setMetodePembayaran2(dataPage3.metodeBayar2Mix.split(" ")[0]);
        setBank1(dataPage3.metodeBayar1Mix.split(" ")[1]);
        setBank2(dataPage3.metodeBayar2Mix.split(" ")[1]);
        console.log(dataPage3)
    }, [dataPage3])

    return (
        <>
            <Progress value={66} placeholder="" className="mb-3" color="red"></Progress>
            <Typography variant="h5" className="my-5 text-center">Data Pembayaran</Typography>
            
            {notFilled && <Fail Title="Peringatan" Caption={`Seluruh Kolom Harus Diisi!`} />}
            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Total Harga</Typography>
                </div>
                <Input
                    id="total_harga"
                    name="total_harga"
                    crossOrigin=""
                    className="bg-gray-50"
                    disabled
                    value={formatCurrency(total_harga)}></Input>
            </div>

            <div className="flex gap-14">
                <div className="w-1/2 bg-gray-50 p-3 rounded-lg mt-5 border border-dashed">
                    <Typography variant="h6" className="mb-3 ml-1">Down Payment 1</Typography>
                    <div className="flex ml-1 items-center">
                        <div className="w-2/5">
                            <Typography variant="paragraph">Metode Pembayaran</Typography>
                        </div>

                        <div className="" id="metode_bayar">
                            <Radio name="type_dp1" label="Cash" color="red" crossOrigin="" onChange={() => setMetodePembayaran1("Cash")} checked={metodePembayaran1 === "Cash"} />
                            <Radio name="type_dp1" label="Debit" color="red" crossOrigin="" onChange={() => setMetodePembayaran1("Debit")} checked={metodePembayaran1 === "Debit"} />
                            <Radio name="type_dp1" label="CC" color="red" crossOrigin="" onChange={() => setMetodePembayaran1("CC")} checked={metodePembayaran1 === "CC"} />
                        </div>
                    </div>

                    {(metodePembayaran1 === "Debit" || metodePembayaran1 === "CC") && (
                        <div className="ml-1 mt-5 flex items-center">
                            <div className="w-2/5">
                                <Typography variant="paragraph">Bank</Typography>
                            </div>
                            <div className="w-1/4">
                                <Select value={bank1} placeholder="" label="Bank yang Digunakan" onChange={(value) => setBank1(value as string)}>
                                    <Option value="Mandiri">Mandiri</Option>
                                    <Option value="BNI">BNI</Option>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="ml-1 mt-5 flex items-center">
                        <div className="w-2/3">
                            <Typography variant="paragraph">Total DP1</Typography>
                        </div>
                        <Input
                            id="down_payment"
                            name="down_payment"
                            type="number"
                            crossOrigin=""
                            className="bg-gray-50"
                            value={downPayment1}
                            onChange={(e) => handleDP1(parseInt(e.target.value))}
                            label="Contoh: 1500000"></Input>
                    </div>
                </div>

                <div className="w-1/2 bg-gray-50 p-3 rounded-lg mt-5 border border-dashed">
                    <div className="justify-between flex">
                        <Typography variant="h6" className="mb-3 ml-1">Down Payment 2 &#40;optional&#41;</Typography>
                        <div onClick={handleDeleteDP2} className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                className="w-3"
                                fill="#F44336"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M0 14.545 1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex ml-1 items-center">
                        <div className="w-2/5">
                            <Typography variant="paragraph">Metode Pembayaran</Typography>
                        </div>

                        <div className="" id="metode_bayar">
                            <Radio name="type_dp2" label="Cash" color="red" crossOrigin="" onChange={() => setMetodePembayaran2("Cash")} checked={metodePembayaran2 === "Cash"} />
                            <Radio name="type_dp2" label="Debit" color="red" crossOrigin="" onChange={() => setMetodePembayaran2("Debit")} checked={metodePembayaran2 === "Debit"} />
                            <Radio name="type_dp2" label="CC" color="red" crossOrigin="" onChange={() => setMetodePembayaran2("CC")} checked={metodePembayaran2 === "CC"} />
                        </div>
                    </div>

                    {(metodePembayaran2 === "Debit" || metodePembayaran2 === "CC") && (
                        <div className="ml-1 mt-5 flex items-center">
                            <div className="w-2/5">
                                <Typography variant="paragraph">Bank</Typography>
                            </div>
                            <div className="w-1/4">
                                <Select value={bank2} placeholder="" label="Bank yang Digunakan" onChange={(value) => setBank2(value as string)}>
                                    <Option value="Mandiri">Mandiri</Option>
                                    <Option value="BNI">BNI</Option>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="ml-1 mt-5 flex items-center">
                        <div className="w-2/3">
                            <Typography variant="paragraph">Total DP2</Typography>
                        </div>
                        <Input
                            id="down_payment2"
                            name="down_payment2"
                            type="number"
                            crossOrigin=""
                            className="bg-gray-50"
                            value={downPayment2 ? downPayment2 : ""}
                            onChange={(e) => handleDP2(parseInt(e.target.value))}
                            label="Contoh: 1500000"></Input>
                    </div>
                </div>
            </div>

            <div className="ml-1 mt-5 flex items-center">
                <div className="w-1/4">
                    <Typography variant="paragraph">Balance Due</Typography>
                    {/** Total Harga - Down Payment. AUTO!*/}
                </div>
                <Input
                    id="balance_due"
                    name="balance_due"
                    crossOrigin=""
                    className="bg-gray-50"
                    value={formattedBalanceDue}
                    disabled></Input>
            </div>

            <div className="justify-between flex">
                <Button
                    className="mt-5 ml-1 bg-gray-100 border border-blue-500"
                    // type="submit"
                    onClick={() => handleSave('left')}
                    placeholder="">
                    <p className="text-blue-500">Sebelumnya</p>
                </Button>

                <Button
                    className="bg-blue-500 mt-5"
                    // type="submit"
                    onClick={() => handleSave('right')}
                    placeholder="">
                    Selanjutnya
                </Button>
            </div>
        </>
    )
}