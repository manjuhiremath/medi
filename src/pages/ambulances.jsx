import { Helmet } from 'react-helmet-async';
import { Ambulance } from '../sections/Ambulance';

export default function AmbulancesPage() {
  return (
    <>
      <Helmet>
        <title> Ambulances </title>
      </Helmet>

      <Ambulance />
    </>
  );
}