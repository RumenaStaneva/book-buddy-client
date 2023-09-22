import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar";
import Spinner from 'react-spinner-material';
import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import '../styles/VerificationSuccess.css'


function VerificationSuccess() {
    const { token } = useParams();
    const [verificationResult, setVerificationResult] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    //todo figure out why it rerenders twice
    const fetchData = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/verify/${token}`);
                if (!response.ok) {
                    throw new Error(`Fetch request failed with status ${response.status}`);
                }
                const data = await response.json();
                setVerificationResult(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setVerificationResult(error);
                setIsLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, fetchData]);




    return (
        <>
            <NavBar />
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : null}
            {!verificationResult.error ?
                (
                    <main>
                        <div className="verification-success__container">
                            <h2 className="verification-success__title">Email Verification Successful!</h2>
                            <AiOutlineCheckCircle className="verification-success__icon" />
                            <p className="verification-success__message">Your email has been successfully verified.</p>

                            <div className="d-flex">
                                <a className="cta-btn" href="/users/login">Click here to login</a>
                            </div>
                        </div>
                    </main>
                )
                : (
                    <main className="verification-success__error">
                        <h2>Email Verification Failed</h2>
                        <AiOutlineCloseCircle className="verification-error__icon" />
                        <p className="verification-error__message">
                            Something went wrong. Please contact our support team.
                        </p>
                        <p className="verification-error__contact">
                            Contact Support:{" "}
                            <a href="mailto:bookbuddy.library1@gmail.com">bookbuddy.library1@gmail.com</a>
                        </p>
                    </main>
                )}
        </>
    );
}

export default VerificationSuccess;
