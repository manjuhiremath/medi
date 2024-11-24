import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDateField } from "@mui/x-date-pickers/DateField/useDateField";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const HospitalContext = createContext();

export const HospitalServiceProvider = ({ children }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hospitalsPublished, setHospitalsPublished] = useState([]);
  const [hospitalsNotPublished, setHospitalsNotPublished] = useState([]);
  const [hospitalsPublishedDetails, setHospitalsPublishedDetails] = useState([]);
  const [hospitalsNotPublishedDetails, setHospitalsNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {

      try {
        const storageRef = ref(storage, `Hospitals/${item.file.name}`);
  
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

  const addHospital = async (hospitalDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (hospitalDetails.image) {
        uploadedImages = await handleAdd(hospitalDetails.image);
      }

      const hospitalData = {
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
      const docRef = await addDoc(collection(db, "services"), hospitalData);
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

  
  const updateHospital = async (hospitalId, updatedHospitalDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      // References to Firestore documents
      const hospitalRef = doc(db, "services", hospitalId);
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
      // Update the hospital document
      await updateDoc(hospitalRef, {
        ...updatedHospitalDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email,
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
  
      if (updatedHospitalDetails.specialties) {
        await updateDoc(specialtiesDropdownRef, {
          values: arrayUnion(...updatedHospitalDetails.specialties),
        });
      }

      if (updatedHospitalDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedHospitalDetails.city]: arrayUnion(updatedHospitalDetails.area),
        });
      }

      const detailsRef = collection(hospitalRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (detailsSnapshot.empty) {
        // If 'details' collection exists and has documents, update the first document
        const detailsRef = collection(hospitalRef, 'details');
        await addDoc(detailsRef, { ...updatedDetails });
      } else {
        // If 'details' collection doesn't exist or is empty, add a new document
        
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error updating hospital: ", error);
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
        where('service_type', '==', 'hospital'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'hospital'),
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

      const hospitalDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const hospitalDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setHospitalsPublished(hospitalDataPublished);
      setHospitalsNotPublished(hospitalDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (hospitalsPublished.length > 0) {
      const publishedDetails = hospitalsPublished.flatMap(hospital => hospital.details);
      setHospitalsPublishedDetails(publishedDetails);
    }

    if (hospitalsNotPublished.length > 0) {
      const notPublishedDetails = hospitalsNotPublished.flatMap(hospital => hospital.details);
      setHospitalsNotPublishedDetails(notPublishedDetails);
    }
  }, [hospitalsPublished, hospitalsNotPublished]);


  return (
    <HospitalContext.Provider value={{
      hospitals,
      addHospital,
      updateHospital,
      setLoading,
      loading,
      error,
      hospitalsNotPublished,
      hospitalsPublished,
      hospitalsPublishedDetails,
      hospitalsNotPublishedDetails
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalContext = () => useContext(HospitalContext);
