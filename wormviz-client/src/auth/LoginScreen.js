import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { withRouter } from 'react-router-dom';

const clientId = '739250301985-ksa42dhua2tmpck4vib1furefmtqau8i.apps.googleusercontent.com'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const Login = withRouter(({ history }) => {

    const onLoginSuccess = (res) => {
        fetch(`http://localhost:3001/login?email=${res.profileObj.email}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.status === LOGIN_SUCCESS) {
                    console.log('[Login Success]: currentUser: ', res.profileObj);
                    history.push({ pathname: '/upload', state: res });
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

    const onLoginFailure = (res) => {
        console.log('[Login Failure]: ', res);
        history.push({ pathname: '/', state: { loginError: 'Unable to login' } });
    }

    return (
        <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy={'single_host_origin'}
                style={{ margin: 100 }}
                isSignedIn={true}
            />
        </div>
    );
});

export default Login;