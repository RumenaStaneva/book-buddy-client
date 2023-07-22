function Login() {

    return (
        <>
            <form action="/login">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" />
                <label htmlFor="username">Password</label>
                <input type="text" name="password" />
            </form>
        </>
    )
}

export default Login;