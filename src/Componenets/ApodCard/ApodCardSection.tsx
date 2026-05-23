import react, {useState, useEffect} from 'react';
import { nasaApod } from '../../../types';
import ApodCard from './ApodCard';
import styled from 'styled-components';

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

    const [apod, setApod] = useState<nasaApod[] | null>(null);
    
    const [searchString, setSearchString]   = useState<string>('');
    const [sortOption, setSortOption]       = useState<string>('date');
    const [sortOrder, setSortOrder]         = useState<string>('desc');
    const [currentPage, setCurrentPage]     = useState<number>(1);

    const url = process.env.APP_URL + "/search";
    
    const getItems = (search: string, sort: string, order: string, page: number) => {
        const searchParams = new URLSearchParams();
        if( search && search.length > 0 ) { 
            searchParams.append('searchString', search);
        }

        if( sort && sort.length > 0 ) {
            searchParams.append('sortBy', sort);
        }

        if( order && order.length > 0 ) {
            searchParams.append('sortOrder', order);
        }

        if( page && page > 0 ) {
            searchParams.append('page', page.toString());
        }

        searchParams.append('sortOption', sortOption);

        return fetch(url + '?' + searchParams.toString()).then((response) => response.json());
    }

    useEffect(() => {
        getItems(searchString, sortOption, sortOrder, currentPage)
            .then((response) => {
                setApod(response);
            })
            .catch((error) => {
                console.error('Error fetching APOD items:', error);
            });
    }, [searchString, sortOption, sortOrder, currentPage]);

    const searchApods = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        const searchTerm = e.target.value.toLowerCase();
        setSearchString(searchTerm);
    }

    const sortApods = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortBy = e.target.value;
        setSortOrder(sortBy);
    }

    // const renderPaginationControls = (currentPage: number) => {
    //     // Use fullApods.length for accurate total pages (accounts for search filtering)
    //     const totalPages = Math.ceil(fullApods.length / PAGE_LIMIT);
    //     const pageWindow = 5;
    //     const halfWindow = Math.floor(pageWindow / 2);

    //     let startPage = Math.max(1, currentPage - halfWindow);
    //     let endPage = Math.min(totalPages, currentPage + halfWindow);

    //     if (endPage - startPage + 1 < pageWindow) {
    //         startPage = Math.max(1, endPage - pageWindow + 1);
    //     }

    //     return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
    //         const pageNum = startPage + i;
    //         return (
    //         <button
    //             key={pageNum}
    //             className={`apod-pagination apod-pagination-${pageNum}` + ' ' + (pageNum === currentPage ? 'apod-pagination-button-active' : '')}
    //             onClick={handlePageChange(pageNum)}
    //         >
    //             {pageNum}
    //         </button>
    //         );
    //     });
    // };

    // const handlePageChange = (pageNum: number) => () => {
    //     // Slice from fullApods to get the correct page data
    //     const paginatedData = fullApods.slice((pageNum - 1) * PAGE_LIMIT, pageNum * PAGE_LIMIT);
    //     setApod(paginatedData);
    //     setCurrentPage(pageNum);
    // };

    return (
        <>
            <section className='intro-section'>
                <h1>Welcome to the NASA APOD Gallery</h1>
                <p>Explore the wonders of the universe with our NASA Astronomy Picture of the Day (APOD) gallery. Each day, we bring you a new image or video from NASA's APOD API, showcasing the beauty and mystery of space. From stunning nebulae to breathtaking galaxies, our gallery is your gateway to the cosmos. Dive into the explanations and discover the science behind each celestial masterpiece. Join us on this cosmic journey and experience the awe-inspiring wonders of our universe.</p>
                <p>Here you can search through the APOD collection by date, title, or keywords to find your favorite space imagery.</p>
                <p><i><b>This collection of images is relevant as of date: {apod && apod.length > 0 ? new Date(apod?.[0].date).toLocaleDateString() : ''}</b></i></p>
            </section>
            <section className='apod-card-section'>
                <div className='apod-card-section-header'>
                    <StyledSearchInput type="search" placeholder='Search by date, title, or keywords...' onChange={searchApods} />
                    <select style={{marginLeft: '16px', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px'}} onChange={sortApods}>
                        <option value="">Sort By</option>
                        <option value="desc">Date - newest to oldest</option>
                        <option value="asc" defaultChecked>Date - oldest to newest</option>
                    </select>
                </div>
                <ApodCardWrapperGrid>
                    {apod && apod.map((apod, index) => (
                        <ApodCard nasaApod={apod} key={index} searchTerm={searchString} />
                    ))}
                </ApodCardWrapperGrid>
                {/* <div className='pagination-controls' style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                    {renderPaginationControls(currentPage)}
                </div> */}
            </section>
        </>
    );
}

export default ApodCardSection;