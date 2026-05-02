import react, {useState} from 'react';
import { nasaApod } from '../../../types';
import ApodCard from './ApodCard';
import styled from 'styled-components';
import staticData from '../../Data/response-16-06-95-02-05-26.json';
const typedStaticData = staticData as nasaApod[];

type ApodCardSectionProps = {
    nasaApodResponse: nasaApod[] | null;
}

const ApodCardWrapperGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(33rem, 1fr));
    gap: 16px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const StyledSearchInput = styled.input`
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
`;

const ApodCardSection = ( ) => {
    const firstPageOfApods = typedStaticData.slice(0, 50);
    const [apod, setApod] = useState<nasaApod[] | null>(firstPageOfApods);
    
    const [searchString, setSearchString] = useState<string>('');

    const PAGE_LIMIT = 50;
    const [currentPage, setCurrentPage] = useState<number>(1);

    // New state: stores the full current list (filtered or sorted)
    // This allows pagination to slice from the complete set
    const [fullApods, setFullApods] = useState<nasaApod[]>(typedStaticData);

    const searchApods = (e: React.ChangeEvent<HTMLInputElement>) => {
        handlePageChange(1)();
        
        let listOfApods = typedStaticData;
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm && searchTerm.length > 0) {
            const filteredApods = listOfApods?.filter( (anApod : nasaApod) => {
                if( anApod.title.toLowerCase().includes(searchTerm) || anApod.explanation.toLowerCase().includes(searchTerm) || anApod.date.includes(searchTerm) ) {
                    return true;
                } 
                return false;
            } );
            listOfApods = filteredApods as nasaApod[];
        }
        
        // Update full list and set displayed page to first 50
        setFullApods(listOfApods);
        setApod(listOfApods.slice(0, PAGE_LIMIT));
        setSearchString(searchTerm);
    }

    const sortApods = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortBy = e.target.value;
        let sortedApods = [...fullApods]; // Sort the full current list

        if (sortBy === 'dateAsc') {
            sortedApods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === 'dateDesc') {
            sortedApods.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        // Update full list and reset to first page
        setFullApods(sortedApods);
        setApod(sortedApods.slice(0, PAGE_LIMIT));
    }

    const renderPaginationControls = (currentPage: number) => {
        // Use fullApods.length for accurate total pages (accounts for search filtering)
        const totalPages = Math.ceil(fullApods.length / PAGE_LIMIT);
        const pageWindow = 5;
        const halfWindow = Math.floor(pageWindow / 2);

        let startPage = Math.max(1, currentPage - halfWindow);
        let endPage = Math.min(totalPages, currentPage + halfWindow);

        if (endPage - startPage + 1 < pageWindow) {
            startPage = Math.max(1, endPage - pageWindow + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNum = startPage + i;
            return (
            <button
                key={pageNum}
                className={`apod-pagination apod-pagination-${pageNum}` + ' ' + (pageNum === currentPage ? 'apod-pagination-button-active' : '')}
                onClick={handlePageChange(pageNum)}
            >
                {pageNum}
            </button>
            );
        });
    };

    const handlePageChange = (pageNum: number) => () => {
        // Slice from fullApods to get the correct page data
        const paginatedData = fullApods.slice((pageNum - 1) * PAGE_LIMIT, pageNum * PAGE_LIMIT);
        setApod(paginatedData);
        setCurrentPage(pageNum);
    };

    return (
        <section className='apod-card-section'>
            <div className='apod-card-section-header'>
                <StyledSearchInput type="search" placeholder='Search by date, title, or keywords...' onChange={searchApods} />
                <select onChange={sortApods} style={{marginLeft: '16px', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px'}}>
                    <option value="">Sort By</option>
                    <option value="dateAsc">Date - newest to oldest</option>
                    <option value="dateDesc" defaultChecked>Date - oldest to newest</option>
                </select>
            </div>
            <ApodCardWrapperGrid>
                {apod && apod.map((apod, index) => (
                    <ApodCard nasaApod={apod} key={index} searchTerm={searchString} />
                ))}
            </ApodCardWrapperGrid>
            <div className='pagination-controls' style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                {renderPaginationControls(currentPage)}
            </div>
        </section>
    );
}

export default ApodCardSection;