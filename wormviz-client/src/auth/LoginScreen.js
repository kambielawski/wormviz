import React, { useState } from 'react';
// import { GoogleLogin } from 'react-google-login';
import { withRouter } from 'react-router-dom';

// const clientId = '739250301985-ksa42dhua2tmpck4vib1furefmtqau8i.apps.googleusercontent.com'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const BACKEND_HOST = 'ec2-3-129-98-89.us-east-2.compute.amazonaws.com:8000';

const Login = withRouter(({ history }) => {

    const onLoginSuccess = (res) => {
        fetch(`http://${BACKEND_HOST}/login?email=${res.profileObj.email}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.status === LOGIN_SUCCESS) {
                    console.log('[Login Success]: currentUser: ', res.profileObj);
                    history.push({ pathname: '/upload', state: res });
                } else if (data.status === LOGIN_FAILURE) {
                    console.log('[Login Failure]: unverified email address');
                    history.push({ pathname: '/', state: { loginError: 'Unverified email address' } });
                } else {
                    throw 'Something went wrong';
                }
            })
            .catch((e) => {
                console.log('[Login Failure]: ', e);
                history.push({ pathname: '/', state: { loginError: 'Unable to login' } });
            });
    }

    const onLoginFailure = (res) => {
        console.log('[Login Failure]: ', res);
        history.push({ pathname: '/', state: { loginError: 'Unable to login' } });
    }

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);


    const onLoginPress = () => {
        fetch(`http://${BACKEND_HOST}/userLogin?username=${username}&password=${password}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.status === LOGIN_SUCCESS) {
                    console.log('[Login Success]: ' );
                    history.push({ pathname: '/upload', state: { loggedIn: true, username, password } });
                } else {
                    console.log('[Login Failure]: unverified email address');
                    history.push({ pathname: '/', state: { loginError: 'Unverified email address' } });
                }
            })
            .catch((e) => {
                console.log('[Login Failure]: ', e);
                history.push({ pathname: '/', state: { loginError: 'Unable to login' } });
            });
    }

    return (
        <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            {/* <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy={'single_host_origin'}
                style={{ margin: 100 }}
                isSignedIn={true}
            /> */}
            <p>Username</p>
            <input type="text" onChange={(d) => setUsername(d.target.value)} />
            <p>Password</p>
            <input type="password" onChange={(d) => setPassword(d.target.value)} />
            <p />
            <button onClick={onLoginPress}>Login </button>
        </div>
    );
});

export default Login;