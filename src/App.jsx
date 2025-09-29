import React, { useEffect, useContext } from 'react';
import Routing from './Router.jsx';
// import { DataProvider, DataContext } from '../components/DataProvider/DataProvider.jsx';
import { reducer, initialState } from './Utility/reducer';
import { Type } from './Utility/action.type';
import { auth } from './Utility/firebase';

function AppContent() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // console.log(authUser);
        dispatch({
          type: Type.SET_USER,
          user: authUser
        });
      } else {
        dispatch({
          type: Type.SET_USER,
          user: null
        });
      }
    });
  }, [dispatch]);

  return <Routing />;
}

function App() {
  return (
    <DataProvider reducer={reducer} initialState={initialState}>
      <AppContent />
    </DataProvider>
  );
}

export default App;