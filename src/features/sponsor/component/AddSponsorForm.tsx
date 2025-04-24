import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { Link, useParams } from 'react-router-dom';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { heading } from '../../../features/heading/headingSlice';
import { fetchEvents } from '../../../features/event/eventSlice';
import Loader from '../../../component/Loader';

export default function AddSponsorForm() {
    const { uuid } = useParams(); // Changed from eventId to uuid to match route parameter
    const dispatch = useAppDispatch();
    const [selectedCompany, setSelectedCompany] = useState('');
    const [customCompany, setCustomCompany] = useState('');
    const [websiteLink, setWebsiteLink] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const { events, loading } = useSelector((state: RootState) => state.events);
    const { token } = useSelector((state: RootState) => state.auth);
    const currentEvent = events.find(event => event.uuid === uuid);

    // Fetch events if they're not already loaded
    useEffect(() => {
        if (events.length === 0) {
            dispatch(fetchEvents(token));
        }
    }, [dispatch, events.length, token]);

    // Debug information
    console.log("UUID from params:", uuid);
    console.log("Events:", events);
    console.log("Current event:", currentEvent);

    const companies = ['Google', 'Amazon', 'Flipkart'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const companyName = showCustomInput ? customCompany : selectedCompany;
        console.log({
            uuid,
            company: companyName,
            websiteLink
        });
        // Add your submission logic here
        resetForm();
    };

    const resetForm = () => {
        setSelectedCompany('');
        setCustomCompany('');
        setWebsiteLink('');
        setShowCustomInput(false);
    };

    // Show loader while fetching events
    if (loading) {
        return <Loader />;
    }

    // If event not found but we have events, show error message
    if (!currentEvent && events.length > 0) {
        return (
            <div className="px-6 py-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">Event not found</h2>
                        <Link
                            to="#"
                            onClick={() => {
                                window.history.back();
                                dispatch(heading("All Sponsors"));
                            }}
                            className="btn btn-error text-white btn-sm"
                        >
                            <IoMdArrowRoundBack size={20} /> Go Back
                        </Link>
                    </div>
                    <p>The event you're looking for could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-4">
            <div className="max-w-2xl mx-auto">
                {/* Heading and Go Back Button */}
                <div className="flex justify-between items-center mb-6">
                    <HeadingH2 title={currentEvent?.title || 'Loading event...'} />
                    <Link
                        to="#"
                        onClick={() => {
                            window.history.back(); // Go back to the previous page
                            dispatch(heading("All Sponsors")); // Update the heading when going back
                        }}
                        className="btn btn-error text-white btn-sm"
                    >
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Company
                            </label>
                            {!showCustomInput ? (
                                <select
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required={!showCustomInput}
                                >
                                    <option value="">Select a company</option>
                                    {companies.map((company) => (
                                        <option key={company} value={company}>
                                            {company}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={customCompany}
                                    onChange={(e) => setCustomCompany(e.target.value)}
                                    placeholder="Enter company name"
                                    className="w-full p-2 border rounded-md"
                                    required={showCustomInput}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(!showCustomInput)}
                                className="text-blue-600 text-sm mt-1"
                            >
                                {showCustomInput ? 'Select from list' : 'Add custom company'}
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website Link
                            </label>
                            <input
                                type="url"
                                value={websiteLink}
                                onChange={(e) => setWebsiteLink(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add Sponsor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}