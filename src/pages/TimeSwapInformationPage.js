import Button from "../components/Button";
import '../styles/TimeSwapInformationPage.css';
import Header from "../components/Header";

const TimeSwapInformationPage = ({ setIsOpenAddScreenTime }) => {
    const handleAddScreenTime = () => {
        setIsOpenAddScreenTime(true);
        document.body.style.overflow = 'hidden';
    }

    return <>
        <Header title="Time swap" />

        <main className="time-swap-info">
            <div className="info-container">
                <div className="about__section d-flex">
                    <div className="about-section__text">
                        <p className="paragraph">Time Swap helps you balance screen time by encouraging daily reading. Set your reading goals based on your screen time and track your progress.</p>
                    </div>
                    <img src="https://storage.googleapis.com/book-buddy/images/asset-6.png" alt="" />

                </div>

                <div className="about__section d-flex">
                    <img src="https://storage.googleapis.com/book-buddy/images/asset-7.png" alt="" />
                    <div className="about-section__text">
                        <h2 className="subtitle">How to Use Time Swap:</h2>
                        <dl className="list">
                            <dd>Enter your previous week's screen time.</dd>
                            <dd>Time Swap calculates your daily reading goal to match screen time.</dd>
                            <dd>Read at your own pace, starting and stopping as needed.</dd>
                            <dd>After the set screen time for reading, continue reading with the timer adding to your progress. You can update your progress via a modal.</dd>
                            <dd>Change your reading goal to weekly average or a custom time as per your preference.</dd>
                            <dd>View detailed statistics in your profile, including reading time, screen time, and goals for each selected week.</dd>
                        </dl>
                    </div>
                </div>

                <Button className="cta-btn" onClick={handleAddScreenTime}>Add screen time</Button>
            </div>
        </main>

    </>
}
export default TimeSwapInformationPage;