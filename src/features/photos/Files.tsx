import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from '../../component/Loader';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';

interface FileProps {
    id: string;
    uuid?: string;
    setFiles: Function;
}

interface Response {
    name: string;
    url: string;
    path: string;
}

const Files: React.FC<FileProps> = (props) => {
    const [data, setData] = useState<Response[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const imagesPerPage = 6;

    useEffect(() => {
        console.log(props.uuid, props.id);
        setLoading(true);
        axios.post("https://app.klout.club/api/organiser/v1/event-checkin/get-event-photos",
            {
                "eventUUID": props.uuid,
                "userID": props.id
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                setData(res.data.files);
                console.log(res);
                setLoading(false);
            })
    }, [props]);

    // Calculate the index of the first and last image on the current page
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = data.slice(indexOfFirstImage, indexOfLastImage);

    const totalPages = Math.ceil(data.length / imagesPerPage);

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

    if (loading) {
        return <Loader />
    }

    return (
        <div className='w-full'>
            <IoMdArrowRoundBack onClick={() => props.setFiles(false)} className='bg-klt_primary-200 text-white cursor-pointer absolute size-8 p-2 rounded-full top-3 right-3' />

            {/* Wrap LightGallery inside a div with a custom className */}
            <div className="mt-3 h-full gap-5 w-full">
                <LightGallery>
                    {currentImages.map((item, index) => {
                        console.log("Image URL:", item.url); // Log each image URL
                        return (
                            <a key={index} data-src={item.url} data-lg-size="1600-1200" className='inline-block'>
                                <img
                                    src={item.url}
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
            <div className="flex justify-between mt-4">
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
            </div>
        </div>
    )
}

export default Files;
