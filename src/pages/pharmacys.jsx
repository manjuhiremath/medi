import { Helmet } from 'react-helmet-async';
import { Pharmacys } from '../sections/Pharmacy';

export default function PharmacyPage() {
  return (
    <>
      <Helmet>
        <title> Pharmacys</title>
      </Helmet>
      <Pharmacys />
    </>
  );
}
