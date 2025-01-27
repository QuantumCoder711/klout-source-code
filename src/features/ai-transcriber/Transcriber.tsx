import React, { useState } from "react";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import HeadingH2 from "../../component/HeadingH2";
import { heading } from "../heading/headingSlice";
import { useDispatch } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
// import axios from "axios";

const Transcriber: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    // const { token } = useSelector((state: RootState) => state.auth);
    const photApiBaseUrl = import.meta.env.VITE_PHOTO_API_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    // const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const { events } = useSelector((state: RootState) => (state.events));

    const currentEvent = events.find((event) => event.uuid === uuid);

    const [link, setLink] = useState<string>("");

    const email: string = user?.email || "";

    const [isSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("The Link is: ", link);

        console.log("The user is: ", user);

        if (user && currentEvent) {
            const fileName = user?.id + "_" + currentEvent?.uuid + ".mp3";

            const formData = new FormData();
            formData.append("video_url", link);
            formData.append("file_name", fileName);

            try {
                const res = await axios.post(`${photApiBaseUrl}/get-video-detail`, formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                });
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="h-full w-full">
            {/* Heading */}
            <div className="mb-4 flex justify-between items-center">
                <HeadingH2 title={currentEvent?.title} />
                <div className='flex items-center gap-3'>
                    <Link to="/ai-transcribers/" onClick={() => dispatch(heading("AI Transcriber"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <div className="mx-auto w-full grid place-content-center mt-10">

                <div className="max-w-3xl min-w-[48rem] relative p-10 bg-white rounded-b-md shadow-md">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <label htmlFor="videoUrl" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Video Url: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' />
                            </span>
                            <input
                                id="videoUrl"
                                type="url"
                                required
                                className="grow"
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </label>

                        <label htmlFor="email_id" className="input input-bordered bg-white text-black/50 flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Email <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="email_id" value={email} required readOnly type="email" className="grow" />
                        </label>

                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-klt_primary-500 text-white mx-auto w-fit">
                            {isSubmitting ? "Converting..." : "Get Transcript"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transcriber;