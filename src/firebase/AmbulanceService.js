import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ContentCutOutlined } from "@mui/icons-material";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const AmbulanceContext = createContext();

export const AmbulanceServiceProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [AmbulancePublished, setAmbulancePublished] = useState([]);
  const [AmbulanceNotPublished, setAmbulanceNotPublished] = useState([]);
  const [AmbulancePublishedDetails, setAmbulancePublishedDetails] = useState([]);
  const [AmbulanceNotPublishedDetails, setAmbulanceNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {
      const storageRef = ref(storage, `Ambulance/${item.file.name}`);
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

  const addAmbulance = async (AmbulanceDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (AmbulanceDetails.image) {
        uploadedImages = await handleAdd(AmbulanceDetails.image);
      }

      const AmbulanceData = {
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

      const docRef = await addDoc(collection(db, "services"), AmbulanceData);
      await updateDoc(docRef, { id: docRef.id });
      const detailsRef = collection(docRef, 'details');
      await addDoc(detailsRef, { ...details });
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');

      
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

  
  const updateAmbulance = async (AmbulanceId, updatedAmbulanceDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      const AmbulanceRef = doc(db, "services", AmbulanceId);
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
  
      await updateDoc(AmbulanceRef, {
        ...updatedAmbulanceDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email
      });
  
      if (updatedAmbulanceDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedAmbulanceDetails.city]: arrayUnion(updatedAmbulanceDetails.area),
        });
      }
      const detailsRef = collection(AmbulanceRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (!detailsSnapshot.empty) {
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
  
      fetchData();
  
    } catch (error) {
      console.error("Error updating Ambulance: ", error);
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
        where('service_type', '==', 'ambulance'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'ambulance'),
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

      const AmbulanceDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const AmbulanceDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setAmbulancePublished(AmbulanceDataPublished);
      setAmbulanceNotPublished(AmbulanceDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (AmbulancePublished.length > 0) {
      const publishedDetails = AmbulancePublished.flatMap(Ambulance => Ambulance.details);
      setAmbulancePublishedDetails(publishedDetails);
    }

    if (AmbulanceNotPublished.length > 0) {
      const notPublishedDetails = AmbulanceNotPublished.flatMap(Ambulance => Ambulance.details);
      setAmbulanceNotPublishedDetails(notPublishedDetails);
    }
  }, [AmbulancePublished, AmbulanceNotPublished]);


  return (
    <AmbulanceContext.Provider value={{
      addAmbulance,
      updateAmbulance,
      setLoading,
      loading,
      error,
      AmbulanceNotPublished,
      AmbulancePublished,
      AmbulancePublishedDetails,
      AmbulanceNotPublishedDetails
    }}>
      {children}
    </AmbulanceContext.Provider>
  );
};

export const useAmbulanceContext = () => useContext(AmbulanceContext);
