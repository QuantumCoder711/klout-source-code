import React from 'react';

type headingProps = {
    title: string | undefined;
    className?: string;
}

const HeadingH2: React.FC<headingProps> = ({ title, className }) => {
    return <h2 className={`text-3xl font-semibold text-black ${className}`}>{title}</h2>
}

export default HeadingH2