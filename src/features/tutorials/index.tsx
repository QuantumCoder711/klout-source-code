import React from 'react';

const Tutorials: React.FC = () => {
    const tutorialVideos = [
        {
            title: 'Introduction to Klout Club',
            videoId: 'dW_593UpsmY'
        },
        {
            title: 'AI Transcriber',
            videoId: 'uB7VK8coLHI'
        },
        {
            title: 'Badge Printing',
            videoId: 'PatChSjjXK4'
        },
        {
            title: 'Update Agenda',
            videoId: 'nMXWcWL9vWo'
        },
        {
            title: 'Adding an Attendee',
            videoId: '2FfMZf65CIs'
        },
        {
            title: 'Event Creation',
            videoId: '9DyX4Z_WtiM'
        }
    ];

    return (
        <div className="w-full mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-klt_primary-600 mb-8 border-b pb-4">Tutorial Videos</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tutorialVideos.map((video, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-5 bg-gradient-to-r from-klt_primary-500 to-klt_primary-600">
                            <h2 className="text-xl font-bold text-white">{video.title}</h2>
                        </div>
                        <div className="aspect-video border-2 border-klt_primary-100 p-1">
                            <iframe 
                                src={`https://www.youtube.com/embed/${video.videoId}`} 
                                title={`${video.title} - YouTube video player`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                className="w-full h-full rounded-lg" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tutorials;
