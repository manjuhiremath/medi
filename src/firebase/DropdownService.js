
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from './firebase';

const DropdownContext = createContext();

export const useDropdown = () => useContext(DropdownContext);

export const DropdownProvider = ({ children, collectionName }) => {
  const firestore = getFirestore();
  const [facilitylist, setFacilitylist] = useState([]);
  const [specialtieslist, setspecialtieslist] = useState([]);
  const [accessibilitylist, setAccessibilitylist] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [servicesprovidedlist, setServicesprovidedlist] = useState([]);
  const [insurance,setInsurance] = useState([]);

  const fetchItems = useCallback(async (id) => {
    try {
      const docRef = doc(firestore, 'dropdown-list', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching items: ", error);
      return [];
    }
  }, []); // Dependency on 'firestore' only
  useEffect(() => {
    const loadItems = async () => {
      const facilities = await fetchItems('facilities');
      const specialties = await fetchItems('specialties');
      const accessibility = await fetchItems('accessibility');
      const servicesprovided = await fetchItems('servicesprovided');
      const insurance = await fetchItems('insurance');
      setInsurance(insurance.values);
      setAccessibilitylist(accessibility.values);
      setServicesprovidedlist(servicesprovided.values);
      setFacilitylist(facilities.values);
      setspecialtieslist(specialties.values);
      const cityDocSnap = await fetchItems('city');
      const cityData = cityDocSnap;
      const areaData = cityDocSnap;
      setAreaList(areaData)
      const cityNamesArray = Object.keys(cityData);
      setCityList(cityNamesArray);
    };
    loadItems();
  }, [fetchItems]);
  console.log(insurance);



  return (
    <DropdownContext.Provider value={{
      fetchItems,
      accessibilitylist,
      cityList,
      areaList,
      servicesprovidedlist,
      facilitylist,
      specialtieslist,
      insurance
      // loadItems
    }}>
      {children}
    </DropdownContext.Provider>
  );
};
