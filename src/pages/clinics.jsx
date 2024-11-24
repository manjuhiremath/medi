import { Helmet } from 'react-helmet-async';
import { Clinics } from '../sections/Clinic';

export default function ClinicsPage() {
  return (
    <>
      <Helmet>
        <title> Clinics </title>
      </Helmet>

      <Clinics />
    </>
  );
}