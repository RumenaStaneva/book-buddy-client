import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Button from "../components/Button";
import AddScreenTimeModal from "../components/AddScreenTimeModal";
import ReadingTimeTable from "../components/ReadingTimeTable";
import '../styles/TimeSwapInformationPage.css'

const TimeSwapInformationPage = () => {
    const [isOpenAddScreenTime, setIsOpenAddScreenTime] = useState(false);
    const [hasAlreadyAddedScreenTime, setHasAlreadyAddedScreenTime] = useState(false);
    const [readingTimeData, setReadingTimeData] = useState();
    const { user } = useAuthContext();
    const handleAddScreenTime = () => {
        setIsOpenAddScreenTime(true);
    }

    const checkScreenTimeData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.readingTimePerDay.length > 0) {
                    setReadingTimeData(data.readingTimePerDay);
                    setHasAlreadyAddedScreenTime(true);
                }
            } else {
                setHasAlreadyAddedScreenTime(false);
                throw new Error('Error checking screen time data existence');
            }
        } catch (error) {
            setHasAlreadyAddedScreenTime(false);
            console.error('Error:', error);
        }
    }, [user.token]);
    useEffect(() => {

        checkScreenTimeData();
    }, [user.token, checkScreenTimeData]);
    return <>
        {isOpenAddScreenTime && <AddScreenTimeModal setIsOpen={setIsOpenAddScreenTime} checkScreenTimeData={checkScreenTimeData} />}
        {hasAlreadyAddedScreenTime ?
            <ReadingTimeTable readingTimeData={readingTimeData} /> :
            <>
                <div className="info-container">
                    <h1 className="title">Time swap</h1>
                    <h2 className="subtitle">What is Time swap?</h2>
                    <p className="paragraph">In a world dominated by smartphones and digital distractions, it's no secret that we often find ourselves spending far too much time glued to our screens. At Time Swap, we believe in the transformative power of reading and its ability to transport us to captivating worlds and enrich our minds. Let us take you on a journey to rediscover the joy of reading, strike a balance with technology, and reignite your passion for books.</p>
                    <h2 className="subtitle">My Personal Story: A Journey from Bookworm to Screen-bound</h2>
                    <p className="paragraph">Like many others, I too fell into the trap of excessive screen time as technology became an integral part of our lives. As a child, I was an avid reader, devouring two books a day at the young age of eight. Books were my magical escape, and each page turned opened doors to new adventures and knowledge.
                        However, as the allure of smartphones and digital gadgets grew, my reading habit gradually faded into the background. The countless hours I once spent immersed in books were now spent scrolling through social media feeds, binge-watching shows, and constantly seeking digital stimulation. Before I knew it, my treasured books started gathering dust, and the joy of reading seemed like a distant memory.
                        Rediscovering the Love for Reading: Introducing Time Swap
                        Time Swap was born out of the realization that I, like many others, needed to rekindle my love for reading and reclaim the balance between screen time and quality reading moments. It's a heartfelt mission to help you break free from the endless digital loop and embrace the magic of books once again.</p>
                    <h2 className="subtitle">How Time Swap Works: Your Journey to Book Bliss</h2>
                    <ol className="ordered-list">
                        <li>Assess Your Screen Time: Start by manually entering your screen time for the previous week. Don't worry; we keep this data private and only use it to help you set personalized reading goals.</li>
                        <li>Set Your Daily Reading Goal: Based on your screen time, Time Swap calculates a daily reading goal for the current week. Our aim is to encourage you to read as much as you've been spending on screens. However, remember that Time Swap offers flexibility; you're not obligated to read the hours in one go. You can read during the whole day, starting and stopping the timer whenever convenient.</li>
                        <li>Track Your Book Progress: The progress bar on this page represents your journey through the book you're currently reading. With each reading session, you'll see the bar fill up, showing your advancement through the captivating pages.
                        </li>
                        <li>Read Weekly Average: If a daily reading goal feels too ambitious, don't fret! Time Swap allows you to read your weekly average instead, ensuring a comfortable reading experience without pressure. Flexibility is key in nurturing a love for books.
                        </li>
                    </ol>

                    <h2 className="subtitle">Reclaim the Joy of Reading with Time Swap</h2>
                    <p className="paragraph">At Time Swap, we are committed to helping you discover the magic of books anew, fostering healthier habits, and achieving a perfect balance between screen time and reading time. Let's embark on this journey together, where the written word reigns supreme, and the allure of digital distractions fades away. Get ready to swap your time and gain endless worlds of imagination and knowledge. Happy reading!</p>

                    <Button className="cta-btn" onClick={handleAddScreenTime}>Add your screen time and start your reading journey</Button>
                </div>
            </>
        }
    </>
}
export default TimeSwapInformationPage;