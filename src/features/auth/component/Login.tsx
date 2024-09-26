import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'; // Use the custom hook
import { login } from '../authSlice';
import { RootState, useAppDispatch } from '../../../redux/store'; // Your Redux store type
import { Navigate } from 'react-router-dom';
import signinBanner from '../../../assets/images/signinbanner.webp';
import typingEffect from '../../../utils/typingEffect';
import HeadingH2 from '../../../component/HeadingH2';

type LoginFormInputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token, loading, error } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const textToType = "Step into the Future of Event Management with Klout Club – Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    const onSubmit = async (data: LoginFormInputs) => {
        dispatch(login(data));
    };

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen">
            {/* Left side with image */}
            <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

                {/* Text */}
                <h1 className="text-white text-5xl font-normal relative z-10 p-20">
                    {displayedText}
                </h1>
            </div>

            {/* Right side with form */}
            <div className="w-1/3 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-4">
                    <div className='flex justify-center'>
                        <HeadingH2 title='Login' />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
