import { Helmet } from 'react-helmet-async';

import Banner from '../sections/Banners';


export default function BannerPage() {
  return (
    <>
      <Helmet>
        <title> Banner </title>
      </Helmet>
      <Banner/>
    </>
  );
}