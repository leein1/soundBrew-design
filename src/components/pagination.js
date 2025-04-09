// src/components/Pagination.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Pagination = ({ responseDTO }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!responseDTO || responseDTO.total === 0) return null;

    const { page, size, total, start, end, prev, next } = responseDTO;
    const totalPages = Math.ceil(total / size);

    const handleClick = (selectedPage) => {
        const params = new URLSearchParams(location.search);
        params.set("page", selectedPage);

        navigate(`${location.pathname}?${params.toString()}`);
    };

    const renderPageLink = (i) => {
        const isActive = i === page;
        return isActive ? (
            <span key={i} className="page-link active" aria-disabled="true">
                {i}
            </span>
        ) : (
            <a
                key={i}
                className="page-link"
                onClick={() => handleClick(i)}
                role="button"
            >
                {i}
            </a>
        );
    };

    return (
        <div className="pagination">
            {prev && (
                <a className="page-link" onClick={() => handleClick(page - 1)} role="button">
                    &laquo;
                </a>
            )}

            {Array.from({ length: end - start + 1 }, (_, idx) => start + idx).map(renderPageLink)}

            {next && (
                <a className="page-link" onClick={() => handleClick(page + 1)} role="button">
                    &raquo;
                </a>
            )}
        </div>
    );
};

export default Pagination;
