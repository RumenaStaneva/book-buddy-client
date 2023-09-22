import NavBar from "../components/NavBar";

function VerificationEmailSent() {
  return (
    <>
      <NavBar />
      <main className="verification-email-sent-page login-signup-page">
        <div className="mask"></div>
        <div className="wrapper verification-email-sent__container">
          <h1>Email Verification</h1>
          <p className="verification-email-sent__message">
            We have sent a verification email to your address. Please check your
            inbox and follow the instructions to verify your email.
          </p>
        </div>
        <div className='wrapper'>
          <div className='image__container'>
            <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' width={570} height={487} />
          </div>
        </div>
      </main>
    </>
  );
}

export default VerificationEmailSent;
