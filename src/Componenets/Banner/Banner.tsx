import logo from './../../logo.svg';

function Banner() {
    return <section className="banner">
        <h1>Welcome to the NASA Image Gallery</h1>
        <p>Explore a vast collection of stunning images from space, curated by NASA.</p>
        <picture>
            <img src={logo} className="App-logo" alt="logo" />
        </picture>
    </section>;
}

export default Banner;