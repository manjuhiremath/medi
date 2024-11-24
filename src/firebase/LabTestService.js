import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ContentCutOutlined } from "@mui/icons-material";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const LabTestContext = createContext();

export const LabTestServiceProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [LabTestPublished, setLabTestPublished] = useState([]);
  const [LabTestNotPublished, setLabTestNotPublished] = useState([]);
  const [LabTestPublishedDetails, setLabTestPublishedDetails] = useState([]);
  const [LabTestNotPublishedDetails, setLabTestNotPublishedDetails] = useState([]);

  const handleAdd = async (selectedImages) => {
    const newItems = [];
    for (let item of selectedImages) {
      const storageRef = ref(storage, `LabTest/${item.file.name}`);
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

  const addLabTest = async (LabTestDetails, BasicDetail, details) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;

    try {
      let uploadedImages = [];
      if (LabTestDetails.image) {
        uploadedImages = await handleAdd(LabTestDetails.image);
      }

      const LabTestData = {
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

      const docRef = await addDoc(collection(db, "services"), LabTestData);
      await updateDoc(docRef, { id: docRef.id });

      const detailsRef = collection(docRef, 'details');
      await addDoc(detailsRef, { ...details });

      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const facilitiesDropdownRef = doc(db, 'dropdown-list', 'facilities');
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

      if (details.profile?.facilities) {
        await updateDoc(facilitiesDropdownRef, {
          values: arrayUnion(...details.profile.facilities),
        });
      }

    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  
  const updateLabTest = async (LabTestId, updatedLabTestDetails, updatedDetails) => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
  
    try {
      const LabTestRef = doc(db, "services", LabTestId);
      const facilitiesDropdownRef = doc(db, 'dropdown-list', 'facilities');
      const CityDropdownRef = doc(db, 'dropdown-list', 'city');
      const insuranceDropdownRef = doc(db, 'dropdown-list', 'insurance');
      if (updatedDetails.insurance?.insuranceNames) {
        await updateDoc(insuranceDropdownRef, {
          values: arrayUnion(...updatedDetails.insurance.insuranceNames),
        });
      }
      // Update the main LabTest document
      await updateDoc(LabTestRef, {
        ...updatedLabTestDetails,
        updatedOn: serverTimestamp(),
        updatedBy: user.email
      });

      if (updatedDetails.profile?.facilities) {
        await updateDoc(facilitiesDropdownRef, {
          values: arrayUnion(...updatedDetails.profile.facilities),
        });
      }
      // Update the details subcollection
      const detailsRef = collection(LabTestRef, "details");
      const detailsSnapshot = await getDocs(detailsRef);
  
      if (!detailsSnapshot.empty) {
        // Assuming you want to update the first document in the details collection
        const detailDoc = detailsSnapshot.docs[0];
        await updateDoc(detailDoc.ref, {
          ...updatedDetails,
        });
      }
      if (updatedLabTestDetails.city) {
        await updateDoc(CityDropdownRef, {
          [updatedLabTestDetails.city]: arrayUnion(updatedLabTestDetails.area),
        });
      }
      // Optional: fetch and update the local state after update
      fetchData();
  
    } catch (error) {
      console.error("Error updating LabTest: ", error);
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
        where('service_type', '==', 'lab center'),
        where('isPublished', '==', true)
      );
      const unPublished = query(colRef,
        where('service_type', '==', 'lab center'),
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

      const LabTestDataPublished = await Promise.all(
        querySnapshotPublished.docs.map(fetchDetails)
      );

      const LabTestDataUnPublished = await Promise.all(
        querySnapshotUnPublished.docs.map(fetchDetails)
      );

      setLabTestPublished(LabTestDataPublished);
      setLabTestNotPublished(LabTestDataUnPublished);
      setLoading(false);
    };

  useEffect(() => {
    if (LabTestPublished.length > 0) {
      const publishedDetails = LabTestPublished.flatMap(LabTest => LabTest.details);
      setLabTestPublishedDetails(publishedDetails);
    }

    if (LabTestNotPublished.length > 0) {
      const notPublishedDetails = LabTestNotPublished.flatMap(LabTest => LabTest.details);
      setLabTestNotPublishedDetails(notPublishedDetails);
    }
  }, [LabTestPublished, LabTestNotPublished]);


  return (
    <LabTestContext.Provider value={{
      addLabTest,
      updateLabTest,
      setLoading,
      loading,
      error,
      LabTestNotPublished,
      LabTestPublished,
      LabTestPublishedDetails,
      LabTestNotPublishedDetails
    }}>
      {children}
    </LabTestContext.Provider>
  );
};

export const useLabTestContext = () => useContext(LabTestContext);
