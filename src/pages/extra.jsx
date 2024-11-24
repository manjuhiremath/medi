import { Helmet } from 'react-helmet-async';
import { ExtraService } from '../sections/ExtraService';

export default function ExtraPage() {
  return (
    <>
      <Helmet>
        <title>Extra Service</title>
      </Helmet>
      <ExtraService />
    </>
  );
}
