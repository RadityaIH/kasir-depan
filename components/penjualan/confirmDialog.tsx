import { Dialog, Button, Card } from "@material-tailwind/react";

interface ConfirmDialogProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    head: string;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, handleClose, handleConfirm, head, message }) => {
    return (
        <Dialog
            size="sm"
            open={open}
            handler={handleClose}
            className="bg-transparent shadow-none"
            placeholder=""
        >
            <Card className="p-8" placeholder="">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-700 mb-8">{message}</p>
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
                        Konfirmasi
                    </Button>
                </div>
            </Card>
        </Dialog>
    );
};

export default ConfirmDialog;
