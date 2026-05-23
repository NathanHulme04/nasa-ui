import react from 'react';
import { nasaApod } from '../../../types';
import { ApodCardContainer } from './ApodCard.style';

type ApodCardProps = {
    nasaApod: nasaApod | null,
    searchTerm?: string
}

const ApodCard = ( { nasaApod, searchTerm } : ApodCardProps ) => {

    const highlightSearchTerms = (text: string, searchTerm: string) => {
        if( !searchTerm || searchTerm.length === 0 ) {
            return text;
        }
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (part.toLowerCase() === searchTerm.toLowerCase()) {
                return <mark key={index} style={{backgroundColor: 'lightblue', color: 'black'}}>{part}</mark>;
            }
            return part;
        });
    };
    return (
        <ApodCardContainer>
            <div className='apod-card' style={{position: 'relative'}}>
                <span style={{position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem'}}>
                    {nasaApod?.date}
                </span>
                {nasaApod?.media_type === 'image' && (
                    <img src={nasaApod.url} alt={nasaApod.title} style={{ width: '100%', height: '20rem', border: 'none', objectFit: 'cover' }} />
                )}
                {nasaApod?.media_type === 'video' && (nasaApod?.url.includes('youtube') || nasaApod?.url.includes('vimeo')) && (
                    <iframe 
                        title={nasaApod.title}
                        src={nasaApod.url}
                        allowFullScreen
                        style={{ width: '100%', height: '20rem', border: 'none', objectFit: 'cover' }}

                    />
                )}
                {nasaApod?.media_type === 'video' && !(nasaApod?.url.includes('youtube') || nasaApod?.url.includes('vimeo')) && (
                    <video controls style={{ width: '100%', height: '20rem', border: 'none', objectFit: 'cover' }} autoPlay muted loop>
                        <source src={nasaApod.url} type="video/mp4" />
                    </video>
                )}

                {searchTerm && searchTerm.length > 0 ? <h2>{highlightSearchTerms(nasaApod?.title || '', searchTerm)}</h2> : <h2>{nasaApod?.title}</h2>}                
                {searchTerm && searchTerm.length > 0 ? <p>{highlightSearchTerms(nasaApod?.explanation || '', searchTerm)}</p> : <p>{nasaApod?.explanation}</p>}
            </div>
        </ApodCardContainer>
    );
}

export default ApodCard;