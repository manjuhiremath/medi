import React, { createContext, useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Ensure you have correctly set up Firebase

// Create FaqContext
const FaqContext = createContext();

// FaqProvider component that provides FAQ-related data and functions
export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch FAQs from Firestore on component mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'Faqs'));
        const faqList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFaqs(faqList);
      } catch (e) {
        console.error('Error fetching FAQs: ', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Function to add a new FAQ to Firestore and update state
  const addFaq = async (question, answer) => {
    try {
      setLoading(true);
      const sequenceNo = faqs.length + 1;
      const newFaq = { question, answer, sequenceNo };
      const docRef = await addDoc(collection(db, 'Faqs'), newFaq);
      setFaqs((prevFaqs) => [...prevFaqs, { ...newFaq, id: docRef.id }]);
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setLoading(false);
    }
  };

  const addRadius = async(radius) => {
    try {
      setLoading(true);
      const Radius = { radius };
    const docRef = doc(db, 'global_parameters', 'gps_radius'); // Use a fixed document ID
    await setDoc(docRef, Radius, { merge: true }); // Set or update the radius
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setLoading(false);
    }
  }
  const fetchRadius = async () => {
    try {
      setLoading(true); // Start loading state
      const docRef = doc(db, 'global_parameters', 'gps_radius'); // Use the fixed document ID
      const docSnap = await getDoc(docRef); // Fetch the document
  
      if (docSnap.exists()) {
        const data = docSnap.data(); // Get the document data
        const radius = data.radius; // Extract the radius field
        return radius; // Return the radius value
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (e) {
      console.error('Error fetching document: ', e);
      return null;
    } finally {
      setLoading(false); // End loading state
    }
  };
  const deleteFaq = async (id) => {
    try {
      setLoading(true);
      // Delete the FAQ document from Firestore
      await deleteDoc(doc(db, 'Faqs', id));
  
      // Remove the FAQ from the local state and update the sequence numbers
      setFaqs((prevFaqs) => {
        const updatedFaqs = prevFaqs.filter((faq) => faq.id !== id);
        const reorderedFaqs = updatedFaqs.map((faq, index) => ({
          ...faq,
          sequenceNo: index + 1,
        }));
  
        // Update the sequence numbers in Firestore
        reorderedFaqs.forEach(async (faq) => {
          const faqDocRef = doc(db, 'Faqs', faq.id);
          await updateDoc(faqDocRef, { sequenceNo: faq.sequenceNo });
        });
  
        return reorderedFaqs;
      });
    } catch (e) {
      console.error('Error deleting document and updating sequence numbers: ', e);
    } finally {
      setLoading(false);
    }
  };

  const updateFaqSequence = async (result) => {
    
        if (!result.destination) return;
        const reorderedFaqs = Array.from(faqs);
        const [movedfaqs] = reorderedFaqs.splice(result.source.index, 1);
        reorderedFaqs.splice(result.destination.index, 0, movedfaqs);

        const updatedFaqs = reorderedFaqs.map((faqs, index) => ({
            ...faqs,
            sequenceNo: index + 1,
        }));

        setFaqs(updatedFaqs);

        for (const faqs of updatedFaqs) {
            const faqsDocRef = doc(db, 'Faqs', faqs.id);
            await updateDoc(faqsDocRef, { sequenceNo: faqs.sequenceNo });
        }
    };

  return (
    <FaqContext.Provider value={{deleteFaq,fetchRadius, addRadius, faqs, addFaq, loading, updateFaqSequence }}>
      {children}
    </FaqContext.Provider>
  );
};

export default FaqContext;