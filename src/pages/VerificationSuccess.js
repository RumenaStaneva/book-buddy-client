import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar";
import '../styles/VerificationSuccess.css'

function VerificationSuccess() {
    const { token } = useParams();
    console.log(token);
    const [verificationResult, setVerificationResult] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('fetchhh');
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/verify/${token}`);
                if (!response.ok) {
                    throw new Error(`Fetch request failed with status ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setVerificationResult(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (verificationResult.error) {
        return (
            <>
                <NavBar />
                <main className="verification-success__error">
                    <h2>Email Verification Failed</h2>
                    <p>{verificationResult.error}</p>
                </main>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <main>
                <div className="verification-success__container">
                    <h2 className="verification-success__title">Email Verification Successful!</h2>
                    <p className="verification-success__message">{verificationResult.message}</p>
                    {/* <p className="verification-success__user-id">User ID: {verificationResult.user._id}</p> */}
                </div>
            </main>
        </>
    );
}

export default VerificationSuccess;
