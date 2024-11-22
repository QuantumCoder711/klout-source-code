import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import DataTable from './DataTable';
import ScoreCard from '../../../component/ScoreCard';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import Loader from '../../../component/Loader';

type MessageState = {
    _id: string;
    messageID: string;
    customerPhoneNumber: string;
    messageStatus: string;
    timestamp: string;
    __v: number;
  }
  
  type ReciptState = {
    _id: string;
    eventUUID: string;
    userID: string;
    firstName: string;
    messageID: MessageState;
    templateName: string;
    __v: number;
  }


const WhatsAppReport: React.FC = () => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const [selectedTemplate, setSelectedTemplate] = useState('event_downloadapp');
    const [allData, setAllData] = useState([]);
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const [totalMessage, setTotalMessage] = useState(0);
    const [totalDelivered, setTotalDelivered] = useState(0);
    const [totalRead, setTotalRead] = useState(0);
    const [totalFailed, setTotalFailed] = useState(0);
    const [changeCardStatus, setChangeCartStatus] = useState<string>("Sent");

    const userID = user?.id;
    console.log(userID);

    useEffect(() => {

        axios.post("https://app.klout.club/api/organiser/v1/whatsapp/all-recipt",
            {
                eventUUID: currentEventUUID,
                templateName: selectedTemplate,
                userID,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => {
                console.log(res.data.data);
                setAllData(res.data.data);
                setTotalMessage(res.data.data.length)
                const delivered = res.data.data.filter((item:ReciptState) => item.messageID && item.messageID.messageStatus !== "Failed");
                setTotalDelivered(delivered.length);
                const read = res.data.data.filter((item:ReciptState) => item.messageID && item.messageID.messageStatus === "Read");
                setTotalRead(read.length)
                const failed = res.data.data.filter((item:ReciptState) => item.messageID && item.messageID.messageStatus === "Failed");
                setTotalFailed(failed.length)
            })
    }, [selectedTemplate]);

    if(loading) {
        return <Loader />
    }

    return (
        <div>
            {/* Heading  */}
            <div className="mb-6 flex justify-between items-center">
                <HeadingH2 title='WhatsApp Report' />

                {/* Custom Tab Menu */}
                <div className='flex rounded-md border border-klt_primary-500 w-fit'>
                    {/* <div className={`font-medium py-2 px-4 cursor-pointer rounded-l-md grid place-content-center ${activeTab === 1 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(1); setSelectedTemplate("delegate_invitation");  setChangeCartStatus("Sent")}}>Invitation</div> */}
                    <div className={`font-medium py-2 px-4 border-x border-klt_primary-500 cursor-pointer grid place-content-center ${activeTab === 1 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(1); setSelectedTemplate("event_downloadapp");  setChangeCartStatus("Sent")}}>Reminder</div>
                    <div className={`font-medium py-2 px-4 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 2 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(2); setSelectedTemplate("event_reminder_today");  setChangeCartStatus("Sent")}}>Same Day Invitation</div>
                    <div className={`font-medium py-2 px-4 cursor-pointer rounded-r-md grid place-content-center ${activeTab === 3 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(3); setSelectedTemplate("event_poll_feedback");  setChangeCartStatus("Sent")}}>Event Poll</div>
                </div>
            </div>


            {/* Rendering Cards */}
            <div className='flex gap-5'>
                <div className='w-full grid grid-cols-4 gap-3'>
                    <div onClick={()=>{setChangeCartStatus("Sent")}} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='blue' content={totalMessage} title='Sent Messages' />
                    </div>
                    <div onClick={()=>{setChangeCartStatus("Delivered")}} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='green' content={totalDelivered} title='Delivered Messages' />
                    </div>
                    <div onClick={()=>{setChangeCartStatus("Read")}} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='yellow' content={totalRead} title='Read Messages' />
                    </div>
                    <div onClick={()=>{setChangeCartStatus("Failed")}} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='red' content={totalFailed} title='Failed Messages' />
                    </div>
                </div>
            </div>

            {/* Rendering Table */}
            <DataTable data={allData} cardStatus={changeCardStatus}/>

        </div>
    )
}

export default WhatsAppReport;