import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ContentCutOutlined } from "@mui/icons-material";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const ClinicContext = createContext();

export const ClinicServiceProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clinicPublished, setClinicPublished] = useState([]);
  const [clinicNotPublished, setClinicNotPublished] = useState([]);
  const [clinicPublishedDetails, setClinicPublishedDetails] = useState([]);
  const [clinicNotPublishedDetails, setClinicNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {
      const storageRef = ref(storage, `Clinics/${item.file.name}`);
      try {
        await uploadBytes(storageRef, item.file);
        const url = await getDownloadURL(storageRef);
        newItems.push({
          ...item,
          imageUrl: url,
          sequenceNo: item.sequenceNo,
          isPublished: item.isPublished,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return newItems;
  };

  const addClinic = async (ClinicDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (ClinicDetails.image) {
        uploadedImages = await handleAdd(ClinicDetails.image);
      }

      const ClinicData = {
        image: uploadedImages.map(img => ({
          imageUrl: img.imageUrl,
          sequenceNo: img.sequenceNo,
          isPublished: img.isPublished
        })),
        ...BasicDetail,
        createdOn: serverTimestamp(),
        createdBy: user.email,
        updatedOn: serverTimestamp(),
        updatedBy: user.email,
      };

      const docRef = await addDoc(collection(db, "services"), ClinicData);
      await updateDoc(docRef, { id: docRef.id });

      const detailsRef = collection(docRef, 'details');
      await addDoc(detailsRef, { ...details });
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const accessibilityDropdownRef = doc(db, 'dropdown-list', 'accessibility');
      const facilitiesDropdownRef = doc(db, 'dropdown-list', 'facilities');
      const servicesProvidedDropdownRef = doc(db, 'dropdown-list', 'servicesprovided');
      const specialtiesDropdownRef = doc(db, 'dropdown-list', 'specialties');
      const insuranceDropdownRef = doc(db, 'dropdown-list', 'insurance');
      if (details.insurance?.insuranceNames) {
        await updateDoc(insuranceDropdownRef, {
          values: arrayUnion(...details.insurance.insuranceNames),
        });
      }
      if (BasicDetail.city) {
        await updateDoc(CityDropdownRef, {
          [BasicDetail.city]: arrayUnion(BasicDetail.area),
        });
      }
      if (details.profile?.accessibility) {
        await updateDoc(accessibilityDropdownRef, {
          values: arrayUnion(...details.profile.accessibility),
        });
      }
  
      if (details.profile?.facilities) {
        await updateDoc(facilitiesDropdownRef, {
          values: arrayUnion(...details.profile.facilities),
        });
      }
  
      if (details.about?.servicesProvided) {
        await updateDoc(servicesProvidedDropdownRef, {
          values: arrayUnion(...details.about.servicesProvided),
        });
      }
  
      if (BasicDetail.specialties) {
        await updateDoc(specialtiesDropdownRef, {
          values: arrayUnion(...BasicDetail.specialties),
        });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  
  const updateClinic = async (ClinicId, updatedClinicDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      const ClinicRef = doc(db, "services", ClinicId);
      const accessibilityDropdownRef = doc(db, 'dropdown-list', 'accessibility');
      const facilitiesDropdownRef = doc(db, 'dropdown-list', 'facilities');
      const servicesProvidedDropdownRef = doc(db, 'dropdown-list', 'servicesprovided');
      const specialtiesDropdownRef = doc(db, 'dropdown-list', 'specialties');
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const insuranceDropdownRef = doc(db, 'dropdown-list', 'insurance');
      if (updatedDetails.insurance?.insuranceNames) {
        await updateDoc(insuranceDropdownRef, {
          values: arrayUnion(...updatedDetails.insurance.insuranceNames),
        });
      }
  
      // Update the main Clinic document
      await updateDoc(ClinicRef, {
        ...updatedClinicDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email
      });
      if (updatedDetails.profile?.accessibility) {
        await updateDoc(accessibilityDropdownRef, {
          values: arrayUnion(...updatedDetails.profile.accessibility),
        });
      }
  
      if (updatedDetails.profile?.facilities) {
        await updateDoc(facilitiesDropdownRef, {
          values: arrayUnion(...updatedDetails.profile.facilities),
        });
      }
  
      if (updatedDetails.about?.servicesProvided) {
        await updateDoc(servicesProvidedDropdownRef, {
          values: arrayUnion(...updatedDetails.about.servicesProvided),
        });
      }
  
      if (updatedClinicDetails.specialties) {
        await updateDoc(specialtiesDropdownRef, {
          values: arrayUnion(...updatedClinicDetails.specialties),
        });
      }
      if (updatedClinicDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedClinicDetails.city]: arrayUnion(updatedClinicDetails.area),
        });
      }
      // Update the details subcollection
      const detailsRef = collection(ClinicRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (!detailsSnapshot.empty) {
        // Assuming you want to update the first document in the details collection
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
  
      // Optional: fetch and update the local state after update
      fetchData();
  
    } catch (error) {
      console.error("Error updating Clinic: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      setLoading(true);
      const colRef = collection(db, 'services');

      const published = query(colRef,
        where('service_type', '==', 'clinic'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'clinic'),
        where('isPublished', '==', false)
      );

      const [querySnapshotPublished, querySnapshotUnPublished] = await Promise.all([
        getDocs(published),
        getDocs(unPublished)
      ]);

      const fetchDetails = async (doc) => {
        const detailRef = collection(doc.ref, 'details');
        const detailSnapshot = await getDocs(detailRef);
        const details = detailSnapshot.docs.map(detailDoc => ({
          id: detailDoc.id,
          ...detailDoc.data()
        }));
        return {
          id: doc.id,
          ...doc.data(),
          details
        };
      };

      const ClinicDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const ClinicDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setClinicPublished(ClinicDataPublished);
      setClinicNotPublished(ClinicDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (clinicPublished.length > 0) {
      const publishedDetails = clinicPublished.flatMap(Clinic => Clinic.details);
      setClinicPublishedDetails(publishedDetails);
    }

    if (clinicNotPublished.length > 0) {
      const notPublishedDetails = clinicNotPublished.flatMap(Clinic => Clinic.details);
      setClinicNotPublishedDetails(notPublishedDetails);
    }
  }, [clinicPublished, clinicNotPublished]);


  return (
    <ClinicContext.Provider value={{
      addClinic,
      updateClinic,
      setLoading,
      loading,
      error,
      clinicNotPublished,
      clinicPublished,
      clinicPublishedDetails,
      clinicNotPublishedDetails
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinicContext = () => useContext(ClinicContext);
