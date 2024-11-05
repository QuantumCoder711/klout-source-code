import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Link } from 'react-router-dom';

interface ReportCardProps {
    id: number;
    image: string;
}

const ReportCard: React.FC<ReportCardProps> = (props) => {

    return (
        <div className="card bg-base-100 shadow-xl rounded-lg min-w-96">
            <figure>
                <img
                    src={props.image}
                    alt={"image"}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                />
            </figure>
            <div className="card-body p-3 bg-white flex flex-row items-center gap-2 rounded-bl-lg rounded-br-lg">
                {/* Whatsapp Button */}
                <Link to={`/all-reports/whatsapp-report/${props.id}`} className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-green-500 text-white text-xl grid place-content-center'>
                    <FaWhatsapp />
                </Link>

                {/* Mail Button */}
                <button className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-blue-500 text-white text-xl grid place-content-center'>
                    <FiMail />
                </button>
            </div>
        </div>
    )
}

export default ReportCard;