import { Dialog, Button, Card } from "@material-tailwind/react";

interface ConfirmDialogProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, handleClose, handleConfirm }) => {
    return (
        <Dialog
            size="sm"
            open={open}
            handler={handleClose}
            className="bg-transparent shadow-none"
            placeholder=""
        >
            <Card className="p-8" placeholder="">
                <h2 className="text-2xl font-bold mb-4">Konfirmasi Hapus Data</h2>
                <p className="text-gray-700 mb-8">Apakah Anda yakin ingin menghapus data ini?</p>
                <div className="flex justify-end">
                    <Button
                        color="red"
                        onClick={handleClose}
                        placeholder=""
                        className="mr-4"
                    >
                        Batal
                    </Button>
                    <Button
                        color="green"
                        onClick={handleConfirm}
                        placeholder=""
                    >
                        Hapus
                    </Button>
                </div>
            </Card>
        </Dialog>
    );
};

export default ConfirmDialog;
