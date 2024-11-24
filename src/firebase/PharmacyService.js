import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ContentCutOutlined } from "@mui/icons-material";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const PharmacyContext = createContext();

export const PharmacyServiceProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [PharmacyPublished, setPharmacyPublished] = useState([]);
  const [PharmacyNotPublished, setPharmacyNotPublished] = useState([]);
  const [PharmacyPublishedDetails, setPharmacyPublishedDetails] = useState([]);
  const [PharmacyNotPublishedDetails, setPharmacyNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {
      const storageRef = ref(storage, `Pharmacy/${item.file.name}`);
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

  const addPharmacy = async (PharmacyDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (PharmacyDetails.image) {
        uploadedImages = await handleAdd(PharmacyDetails.image);
      }

      const PharmacyData = {
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

      const docRef = await addDoc(collection(db, "services"), PharmacyData);
      await updateDoc(docRef, { id: docRef.id });

      const detailsRef = collection(docRef, 'details');
      await addDoc(detailsRef, { ...details });
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
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

    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  
  const updatePharmacy = async (PharmacyId, updatedPharmacyDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      const PharmacyRef = doc(db, "services", PharmacyId);
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const insuranceDropdownRef = doc(db, 'dropdown-list', 'insurance');
      if (updatedDetails.insurance?.insuranceNames) {
        await updateDoc(insuranceDropdownRef, {
          values: arrayUnion(...updatedDetails.insurance.insuranceNames),
        });
      }
      // Update the main Pharmacy document
      await updateDoc(PharmacyRef, {
        ...updatedPharmacyDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email
      });
  
      // Update the details subcollection
      const detailsRef = collection(PharmacyRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (!detailsSnapshot.empty) {
        // Assuming you want to update the first document in the details collection
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
      if (updatedPharmacyDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedPharmacyDetails.city]: arrayUnion(updatedPharmacyDetails.area),
        });
      }

      // Optional: fetch and update the local state after update
      fetchData();
  
    } catch (error) {
      console.error("Error updating Pharmacy: ", error);
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
        where('service_type', '==', 'pharmacy'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'pharmacy'),
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

      const PharmacyDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const PharmacyDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setPharmacyPublished(PharmacyDataPublished);
      setPharmacyNotPublished(PharmacyDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (PharmacyPublished.length > 0) {
      const publishedDetails = PharmacyPublished.flatMap(Pharmacy => Pharmacy.details);
      setPharmacyPublishedDetails(publishedDetails);
    }

    if (PharmacyNotPublished.length > 0) {
      const notPublishedDetails = PharmacyNotPublished.flatMap(Pharmacy => Pharmacy.details);
      setPharmacyNotPublishedDetails(notPublishedDetails);
    }
  }, [PharmacyPublished, PharmacyNotPublished]);


  return (
    <PharmacyContext.Provider value={{
      addPharmacy,
      updatePharmacy,
      setLoading,
      loading,
      error,
      PharmacyNotPublished,
      PharmacyPublished,
      PharmacyPublishedDetails,
      PharmacyNotPublishedDetails
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacyContext = () => useContext(PharmacyContext);
