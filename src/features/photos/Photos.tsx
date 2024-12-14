import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import HeadingH2 from "../../component/HeadingH2";
import { heading } from "../heading/headingSlice";
import { useDispatch } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";

// Define constants or types for chunk size and apiUrl
const CHUNK_SIZE = 5 * 1024 * 1024; // Example chunk size: 1MB

interface ApiResponse {
    download_link: string;
}

const Photos: React.FC = () => {
    const photApiBaseUrl = import.meta.env.VITE_PHOTO_API_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const {currentEvent} = useSelector((state: RootState)=>(state.events));
    const [eventZip, setEventZip] = useState<File[]>([]);
    const [profileZip, setProfileZip] = useState<File[]>([]);
    const [email,] = useState<string>(user?.email || "");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("2");
    const [downloadUrl, setDownloadUrl] = useState<string>("");


    // Event handlers with correct types
    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>): void => setSelectedOption(e.target.value);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setEventZip(Array.from(e.target.files));
        }
    };
    const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setProfileZip(Array.from(e.target.files));
        }
    };
    // const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const uploadChunks = async (file: File, fieldName: string): Promise<void> => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append("fileChunk", chunk);
            formData.append("fileName", file.name);
            formData.append("chunkIndex", i.toString());
            formData.append("totalChunks", totalChunks.toString());
            formData.append("fieldName", fieldName);
            formData.append("email", email);
            if (currentEventUUID) {
                formData.append("event_uuid", currentEventUUID);
            }

            console.log("The Form Data is: ", formData);

            try {
                await axios.post(`${photApiBaseUrl}/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } catch (error) {
                console.error(`Error uploading chunk ${i + 1}/${totalChunks} for ${file.name}`, error);
                throw error;
            }
        }
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setIsSubmitting(true);
        setApiResponse("");
        setError("");
        setDownloadUrl("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload eventZip files
            for (const file of eventZip) {
                await uploadChunks(file, "event_zip");
            }

            // Upload profileZip files
            for (const file of profileZip) {
                await uploadChunks(file, "profile_zip");
            }

            // Submit additional data after all chunks are uploaded
            const response = await axios.post<ApiResponse>(`${photApiBaseUrl}/finalize-upload`, {
                email,
                send_email_or_url: selectedOption,
                event_uuid: currentEventUUID
            });

            setLoading(false);
            setIsSubmitting(false);
            if (selectedOption === "1") {
                setApiResponse(`Email sent to ${email} with download link.`);
            } else {
                setDownloadUrl(response.data.download_link);
                setApiResponse("");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            setLoading(false);
            setIsSubmitting(false);
            setApiResponse("Error, try again later!");
        }
    };

    return (
        <div className="h-full w-full">
            {/* Heading */}
            <div className="mb-4 flex justify-between items-center">
                <HeadingH2 title={currentEvent?.title} />
                <div className='flex items-center gap-3'>
                    <Link to="/all-photos/" onClick={() => dispatch(heading("All Events"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <div className="mx-auto w-full h-full grid place-content-center">
                <form onSubmit={handleSubmit} className="flex flex-col max-w-3xl gap-5 bg-white p-10 rounded-md shadow-md">
                    
                    <label htmlFor="eventImages" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold text-green-700 flex justify-between items-center">
                            Event Zip Files: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' />
                        </span>
                        <input
                            id="eventImages"
                            type="file"
                            multiple
                            required
                            className="grow"
                            onChange={handleFileChange}
                        />
                    </label>
                    {/* <div>
                    <label>Profile ZIP Files:</label>
                    <input type="file" multiple required onChange={handleProfileFileChange} />
                </div> */}
                    <label htmlFor="profileImages" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold text-green-700 flex justify-between items-center">
                            Profile Zip Files: <span className="text-red-600 ml-1">*</span>  &nbsp; <TiArrowRight className='mt-1' />
                        </span>
                        <input
                            id="profileImages"
                            type="file"
                            multiple
                            required
                            className="grow"
                            onChange={handleProfileFileChange}
                        />
                    </label>
                    {/* <div>
                    <label>Email:</label>
                    <input type="email" value={email} required onChange={handleEmailChange} />
                </div> */}

                    <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold text-green-700 flex justify-between items-center">Email <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="email_id" value={email} required readOnly type="email" className="grow" />
                    </label>
                    {/* <div>
                    <label>Send Option:</label>
                    <select value={selectedOption} required onChange={handleOptionChange}>
                        <option value="2">Provide Download Link</option>
                    </select>
                </div> */}

                    <label htmlFor="option" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold min-w-fit text-green-700 flex justify-between items-center">Send Option: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <select className="w-full h-full border-none outline-none" value={selectedOption} required onChange={handleOptionChange}>
                            <option value="2" className="border-none outline-none">Provide Download Link</option>
                        </select>
                    </label>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-klt_primary-500 text-white mx-auto w-fit">
                        {loading ? "Uploading..." : "Submit"}
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {apiResponse && <p>{apiResponse}</p>}
                    {downloadUrl && (
                        <div className="apiResponseMessage">
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download file
                            </a>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Photos;
