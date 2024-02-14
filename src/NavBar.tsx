import { Navbar } from 'flowbite-react';

export const NavBar = ()=>{
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="https://flowbite-react.com">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Alpha Vantage</span>
            </Navbar.Brand>
            <Navbar.Toggle />

        </Navbar>

    )
}
