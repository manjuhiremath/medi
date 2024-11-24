import { Helmet } from 'react-helmet-async';
import { Hospitals } from '../sections/Hospital';
import { useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import Loading from '../components/loading';

export default function HospitalsPage() {
  const { loading } = useContext(AuthContext);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Helmet>
            <title>Hospital</title>
          </Helmet>
          <Hospitals />
        </>
      )}
    </>
  );
}