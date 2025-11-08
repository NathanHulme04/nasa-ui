import logo from './../../logo.svg';
import { BannerContainer } from './Banner.styled';
import { BannerProps } from './BannerPropsInterface';

const Banner: React.FC<BannerProps> = ({ NasaApod }) => {
    return <BannerContainer>
        <section className="banner">
        <h1>{ NasaApod?.title }</h1>
        <p>Explore a vast collection of stunning images from space, curated by NASA.</p>
        <picture>
            <img src={NasaApod?.url || logo} className="App-logo" alt="logo" />
        </picture>
    </section>;
    </BannerContainer>
};

export default Banner;