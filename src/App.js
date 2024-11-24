
import './global.css';
import ThemeProvider from './theme';
import Router from './routes/sections';
import { AuthProvider } from '../src/firebase/AuthContext';
import { BannerProvider } from './firebase/BannerService';
import { HospitalServiceProvider } from './firebase/HospitalsService';
import { ClinicServiceProvider } from "./firebase/ClinicsServic";
import { PharmacyServiceProvider } from './firebase/PharmacyService';
import { LabTestServiceProvider } from './firebase/LabTestService';
import { AmbulanceServiceProvider } from './firebase/AmbulanceService';
import { NotificationProvider } from './firebase/NotificaionService';
import { FaqProvider } from './firebase/FaqContext';
import { DropdownProvider } from './firebase/DropdownService';
import { ServiceProviders } from './ServicesProviders';

function App() {

  return (
    <ThemeProvider>
      <ServiceProviders>
        <BannerProvider>
          <DropdownProvider>
            <FaqProvider>
              <NotificationProvider>
                <AuthProvider>
                  <Router />
                </AuthProvider>
              </NotificationProvider>
            </FaqProvider>
          </DropdownProvider>
        </BannerProvider>
      </ServiceProviders>
    </ThemeProvider>
  );
}
export default App;
