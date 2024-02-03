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

interface InputProps {
    handleOpen: () => void;
    open: boolean;
    selectedSO: SOResponse;
}

interface SOResponse {
    alamat: string;
    balance_due: number;
    harga_item_ppn: string;
    id: number;
    id_SO: string;
    jadwal_kirim: string;
    kode_produk: string;
    metode_dp1: string;
    metode_dp2: string | null;
    nama_cust: string;
    nama_produk: string;
    nama_sales: string;
    no_telp: string;
    qty: string;
    remarks: string | null;
    status_terima: number;
    tanggal_transaksi: string;
    total_dp1: number;
    total_dp2: number | null;
    total_harga: number;
}

export default function DialogEdit({ handleOpen, open, selectedSO }: InputProps) {
    return (
        <Dialog
            size="lg"
            open={open}
            handler={handleOpen}
            className="bg-transparent shador-none"
            placeholder="">
            <Card placeholder="">
                    <CardBody placeholder="">
                        <Typography variant="body">Edit {selectedSO && selectedSO.id_SO}</Typography>
                        
                        {/* <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>  */}

                    </CardBody>
                    <CardFooter placeholder="" className="flex justify-between">
                        <Button color="red" onClick={handleOpen} placeholder="">Tutup</Button>
                        <Button color="green" onClick={handleOpen} placeholder="">Simpan</Button>
                    </CardFooter>
                </Card>
        </Dialog>
    )
}