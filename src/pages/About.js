import { useEffect } from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import '../styles/About.css'

function About() {
    useEffect(() => {
        document.title = 'About';
    }, []);

    return <>
        <NavBar />
        <Header title="About" />
        <main className="info-container">
            <div className="about__section d-flex">
                <div className="about-section__text">
                    <h2 className="subtitle">What is Time swap?</h2>
                    <p className="paragraph">In a world dominated by smartphones and digital distractions, it's no secret that we often find ourselves spending far too much time glued to our screens. At Time Swap, we believe in the transformative power of reading and its ability to transport us to captivating worlds and enrich our minds. Let us take you on a journey to rediscover the joy of reading, strike a balance with technology, and reignite your passion for books.</p>
                </div>
                <img src="https://storage.googleapis.com/book-buddy/images/asset-1.png" alt="" />
            </div>
            <div className="about__section d-flex">
                <img src="https://storage.googleapis.com/book-buddy/images/asset-2.png" alt="" />
                <div className="about-section__text">
                    <h2 className="subtitle">My Personal Story: A Journey from Bookworm to Screen-bound</h2>
                    <p className="paragraph">Like many others, I too fell into the trap of excessive screen time as technology became an integral part of our lives. As a child, I was an avid reader, devouring two books a day at the young age of eight. Books were my magical escape, and each page turned opened doors to new adventures and knowledge.
                        However, as the allure of smartphones and digital gadgets grew, my reading habit gradually faded into the background. The countless hours I once spent immersed in books were now spent scrolling through social media feeds, binge-watching shows, and constantly seeking digital stimulation. Before I knew it, my treasured books started gathering dust, and the joy of reading seemed like a distant memory.
                        Rediscovering the Love for Reading: Introducing Time Swap
                        Time Swap was born out of the realization that I, like many others, needed to rekindle my love for reading and reclaim the balance between screen time and quality reading moments. It's a heartfelt mission to help you break free from the endless digital loop and embrace the magic of books once again.</p>
                </div>

            </div>
            <div className="about__section">
                <div className="about-section__text">
                    <h2 className="subtitle">How Time Swap Works: Your Journey to Book Bliss</h2>
                    <div className="about-subsection d-flex">
                        <ul className="list">
                            <li>
                                <b>Assess Your Screen Time: </b>
                                Start by manually entering your screen time for the previous week. Don't worry; we keep this data private and only use it to help you set personalized reading goals.
                            </li>
                            <li>
                                <b>Set Your Daily Reading Goal: </b>
                                Based on your screen time, Time Swap calculates a daily reading goal for the current week. Our aim is to encourage you to read as much as you've been spending on screens. However, remember that Time Swap offers flexibility; you're not obligated to read the hours in one go. You can read during the whole day, starting and stopping the timer whenever convenient.
                            </li>
                            <li>
                                <b>Track Your Book Progress: </b>
                                The progress bar on this page represents your journey through the book you're currently reading. With each reading session, you'll see the bar fill up, showing your advancement through the captivating pages.
                            </li>
                            <li>
                                <b>Customize Your Reading Goal: </b>
                                If a daily reading goal feels too ambitious, don't fret! You can now change your reading goal to a weekly average or set a custom reading time that suits your schedule. Flexibility is key in nurturing a love for books.
                            </li>
                        </ul>
                        <img src="https://storage.googleapis.com/book-buddy/images/asset-3.png" alt="" />
                    </div>
                    <div className="about-subsection d-flex">
                        <img src="https://storage.googleapis.com/book-buddy/images/asset-5.png" alt="" />

                        <ul className="list">
                            <li>
                                <b>Post-Timer Update: </b>
                                When the timer stops, a popup will appear, prompting you to update your progress on the current book. This way, you can easily keep track of your accomplishments.
                            </li>
                            <li>
                                <b>Extended Reading Sessions: </b>
                                After the settled screen time for reading passes, you can continue reading. The countdown becomes a timer, and the time spent reading will be added to and displayed on the diagram in your profile. This ensures you can seamlessly transition from focused reading sessions to leisurely reading without losing your progress.
                            </li>
                            <li>
                                <b>Visualize Your Progress: </b>
                                In the profile section, a graphical representation will display statistics showing your reading time, screen time, and your goal for each day of the chosen week—be it the current week, last week, or any specific period you prefer. This visualization provides a clear overview of your reading habits and achievements, helping you stay motivated on your reading journey.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <div className="about__section d-flex">
                <img src="https://storage.googleapis.com/book-buddy/images/asset-4.png" alt="" width={300} />
                <div className="about-section__text">
                    <h2 className="subtitle">Reclaim the Joy of Reading with Time Swap</h2>
                    <p className="paragraph">At Time Swap, we are committed to helping you discover the magic of books anew, fostering healthier habits, and achieving a perfect balance between screen time and reading time. Let's embark on this journey together, where the written word reigns supreme, and the allure of digital distractions fades away. Get ready to swap your time and gain endless worlds of imagination and knowledge. Happy reading! 📚✨</p>
                </div>
            </div>

        </main>
    </>
}

export default About;