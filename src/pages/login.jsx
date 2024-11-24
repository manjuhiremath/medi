import { Helmet } from 'react-helmet-async';
import Login from '../sections/Login';

export default function LoginView() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>
      <Login />
    </>
  );
}
