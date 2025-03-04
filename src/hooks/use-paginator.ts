import { useState, useMemo } from "react";

interface UsePaginatorProps<T> {
    data: T[];
    itemsPerPage: number;
}

const usePaginator = <T>({ data, itemsPerPage }: UsePaginatorProps<T>) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo<T[]>(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const goToNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return {
        paginatedData,
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        goToPage,
    };
};

export default usePaginator;
