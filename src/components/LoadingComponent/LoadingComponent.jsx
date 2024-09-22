import React from 'react';
import { PropagateLoader } from "react-spinners";

const LoadingComponent = ({ colour, size, isLoading }) => {
    return (
        <>
            <section className='loading-component-container'>
                <PropagateLoader color={colour} size={size} loading={isLoading}/>
            </section>
        </>
    );
}

export default LoadingComponent;