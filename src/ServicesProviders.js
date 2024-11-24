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
import { ExtraServiceProvider } from './firebase/ExtraService'
export const ServiceProviders = ({ children }) => (
  <ExtraServiceProvider>
    <AmbulanceServiceProvider>
      <PharmacyServiceProvider>
        <ClinicServiceProvider>
          <HospitalServiceProvider>
            <LabTestServiceProvider>
              {children}
            </LabTestServiceProvider>
          </HospitalServiceProvider>
        </ClinicServiceProvider>
      </PharmacyServiceProvider>
    </AmbulanceServiceProvider>
  </ExtraServiceProvider>
);
