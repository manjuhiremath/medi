
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import DomainAddRoundedIcon from '@mui/icons-material/DomainAddRounded';
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import LocalPharmacyRoundedIcon from '@mui/icons-material/LocalPharmacyRounded';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

//-----------------------------------------------------------------------
const service =[
  {
    title: 'Hospital',
    path: '/hospitals',
    icon:  <DomainAddRoundedIcon/>,
  },
  {
    title: 'Clinic',
    path: '/clinics',
    icon: <LocalHospitalRoundedIcon/>,
  },
  {
    title: 'Pharmacies',
    path: '/Pharmacies',
    icon: <LocalPharmacyRoundedIcon/>,
  },
  {
    title: 'Lab Center',
    path: '/labcenter',
    icon: <ScienceRoundedIcon/>,
  },
  {
    title: 'Ambulance',
    path: '/ambulance',
    icon:  <DirectionsBusRoundedIcon/>,
  },
  {
    title: 'Extra',
    path: '/extra',
    icon: <MedicalInformationIcon/>,
  },

]

const navConfig = [
  
  {
    title: 'Banner',
    path: '/banner',
    icon:  <ViewCarouselRoundedIcon/>,
  },
  {
    title: 'Notification',
    path: '/manage-notification',
    icon:  <NotificationsActiveRoundedIcon/>,
  },
  {
    title: 'faqs',
    path: '/faqs',
    icon:  <LiveHelpRoundedIcon/>,
  },


];

export {
  navConfig,
  service
};
