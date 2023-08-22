import { useEffect } from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";

function About() {
    useEffect(() => {
        document.title = 'About';
    }, []);

    return <>
        <NavBar />
        <Header title="About" />
        <div>I just want a job</div>
    </>
}

export default About;