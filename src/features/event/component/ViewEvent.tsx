import React from 'react';
import HeadingH2 from '../../../component/HeadingH2';

const ViewEvent: React.FC = () => {
    const event = {
        title: 'Tech Conference 2024',
        description: 'Join us for an engaging day filled with tech talks, networking, and workshops.Join us for an engaging day filled with tech talks, networking, and workshops.Join us for an engaging day filled with tech talks, networking, and workshops.',
        date: '25th September 2024',
        time: '10:00 AM - 4:00 PM',
        location: 'Noida Sector 68, Delhi, Ganja, Ganja, Azerbaijan, 874539',
        googleMapLink: 'https://www.google.com/maps', // Example Google Maps link
        bannerUrl: 'https://api.klout.club/uploads/events/1722167291.png', // Banner image
        qrCodeUrl: 'https://api.klout.club/uploads/qrcodes/ec273381-a15a-4d50-a04e-702a750971ed.png', // QR code image
    };

    return (
        <div className="p-6 pt-0">
            {/* Heading */}
            <div className="mb-4">
                <HeadingH2 title={event.title} />
            </div>
            

            {/* Banner and QR Code Section */}
            <div className="flex mb-6">
                <div className="w-7/10 pr-4" style={{ flex: '7' }}>
                    <img
                        src={event.bannerUrl}
                        alt="Event Banner"
                        className="w-full rounded-lg shadow-md object-cover"
                        style={{ height: '400px', minHeight: '300px', maxHeight: '450px', objectFit: "cover" }} // Adjusted for better appearance
                    />
                </div>
                <div className="w-3/10 flex flex-col justify-center items-center" style={{ flex: '3' }}>
                    <img
                        src={event.qrCodeUrl}
                        alt="QR Code"
                        className="w-full max-w-sm h-auto rounded-lg shadow-md mb-4"
                        style={{ maxWidth: '250px', height: 'auto' }}
                    />
                    {/* Download Button */}
                    <a
                        href={event.qrCodeUrl} // You can provide an actual download link here
                        download
                        className="bg-klt_primary-900 text-white px-4 py-2 rounded shadow hover:bg-klt_primary-500 transition-colors"
                    >
                        Download
                    </a>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-900 text-xl font-semibold">Description</h3>
                <p className="text-gray-700 mb-2">{event.description}</p>
                
                {/* Date and Time */}
                <h3 className="text-gray-900 text-xl font-semibold">Date</h3>
                <p className="text-gray-700 mb-2">
                {event.date}
                </p>

                <h3 className="text-gray-900 text-xl font-semibold">Time</h3>
                <p className="text-gray-700 mb-4">
                    {event.time}
                </p>

                {/* Location */}
                <h3 className="text-gray-900 text-xl font-semibold">Location</h3>
                <p className="text-gray-700 mb-2">
                    {event.location}
                </p>

                {/* Google Map Link */}
                <h3 className="text-gray-900 text-xl font-semibold">Google Map</h3>
                <p className="text-gray-700">
                    
                    <a
                        href={event.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        View Location on Google Maps
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ViewEvent;
