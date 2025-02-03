import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import HeadingH2 from "../../component/HeadingH2";
import { heading } from "../heading/headingSlice";
import { useDispatch } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import axios from "axios";
import Swal from "sweetalert2";

interface Photo {
    imageUrl: string;
}

// Define constants or types for chunk size and apiUrl
const chunkSize = 5 * 1024 * 1024; // Example chunk size: 1MB

// const eventUuid = "847a8d36-cd79-4d74-a1e0-b784608b5bb8"; // Replace with actual event UUID
// const userId = "12"; // Replace with actual user ID

const Photos: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const photoBucketUrl = import.meta.env.VITE_PHOTO_BUCKET_URL;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    // const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const { events } = useSelector((state: RootState) => (state.events));

    const currentEvent = events.find((event) => event.uuid === uuid);

    const eventUuid = uuid;
    const userId = user?.id;

    const [eventZip, setEventZip] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    let completedStep = 0;
    const [, setImagesAlreadyUploaded] = useState<boolean>(false);
    const [isSubmitting,] = useState<boolean>(false);
    const [apiResponse,] = useState<string>("");
    const [downloadUrl,] = useState<string>("");
    const sequenceRef = useRef("");

    const [active, setActive] = useState<1 | 2>(1);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [, setFiles] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const imagesPerPage = 6;

    // Calculate the index of the first and last image on the current page
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = photos.slice(indexOfFirstImage, indexOfLastImage);

    const totalPages = Math.ceil(photos.length / imagesPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //For revealing the button
    const [showButton, setShowButton] = useState<boolean>(false);

    // Reveal function
    useEffect(() => {
        const handleButtonDisplay = (event: KeyboardEvent) => {
            sequenceRef.current += event.key.toLowerCase(); // Append the typed key

            // Keep only the last 6 characters
            if (sequenceRef.current.length > 6) {
                sequenceRef.current = sequenceRef.current.slice(-6);
            }

            // Check if sequence matches "reveal"
            if (sequenceRef.current === "reveal") {
                setShowButton(true);
                sequenceRef.current = ""; // Reset sequence
            }

            // Check if sequence matches "hide"
            if (sequenceRef.current === "hide") {
                setShowButton(false);
                sequenceRef.current = ""; // Reset sequence
            }
        };

        window.addEventListener("keydown", handleButtonDisplay);
        return () => window.removeEventListener("keydown", handleButtonDisplay);
    }, []);

    // State to track upload progress
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setEventZip(Array.from(e.target.files));
        }
    };

    const handleZipUpload = async (e: any) => {
        e.preventDefault();

        const totalChunks = Math.ceil(eventZip[0].size / chunkSize);
        const file = eventZip[0];
        const fileName = file.name;

        // Initialize progress for the file
        setUploadProgress(prevProgress => ({
            ...prevProgress,
            [fileName]: 0,
        }));

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const blob = file.slice(start, end);

            const formData = new FormData();
            formData.append('zipChunk', blob, file.name);
            formData.append('userId', String(userId));
            formData.append('eventUuid', eventUuid!);
            formData.append('isLastChunk', chunkIndex === totalChunks - 1 ? "true" : "false");

            try {
                const response = await fetch('https://additional.klout.club/api/v1/faces/uploadChunk', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.completedStep) {
                    completedStep = result.completedStep;
                }
                console.log(`Chunk ${chunkIndex + 1} of ${totalChunks} uploaded. Server response: `, result);

                // Calculate and update the progress for the file
                const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                setUploadProgress(prevProgress => ({
                    ...prevProgress,
                    [fileName]: progress
                }));
            } catch (error) {
                console.error(`Error uploading chunk ${chunkIndex + 1}:`, error);
                break;
            }
        }

        if (completedStep) {
            Swal.fire({
                title: "File Uploaded Successfully",
                icon: "success",
                text: "Your images are processing"
            }).then(() => {
                completedStep = 0;
                setUploadProgress({});
            })
        }
        else {
            Swal.fire({
                title: "Network Error.",
                icon: "error",
                text: "There was some network issues, Please check your internet and try again."
            }).then(() => {
                completedStep = 0;
                setUploadProgress({});
            })
        }
    };

    useEffect(() => {
        axios.post(`https://additional.klout.club/api/v1/faces/all-photos`, { eventUuid, userId }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.data.status) {

                const allPhotos = res.data.data.map((item: any) => item.imageUrl);
                setPhotos(allPhotos);
                console.log("All Photos are: ", allPhotos);
            }
        });
    }, [active]);

    const handleDownload = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/get-event-attendee-numbers`,
                {
                    event_uuid: uuid,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob', // Important to handle the file as a blob
                }
            );

            // Create a URL for the response data (which is the zip file)
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'profile_images.zip'); // Filename for the downloaded file
            document.body.appendChild(link);
            link.click();

            // Clean up the URL object after download is triggered
            window.URL.revokeObjectURL(url);

            setLoading(false);
        } catch (err) {
            console.error('Error downloading file:', err);
            setError('An error occurred while downloading the file');
            setLoading(false);
        }
    };

    const getAttendeeProfileImage = async () => {
        console.log("Working");

        handleDownload();
    }

    useEffect(() => {
        console.log("The all photos are: ", photos)
        axios.post(`https://additional.klout.club/api/v1/faces/check`, { eventUuid, userId }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.data.status) {
                if (res.data.data.completedStep === 2) {
                    setImagesAlreadyUploaded(true);
                    setProcessing(false);
                }

                if (res.data.data.completedStep === 1) {
                    setImagesAlreadyUploaded(true);
                    setProcessing(true);
                }

                if (res.data.data) {
                    setImagesAlreadyUploaded(false);
                }
            }
        })
    }, [completedStep, active]);


    return (
        <div className="h-full w-full">
            {/* Heading */}
            <div className="mb-4 flex justify-between items-center">
                <HeadingH2 title={currentEvent?.title} />
                <div className='flex items-center gap-3'>
                    <Link to="/all-photos/" onClick={() => dispatch(heading("All Photos"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <div className="mx-auto w-full grid place-content-center mt-10">
                <div className="flex justify-between">
                    <div>
                        <button onClick={() => { setActive(1); setFiles(false); }} className={`btn ${active === 1 ? "bg-white" : ""} btn-sm rounded-b-none`}>Upload Files</button>
                        <button onClick={() => { setActive(2); setFiles(false); }} className={`btn ${active === 2 ? "bg-white" : ""} btn-sm rounded-b-none`}>Photos</button>
                    </div>
                    {showButton && <button onClick={getAttendeeProfileImage} className="btn btn-sm rounded-b-none btn-accent text-white w-fit">Get Attendee Image Zip</button>}
                </div>

                <div className="max-w-3xl min-w-[48rem] relative p-10 bg-white rounded-b-md shadow-md">
                    {active === 1 &&

                        <div>
                            {!processing ?
                                <form className="flex flex-col gap-5">

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

                                    <button type="submit" disabled={isSubmitting} onClick={handleZipUpload} className="px-4 py-2 rounded-md bg-klt_primary-500 text-white mx-auto w-fit">
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

                                    <div>
                                        {Object.entries(uploadProgress).map(([fileName, percentage]) => (
                                            <div key={fileName} className="progress-container">
                                                <span>{fileName} - {percentage}%</span>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                </form> :
                                <p className="text-center">Your images are processing</p>
                            }

                        </div>
                    }

                    {
                        active === 2 && <div>
                            {processing && <p className="text-center">Your images are processing</p>}
                            {(photos.length === 0 && !processing) && <p className="text-center">You need to upload the images!</p>}
                            {/* {photos.map(photo => (
                                <img key={photo.imgageUrl} src={`${photoBucketUrl}/${photo}`} alt="photo" width={50} height={50} />
                            ))} */}

                            {photos.length !== 0 && <div className='w-full'>
                                {/* Wrap LightGallery inside a div with a custom className */}
                                <div className="mt-3 h-full gap-5 w-full">
                                    <LightGallery>
                                        {currentImages.map((item, index) => {
                                            return (
                                                <a key={index} data-src={`${photoBucketUrl}/${item}`} data-lg-size="1600-1200" className='inline-block'>
                                                    <img
                                                        src={`${photoBucketUrl}/${item}`}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-52 h-40 m-2 object-cover"
                                                    />
                                                </a>
                                                // <div data-src={item.url} key={index} className='flex'>
                                                //     {/* Set data-src instead of href */}
                                                // </div>
                                            );
                                        })}
                                    </LightGallery>

                                </div>

                                {/* Pagination Controls */}
                                {photos.length !== 0 && <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                    >
                                        Previous
                                    </button>
                                    <span className="self-center text-lg">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                    >
                                        Next
                                    </button>
                                </div>}
                            </div>}
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default Photos;