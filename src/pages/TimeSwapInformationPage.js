import Button from "../components/Button";
import '../styles/TimeSwapInformationPage.css'

const TimeSwapInformationPage = ({ setIsOpenAddScreenTime }) => {
    const handleAddScreenTime = () => {
        setIsOpenAddScreenTime(true);
    }

    return <>

        <main>
            <div class="info-container">
                <h1 class="title">Time Swap</h1>

                <h2 class="subtitle">What is Time Swap?</h2>
                <p class="paragraph">Time Swap helps you balance screen time by encouraging daily reading. Set your reading goals based on your screen time and track your progress.</p>

                <h2 class="subtitle">How to Use Time Swap:</h2>
                <ol class="ordered-list">
                    <li>Enter your previous week's screen time.</li>
                    <li>Time Swap calculates your daily reading goal to match screen time.</li>
                    <li>Read at your own pace, starting and stopping as needed.</li>
                    <li>After the set screen time for reading, continue reading with the timer adding to your progress. You can update your progress via a modal.</li>
                    <li>Change your reading goal to weekly average or a custom time as per your preference.</li>
                    <li>View detailed statistics in your profile, including reading time, screen time, and goals for each selected week.</li>
                </ol>
            </div>
        </main>

    </>
}
export default TimeSwapInformationPage;