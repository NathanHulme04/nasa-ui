import { BannerContainer } from './Banner.styled';
import { BannerProps } from './BannerPropsInterface';

const Banner = ({nasaApod}: BannerProps) => {
    return (<BannerContainer>
        <section className="banner">
        <h1>{ nasaApod?.title }</h1>
        <p>Explore a vast collection of stunning images from space, curated by NASA.</p>
        <picture>
            <img src={nasaApod?.url} />
        </picture>
    </section>
    </BannerContainer>);
};

export default Banner;