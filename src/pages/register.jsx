import { Helmet } from 'react-helmet-async';
import { Register } from 'src/sections/register';

export default function register() {
  return (
    <>
      <Helmet>
        <title> Register </title>
      </Helmet>
      <Register />
    </>
  );
}
