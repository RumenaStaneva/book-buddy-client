function SignUp() {

    return (
        <>
            <form action="/sign-up" method="POST">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" />
                <label htmlFor="username">Password</label>
                <input type="text" name="password" />
                <label htmlFor="username">Repeat Password</label>
                <input type="text" name="repeat-password" />
            </form>
        </>
    )
}

export default SignUp;