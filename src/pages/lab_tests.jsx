import { Helmet } from 'react-helmet-async';

import { LabTest } from '../sections/LabTest';


export default function LabTestPage() {
  return (
    <>
      <Helmet>
        <title> Lab Test </title>
      </Helmet>
      <LabTest />
    </>
  );
}