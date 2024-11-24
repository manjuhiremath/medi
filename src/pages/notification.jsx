import { Helmet } from 'react-helmet-async';
import { Notification } from '../sections/notification';

export default function BannerPage() {
  return (
    <>
      <Helmet>
        <title>Manage Notification </title>
      </Helmet>
      <Notification/>
    </>
  );
}