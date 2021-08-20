import axios from 'axios';

const LoginService = data => (
	axios.post('http://localhost:8999/api/login', data)
		.then((res) => {
			console.log("league of legends token " + res.token);
			// localStorage.setItem('access_token', res.token)
			// localStorage.setItem('username', res.username)
			return res.status;
		})
);

export default LoginService;