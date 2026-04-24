import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  readStorage,
  writeStorage,
  readPlainStorage,
  writePlainStorage,
  removeStorage,
} from "../utils/storage";

const AddressContext = createContext();

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(() =>
    readStorage(STORAGE_KEYS.addresses, [])
  );

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const saved = readPlainStorage(STORAGE_KEYS.selectedAddressId, null);
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.addresses, addresses);
  }, [addresses]);

  useEffect(() => {
    if (selectedAddressId) {
      writePlainStorage(STORAGE_KEYS.selectedAddressId, selectedAddressId);
    } else {
      removeStorage(STORAGE_KEYS.selectedAddressId);
    }
  }, [selectedAddressId]);

  const addAddress = (address) => {
    const newAddress = {
      id: Date.now(),
      ...address,
    };

    setAddresses((prev) => [...prev, newAddress]);

    if (!selectedAddressId) {
      setSelectedAddressId(newAddress.id);
    }

    return newAddress;
  };

  const updateAddress = (addressId, updatedFields) => {
    setAddresses((prev) =>
      prev.map((item) =>
        item.id === addressId ? { ...item, ...updatedFields } : item
      )
    );
  };

  const removeAddress = (addressId) => {
    setAddresses((prev) => prev.filter((item) => item.id !== addressId));

    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
    }
  };

  const selectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const selectedAddress = useMemo(() => {
    return addresses.find((item) => item.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddressId,
        selectedAddress,
        addAddress,
        updateAddress,
        removeAddress,
        selectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  return useContext(AddressContext);
}