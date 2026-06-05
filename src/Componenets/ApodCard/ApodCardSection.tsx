import react, {useState, useEffect} from 'react';
import { nasaApod } from '../../../types';
import ApodCard from './ApodCard';
import styled from 'styled-components';
import { DatePicker } from '@mantine/dates';
import icons8 from '../../assets/icons8-calendar-week-32.png';
import moonLoading from '../../assets/moon-loading.gif';
import Overlay from '../Overlay/Overlay';

//to do: add pagination controls, move search and sort controls to a separate component, add loading state, add error handling, add better styling, add tests. Add types for date picker value and change handler. Add debounce to search input.

const ApodCardWrapperGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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

export const StyledCalendarWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    position: relative;
    z-index: 1;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;

    & span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        min-width: max-content;
    }
`

export const DatePickerWrapper = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

const ApodCardSection = ( ) => {

    const [apod, setApod] = useState<nasaApod[] | null>(null);
    
    const [searchString, setSearchString]   = useState<string>('');
    const [sortOption, setSortOption]       = useState<string>('date');
    const [sortOrder, setSortOrder]         = useState<string>('desc');
    const [currentPage, setCurrentPage]     = useState<number>(1);

    //date picker
    const [datePickerValue, setValue] = useState<[string | null, string | null]>([null, null]);

    const [showDatePicker, setDatePickerVisibility] = useState<boolean>(false);

    //loading
    const [loading, setLoading] = useState<boolean>(false);

    const handleCalendarVisibility = (): void => {
        setDatePickerVisibility(!showDatePicker);
    }

    const handleCalendarChange = (datePickerValue: [string | null, string | null]) => {

        if( datePickerValue.length === 2 && datePickerValue[0] && datePickerValue[1] ) {
            setDatePickerVisibility(false);
        }
        setValue(datePickerValue);
    }

    const url = process.env.REACT_APP_API_URL + "/search";
    
    const getItems = (search: string, sort: string, order: string, page: number, datePickerValue: [string | null, string | null]) => {
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

        if( datePickerValue[0] && datePickerValue[1] ) {
            searchParams.append('startDate', datePickerValue[0]);
            searchParams.append('endDate', datePickerValue[1]);
        }

        searchParams.append('sortOption', sortOption);

        return fetch(url + '?' + searchParams.toString()).then((response) => response.json());
    }

    useEffect(() => {
        setLoading(true);
        getItems(searchString, sortOption, sortOrder, currentPage, datePickerValue)
            .then((response) => {
                setLoading(false);
                setApod(response);
            })
            .catch((error) => {
                console.error('Error fetching APOD items:', error);
                setLoading(false);
            });
    }, [searchString, sortOption, sortOrder, currentPage, datePickerValue[0], datePickerValue[1]]);

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

    const [overlayContent, setOverlayContent]       = useState<React.ReactNode>(null);
    const [isOverlayVisible, setIsOverlayVisible]   = useState<boolean>(false);

    const openOverlay = (content: React.ReactNode) => {
        setOverlayContent(content);
        setIsOverlayVisible(true);
    }
    const closeOverlay = () => {
        setIsOverlayVisible(false);
        setOverlayContent(null);
    }

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
                    <StyledSearchInput type="search" placeholder='Search by date, title, or keywords...' onChange={searchApods} id="search-input" alt="Search" />
                    <div style={{display:'flex', flexDirection:'row', gap:'16px', width: '100%'}}>
                        <StyledCalendarWrapper>
                            <span onClick={handleCalendarVisibility}>
                                <span>
                                    <img src={icons8} alt="Calendar" />
                                </span>
                                <span>
                                    {datePickerValue[0] && datePickerValue[1] ? `${datePickerValue[0]} to ${datePickerValue[1]}` : 'Select a date'}
                                    {datePickerValue[0] && datePickerValue[1] ? <span style={{marginLeft: '8px', cursor: 'pointer'}} onClick={(e) => {e.stopPropagation(); setDatePickerVisibility(false); setValue([null, null])}}>X</span> : ''}
                                </span>
                            </span>
                            <DatePickerWrapper style={{display: showDatePicker ? 'block' : 'none'}}>
                                <DatePicker type="range" value={datePickerValue} onChange={handleCalendarChange} maxDate={new Date().toISOString().split('T')[0]} />
                            </DatePickerWrapper>
                        </StyledCalendarWrapper>
                        <select style={{width: '100%', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px'}} onChange={sortApods} id="sort-select">
                            <option value="">Sort By</option>
                            <option value="desc">Date - newest to oldest</option>
                            <option value="asc" defaultChecked>Date - oldest to newest</option>
                        </select>
                    </div>
                </div>
                {
                    loading ? 
                    <img src={moonLoading} alt="Loading..." style={{display: 'block', margin: '32px auto', width: '100px', height: '100px'}} /> : 
                    <ApodCardWrapperGrid>
                        {apod && apod.map((apod, index) => (
                            <ApodCard nasaApod={apod} key={index} searchTerm={searchString} openOverlay={openOverlay} />
                        ))}
                    </ApodCardWrapperGrid>
                }
                {/* <div className='pagination-controls' style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                    {renderPaginationControls(currentPage)}
                </div> */}
            </section>
            <Overlay content={overlayContent} isVisible={isOverlayVisible} onClose={closeOverlay} />
        </>
    );
}

export default ApodCardSection;