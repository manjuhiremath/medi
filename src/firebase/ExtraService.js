import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const ExtraContext = createContext();

export const ExtraServiceProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ExtraPublished, setExtraPublished] = useState([]);
  const [ExtraNotPublished, setExtraNotPublished] = useState([]);
  const [ExtraPublishedDetails, setExtraPublishedDetails] = useState([]);
  const [ExtraNotPublishedDetails, setExtraNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {
      const storageRef = ref(storage, `ExtraService/${item.file.name}`);
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

  const addExtra = async (ExtraDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (ExtraDetails.image) {
        uploadedImages = await handleAdd(ExtraDetails.image);
      }

      const ExtraData = {
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

      const docRef = await addDoc(collection(db, "services"), ExtraData);
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

  
  const updateExtra = async (ExtraId, updatedExtraDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      const ExtraRef = doc(db, "services", ExtraId);
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const insuranceDropdownRef = doc(db, 'dropdown-list', 'insurance');
      if (updatedDetails.insurance?.insuranceNames) {
        await updateDoc(insuranceDropdownRef, {
          values: arrayUnion(...updatedDetails.insurance.insuranceNames),
        });
      }
      // Update the main Extra document
      await updateDoc(ExtraRef, {
        ...updatedExtraDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email
      });
  
      // Update the details subcollection
      const detailsRef = collection(ExtraRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (!detailsSnapshot.empty) {
        // Assuming you want to update the first document in the details collection
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
      if (updatedExtraDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedExtraDetails.city]: arrayUnion(updatedExtraDetails.area),
        });
      }

      // Optional: fetch and update the local state after update
      fetchData();
  
    } catch (error) {
      console.error("Error updating Extra: ", error);
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
        where('service_type', '==', 'extra'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'extra'),
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

      const ExtraDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const ExtraDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setExtraPublished(ExtraDataPublished);
      setExtraNotPublished(ExtraDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (ExtraPublished.length > 0) {
      const publishedDetails = ExtraPublished.flatMap(Extra => Extra.details);
      setExtraPublishedDetails(publishedDetails);
    }

    if (ExtraNotPublished.length > 0) {
      const notPublishedDetails = ExtraNotPublished.flatMap(Extra => Extra.details);
      setExtraNotPublishedDetails(notPublishedDetails);
    }
  }, [ExtraPublished, ExtraNotPublished]);


  return (
    <ExtraContext.Provider value={{
      addExtra,
      updateExtra,
      setLoading,
      loading,
      error,
      ExtraNotPublished,
      ExtraPublished,
      ExtraPublishedDetails,
      ExtraNotPublishedDetails
    }}>
      {children}
    </ExtraContext.Provider>
  );
};

export const useExtraContext = () => useContext(ExtraContext);
