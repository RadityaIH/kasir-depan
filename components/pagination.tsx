import React from "react";
import _ from "lodash"

interface PaginationProps {
  items: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
} 

export default function Pagination({items, pageSize, currentPage, onPageChange}: PaginationProps){
    const pageCount = Math.ceil(items / pageSize);
    if (pageCount === 1) return null;
    const pages = _.range(1, pageCount + 1);

    const handleBack = () => {
        if (currentPage === 1) return;
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage === pageCount) return;
        onPageChange(currentPage + 1);
    };

    return (
        (pageCount !== 0 &&  (

            <div className="flex items-center gap-8 justify-center my-5">
            <button disabled={currentPage === 1} onClick={handleBack}
                className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                    aria-hidden="true" className="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
                </svg>
                </span>
            </button>
            <p className="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                Page <strong className="text-gray-900">{currentPage}</strong> of
                <strong className="text-gray-900"> {pageCount}</strong>
            </p>
            <button disabled={currentPage === pageCount} onClick={handleNext}
                className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                    aria-hidden="true" className="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                </svg>
                </span>
            </button>
        </div>
    ))
    )
}