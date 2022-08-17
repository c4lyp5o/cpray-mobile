import React, { useState, useContext } from 'react';

const NNWSstore = React.createContext();

function NNWSStoreProvider({ children }) {
  const [state, setState] = useState({
    yourZone: '',
    yourSettings: '',
    yourTimes: '',
    yourTest: '',
  });
  const value = { state, setState };
  return <NNWSstore.Provider value={value}>{children}</NNWSstore.Provider>;
}

const useNNWSStore = () => {
  const context = useContext(NNWSstore);
  if (!context) {
    throw new Error('useNNWSStore must be used within a NNWSstoreProvider');
  }
  return context;
};

export { NNWSStoreProvider, useNNWSStore };
