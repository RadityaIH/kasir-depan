import AkunKasir from "@/components/admin/AkunKasir";
import AkunSales from "@/components/admin/AkunSales";
import AddSalesDialog from "@/components/penjualanSales/addSales";
import {
    Card, Typography, Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    SpeedDial,
    SpeedDialHandler,
    SpeedDialContent,
    SpeedDialAction,
} from "@material-tailwind/react";
import Head from "next/head";
import { useState } from "react";

export default function ManajemenAkun() {
    const [activeTab, setActiveTab] = useState('kasir');

    const handleTabChange = (value: any) => {
        setActiveTab(value);
    };

    const labelProps = {
        variant: "small",
        color: "blue-gray",
        className:
            "absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
    };

    const [changes, setChanges] = useState(0);
    const handleChanges = () => {
        setChanges(changes + 1);
    }
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => {
        setOpenSales((cur) => !cur)
    };

    return (
        <>
            <AddSalesDialog handleOpen={handleOpenSales} open={openSales} handleChanges={handleChanges} />
            <Head>
                <title>Manajemen Akun</title>
            </Head>
            <Card className="p-3 h-auto" placeholder="">
                <div className="ml-1">
                    <Typography variant="h4" className="mb-5">Manajemen Akun</Typography>

                    <div className="w-full">
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <TabsHeader placeholder="">
                                <Tab value="kasir" placeholder="">
                                    Kasir
                                </Tab>
                                <Tab value="sales" placeholder="">
                                    Sales
                                </Tab>
                            </TabsHeader>
                            <TabsBody placeholder="">
                                <div className="p-3">
                                    <TabPanel value="kasir">
                                        <AkunKasir changes={changes}/>
                                    </TabPanel>
                                    <TabPanel value="sales">
                                        <AkunSales changes={changes}/>
                                    </TabPanel>
                                </div>
                            </TabsBody>
                        </Tabs>
                    </div>
                </div>
                <div className="fixed bottom-5 right-5 z-50">
                    <SpeedDial>
                        <SpeedDialHandler>
                            <div className="ml-1 mt-3 p-3 rounded-full bg-orange">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-8"
                                >
                                    <title />
                                    <g
                                        fill="none"
                                        stroke="#FFF"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        data-name="add"
                                    >
                                        <path d="M12 19V5M5 12h14" />
                                    </g>
                                </svg>
                            </div>
                        </SpeedDialHandler>
                        <SpeedDialContent placeholder="">
                            <SpeedDialAction className="relative bg-gray-50 border-2" placeholder="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7"
                                    data-name="Layer 1"
                                    viewBox="0 0 100 100"
                                >
                                    <circle cx={44.6} cy={36.3} r={16} />
                                    <path d="M48.8 79.6c2.7 0 1.2-1.9 1.2-1.9a19.58 19.58 0 0 1-2.5-20.1l.2-.4a1.17 1.17 0 0 0-.9-1.9 18.48 18.48 0 0 0-2.4-.1 24.26 24.26 0 0 0-24 20.9c0 1.2.4 3.5 4.2 3.5h24.2ZM65.2 51.2a14.2 14.2 0 1 0 14.2 14.2 14.25 14.25 0 0 0-14.2-14.2ZM60.4 74a3.5 3.5 0 1 1 3.5-3.5 3.54 3.54 0 0 1-3.5 3.5Zm3.5-11.9a1.27 1.27 0 0 1-.4.7l-2.7 1.5a.48.48 0 0 1-.7 0l-2.7-1.5a1 1 0 0 1-.4-.7V59a1 1 0 0 1 .4-.7l2.7-1.5a.48.48 0 0 1 .7 0l2.7 1.5a1 1 0 0 1 .4.7Zm2.6-4.3a.68.68 0 0 1 .7-.7h5.2a.68.68 0 0 1 .7.7V63a.68.68 0 0 1-.7.7h-5.1a.68.68 0 0 1-.7-.7l-.1-5.2ZM73.4 71l-3.1 3.2a.48.48 0 0 1-.7 0L66.5 71a.48.48 0 0 1 0-.7l3.1-3.2a.48.48 0 0 1 .7 0l3.1 3.2a.48.48 0 0 1 0 .7Z" />
                                </svg>
                                <Typography {...labelProps}>Kasir</Typography>
                            </SpeedDialAction>
                            <SpeedDialAction className="relative bg-gray-50 border-2" placeholder="">
                                <button type="button" onClick={handleOpenSales}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-7"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle cx={63.3} cy={47.6} r={10.7} />
                                        <path d="M63.6 60.3h-.8a16.43 16.43 0 0 0-16.1 13.9c0 .7.2 2.4 2.7 2.4h27.2c2.5 0 2.7-1.5 2.7-2.4a15.65 15.65 0 0 0-15.7-13.9ZM48.6 58.3c.4-.4.1-.7.1-.7a17.94 17.94 0 0 1-3.1-10 17.18 17.18 0 0 1 3.2-10.2.1.1 0 0 1 .1-.1 1.76 1.76 0 0 0 .4-1.1V25.4a2.15 2.15 0 0 0-2-2H22.5a2.18 2.18 0 0 0-2 2.1v46.2H40a24.12 24.12 0 0 1 8.6-13.4Zm-17 7.7a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm11.9 21a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Zm0-10.5a2.18 2.18 0 0 1-2.1 2.1h-2.1a2.18 2.18 0 0 1-2.1-2.1v-2.1a2.18 2.18 0 0 1 2.1-2.1h2.1a2.18 2.18 0 0 1 2.1 2.1Z" />
                                    </svg>
                                </button>
                                <Typography {...labelProps}>Sales</Typography>
                            </SpeedDialAction>
                        </SpeedDialContent>
                    </SpeedDial>
                </div>
            </Card>
        </>
    )
}