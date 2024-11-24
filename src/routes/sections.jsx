import { lazy, Suspense, useContext } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import ProtectedRoute from "../sections/Login/protectedRoute";
import DashboardLayout from "../layouts/dashboard";
import Loading from "../components/loading";
import { AuthContext } from "../firebase/AuthContext";

export const LoginView = lazy(() => import("../pages/login"));
export const Hospitals = lazy(() => import("../pages/hospitals"));
export const Banner = lazy(() => import("../pages/banner"));
export const Notification = lazy(() => import("../pages/notification"));
export const AddHospital = lazy(() =>
  import("../sections/Hospital/AddHospital")
);
export const Clinics = lazy(() => import("../pages/clinics"));
export const AddClinic = lazy(() => import("../sections/Clinic/AddClinic"));
export const ViewClinic = lazy(() => import("../sections/Clinic/ViewClinic"));
export const ViewPharmacy = lazy(() =>
  import("../sections/Pharmacy/ViewPharmacy")
);
export const AddPharmacy = lazy(() =>
  import("../sections/Pharmacy/AddPharmacy")
);
export const PharmacyPage = lazy(() => import("../pages/pharmacys"));
export const LabTest = lazy(() => import("../pages/lab_tests"));
export const AddLabTest = lazy(() => import("../sections/LabTest/AddLabTest"));
export const ViewLabTest = lazy(() =>
  import("../sections/LabTest/ViewLabTest")
);
export const ViewHospital = lazy(() =>
  import("../sections/Hospital/ViewHospital")
);
export const Ambulance = lazy(() => import("../pages/ambulances"));
export const AddAmbulance = lazy(() =>
  import("../sections/Ambulance/AddAmbulance")
);
export const ViewAmbulance = lazy(() =>
  import("../sections/Ambulance/ViewAmbulance")
);
export const Faq = lazy(() => import("../sections/Faq"));
export const ViewExtra = lazy(() =>
  import("../sections/ExtraService/ViewExtra")
);
export const AddExtra = lazy(() =>
  import("../sections/ExtraService/AddExtra")
);
export const ExtraPage = lazy(() => import("../pages/extra"));

function Router() {
  const { loading } = useContext(AuthContext);

  const routes = useRoutes([
    {
      element: loading ? (
        <Loading />
      ) : (
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      ),
      children: [
        {
          index: true,
          path: "hospitals",
          element: (
            <ProtectedRoute>
              <Hospitals fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "clinics",
          element: (
            <ProtectedRoute>
              <Clinics fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/clinics/add-clinic",
          element: (
            <ProtectedRoute>
              <AddClinic fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/clinics/view-clinic",
          element: (
            <ProtectedRoute>
              <ViewClinic fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "Pharmacies",
          element: (
            <ProtectedRoute>
              <PharmacyPage fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/pharmacy/add-pharmacy",
          element: (
            <ProtectedRoute>
              <AddPharmacy fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/Pharmacies/view-pharmacy",
          element: (
            <ProtectedRoute>
              <ViewPharmacy fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "extra",
          element: (
            <ProtectedRoute>
              <ExtraPage fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/extra/add-extra",
          element: (
            <ProtectedRoute>
              <AddExtra fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/extra/view-extra",
          element: (
            <ProtectedRoute>
              <ViewExtra fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "labcenter",
          element: (
            <ProtectedRoute>
              <LabTest fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/labcenter/add-labcenter",
          element: (
            <ProtectedRoute>
              <AddLabTest fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/labcenter/view-labcenter",
          element: (
            <ProtectedRoute>
              <ViewLabTest fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "ambulance",
          element: (
            <ProtectedRoute>
              <Ambulance fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/ambulance/add-ambulance",
          element: (
            <ProtectedRoute>
              <AddAmbulance fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/ambulance/view-ambulance",
          element: (
            <ProtectedRoute>
              <ViewAmbulance fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "banner",
          element: (
            <ProtectedRoute>
              <Banner fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "manage-notification",
          element: (
            <ProtectedRoute>
              <Notification fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/hospitals/add-hospital",
          element: (
            <ProtectedRoute>
              <AddHospital fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },

        {
          path: "/hospitals/view-hospital",
          element: (
            <ProtectedRoute>
              <ViewHospital fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/faqs",
          element: (
            <ProtectedRoute>
              <Faq fallback={<Loading />} />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "login",
      element: <LoginView />,
    },
    {
      path: "/",
      element: <LoginView />,
    },
    {
      path: "/hospitals/add-hospital",
      element: <AddHospital />,
    },
  ]);

  return <Suspense fallback={<Loading />}>{routes}</Suspense>;
}

export default Router;
