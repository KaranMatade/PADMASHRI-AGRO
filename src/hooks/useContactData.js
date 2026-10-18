import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { mainContact as staticMainContact, branchesData as staticBranches } from '../data/branchesData';

/**
 * useContactData — Real-time hook for Padmashri contact info
 * Reads from Firestore `siteConfig/contact` and falls back to static data
 * until Firestore responds.
 */
export function useContactData() {
  const [mainContact, setMainContact] = useState(staticMainContact);
  const [branchesData, setBranchesData] = useState(staticBranches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'siteConfig', 'contact'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          // Build mainContact shape
          setMainContact({
            companyName: data.companyName || staticMainContact.companyName,
            companyNameMr: data.companyNameMr || staticMainContact.companyNameMr,
            established: data.established || staticMainContact.established,
            founder: data.founder || staticMainContact.founder,
            email: data.email || staticMainContact.email,
            mainPhone: data.mainPhone || staticMainContact.mainPhone,
            whatsapp: data.whatsapp || staticMainContact.whatsapp,
            indiaMartUrl: data.indiaMartUrl || staticMainContact.indiaMartUrl,
            headOffice: data.headOffice || staticMainContact.headOffice,
          });
          // Branches array with safe defaults
          if (Array.isArray(data.branches)) {
            setBranchesData(data.branches.map(b => ({
              ...b,
              category: b.category || "Authorized Showroom",
              facilities: Array.isArray(b.facilities) && b.facilities.length > 0 ? b.facilities : ["🚜 Sales & Service", "⚙️ Spare Parts"],
              googleMapsUrl: b.googleMapsUrl || (b.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}` : ''),
              isActive: b.isActive !== false
            })));
          }
        }
        setLoading(false);
      },
      (err) => {
        console.warn('useContactData: Firestore error, using static fallback', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { mainContact, branchesData, loading };
}
