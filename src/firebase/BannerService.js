
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, collectionGroup } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';



const BannerContext = createContext();

export const useBanner = () => useContext(BannerContext);

export const BannerProvider = ({ children }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerCount,setBannerCount]=useState();
    // const isLoggedin  = useContext(AuthContext);

    const fetchBanners = async () => {
        try {
           setLoading(true);
            const bannersCollectionRef = collection(db, 'banners');
            const querySnapshot = await getDocs(bannersCollectionRef);
            const bannersData = [];
            setBannerCount(querySnapshot.size);
            querySnapshot.forEach((doc) => {
                const banner = {
                    id: doc.id,
                    ...doc.data(),
                };
                bannersData.push(banner);
            });
            bannersData.sort((a, b) => a.sequenceNo - b.sequenceNo);
    
            if (bannersData.length === 1 && !bannersData[0].isPublished) {
                const singleBanner = bannersData[0];
                const updatedBanner = { ...singleBanner, isPublished: true };
                const bannerDocRef = doc(db, 'banners', singleBanner.id);
                await updateDoc(bannerDocRef, { isPublished: true });
                bannersData[0] = updatedBanner;
            }
    
            setBanners(bannersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    };
    

    const handleAdd = async (selectedImages ,link) => {
       
        for (let file of selectedImages) {
            const storageRef = ref(storage, `Banners/${file.name}`);
            try {
                setLoading(true);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                const collectionRef = collectionGroup(db, 'banners');
                const querySnapshot = await getDocs(collectionRef);
                const docCount = querySnapshot.size;
                await addDoc(collection(db, 'banners'), {
                    sequenceNo: docCount ? docCount + 1 : 1,
                    url: url,
                    isPublished: false,
                    link: link,
                });
                setLoading(false);
                await fetchBanners();
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const reorderedBanners = Array.from(banners);
        const [movedBanner] = reorderedBanners.splice(result.source.index, 1);
        reorderedBanners.splice(result.destination.index, 0, movedBanner);

        const updatedBanners = reorderedBanners.map((banner, index) => ({
            ...banner,
            sequenceNo: index + 1,
        }));

        setBanners(updatedBanners);

        for (const banner of updatedBanners) {
            const bannerDocRef = doc(db, 'banners', banner.id);
            await updateDoc(bannerDocRef, { sequenceNo: banner.sequenceNo });
        }
    };

    const togglePublish = async (sequence) => {
        const updatedBanners = banners.map(banner => {
            if (banner.sequenceNo === sequence) {
                const updatedBanner = { ...banner, isPublished: !banner.isPublished };
                const bannerDocRef = doc(db, 'banners', banner.id);
                updateDoc(bannerDocRef, { isPublished: updatedBanner.isPublished });
                return updatedBanner;
            }
            return banner;
        });
        setBanners(updatedBanners);
    
    };
    const updateBannerLink = async (sequenceNo, newLink) => {
        try {
            // Find the banner by sequenceNo
            const bannerToUpdate = banners.find(banner => banner.sequenceNo === sequenceNo);
    
            if (bannerToUpdate) {
                const bannerRef = doc(db, 'banners', bannerToUpdate.id); // Use the correct document ID
                await updateDoc(bannerRef, { link: newLink });
                console.log(`Banner ${sequenceNo} link updated successfully`);
    
                // Optionally, update the local state to reflect the change
                setBanners(prevBanners =>
                    prevBanners.map(banner =>
                        banner.sequenceNo === sequenceNo ? { ...banner, link: newLink } : banner
                    )
                );
            } else {
                console.error("Banner with the specified sequenceNo not found.");
            }
        } catch (error) {
            console.error("Error updating banner link:", error);
        }
    };
    const deleteBanner = async (sequenceNo, url) => {
        setLoading(true);

        const bannerToDelete = banners.find(banner => banner.sequenceNo === sequenceNo);
        if (bannerToDelete) {
            const bannerDocRef = doc(db, 'banners', bannerToDelete.id);
            try {
                await deleteDoc(bannerDocRef);
                const fileRef = ref(storage, url);
                await deleteObject(fileRef);

                setBanners(prevBanners => (
                    prevBanners
                        .filter(banner => banner.sequenceNo !== sequenceNo)
                        .map((banner, index) => ({ ...banner, sequenceNo: index + 1 }))
                ));

                for (const banner of banners.filter(banner => banner.sequenceNo > sequenceNo)) {
                    const bannerDocRef = doc(db, 'banners', banner.id);
                    await updateDoc(bannerDocRef, { sequenceNo: banner.sequenceNo - 1 });
                }
                await fetchBanners();
            setLoading(false);
            } catch (error) {
                console.error('Error deleting banner:', error);
            }
        }
    };


    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <BannerContext.Provider
            value={{
                banners,
                fetchBanners,
                handleAdd,
                handleDragEnd,
                togglePublish,
                deleteBanner,
                loading,
                bannerCount,
                updateBannerLink
            }}
        >
            {children}
        </BannerContext.Provider>
    );
};
