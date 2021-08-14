import axios from 'axios';

const LoginService = data => (
	axios.post('http://localhost:8999/api/login', data)
		.then(res => res.status)
)

export default LoginService;