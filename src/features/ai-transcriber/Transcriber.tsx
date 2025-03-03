import React, { useEffect, useState } from "react";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import HeadingH2 from "../../component/HeadingH2";
import { heading } from "../heading/headingSlice";
import { useDispatch } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
// import Loader from "../../component/Loader";

const Transcriber: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const additionalApi = import.meta.env.VITE_ADITTIONAL_URL;
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { events } = useSelector((state: RootState) => (state.events));
    const currentEvent = events.find((event) => event.uuid === uuid);

    const [link, setLink] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<"upload" | "summary">("upload");
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        if (currentEvent && user) {
            axios.post(`${additionalApi}/api/get-transcribed-report`, { eventUuid: currentEvent?.uuid, userId: user?.id }).then(res => {

                if (res.data.data.completedStatus === 3) {
                    setSummary(res.data.data.summaryText);
                }
            })
        }
    }, [tab]);


    const parseText = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<br /> <br /><strong>$1</strong>');
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        if (user && currentEvent) {

            const formData = new FormData();
            formData.append("youtubeUrl", link);
            formData.append("eventUuid", currentEvent.uuid);
            formData.append("userId", String(user.id));

            if (file) {
                formData.append("file", file);
            }

            // To print the key-value pairs of FormData
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            try {
                const res = await axios.post(`${additionalApi}/api/transcribe`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.data.id) {
                    Swal.fire({
                        title: "Success",
                        text: res.data.message,
                        icon: "success"
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="h-full w-full">
            {/* Heading */}
            <div className="mb-4 flex justify-between items-center">
                <HeadingH2 title={currentEvent?.title} />
                <div className="flex items-center gap-3">
                    <Link to="/ai-transcribers/" onClick={() => dispatch(heading("AI Transcriber"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <div className="mx-auto w-full grid place-content-center mt-10">
                <div className="flex justify-between">
                    <div>
                        <button onClick={() => setTab("upload")} className={`btn btn-sm rounded-b-none ${tab === "upload" ? "bg-white" : ""}`}>Upload</button>
                        <button onClick={() => setTab("summary")} className={`btn btn-sm rounded-b-none ${tab === "summary" ? "bg-white" : ""}`}>Summary</button>
                    </div>
                </div>
                <div className="max-w-3xl min-w-[48rem] relative p-10 bg-white rounded-b-md shadow-md">
                    {(tab === "upload" && !loading) && <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label htmlFor="videoUrl" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Video Url: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                            </span>
                            <input
                                id="videoUrl"
                                type="url"
                                required
                                className="grow"
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </label>

                        <label htmlFor="file" className="input input-bordered bg-white text-black/50 flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Select Cookie File <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                            </span>
                            <input
                                id="file"
                                required
                                type="file"
                                className="grow"
                                onChange={(e) => setFile(e.target.files?.[0] || null)} // Updated onChange handler
                            />
                        </label>

                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-klt_primary-500 text-white mx-auto w-fit">
                            {isSubmitting ? "Converting..." : "Get Transcript"}
                        </button>
                    </form>}
                    {(tab === "summary" && !loading) && <div>
                        {summary ?
                            <div>
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-2xl">Summary</h3>
                                    <button className="btn btn-sm bg-klt_primary-900 hover:bg-klt_primary-400 text-white">Download</button>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: parseText(summary) }}></p>
                            </div>
                            : <p className="text-center">Transcribing in Progress...</p>}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default Transcriber;
