import { useState, useRef, useEffect } from 'react';
import { Box } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { useNNWSStore } from '../lib/Context';
import { getData } from '../lib/Helper';
import simpleLogger from '../lib/Logger';

import Intro from '../components/Intro';
import Zonepicker from '../components/Zonepicker';
import Prayertimes from '../components/Prayertimes';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Home() {
  const { setState, state } = useNNWSStore();
  const refZone = useRef(null);
  const [showZonePicker, setShowZonePicker] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getStoredData = async () => {
    // try {
    //   const data = await getData('yourData');
    //   simpleLogger('HOME: data:', data);
    //   if (!data) {
    //     return;
    //   }
    //   setState((prevState) => ({
    //     ...prevState,
    //     yourZone: data.yourZone,
    //     yourTime: new Date(),
    //   }));
    // } catch (error) {
    //   simpleLogger('HOME', error);
    // }
    // await getData('yourData').then((data) => {
    //   simpleLogger('HOME: data:', data);
    //   if (!data) {
    //     return;
    //   }
    //   setZone(data.yourZone);
    // setState((prevState) => ({
    //   ...prevState,
    //   yourZone: data.yourZone,
    //   yourTime: new Date(),
    // }));
    // });
    const zone = await getData('yourZone');

    try {
      if (zone) {
        setState((prevState) => ({
          ...prevState,
          yourZone: zone,
          yourTime: new Date(),
        }));
        simpleLogger('HOME', `zone is ${zone}`);
        setShowZonePicker(false);
      } else {
        simpleLogger('HOME', 'No zone data');
        setShowZonePicker(true);
      }
    } catch (error) {
      simpleLogger('HOME', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    simpleLogger(
      'HOME',
      '-------------this is the start of the app--------------'
    );

    getStoredData();
    // .then(() => {
    //   if (!zone) {
    //     simpleLogger('HOME: No zone');
    //     setShowZonePicker(true);
    //   } else {
    //     simpleLogger('HOME: zone is, ', state.yourZone);
    //     setShowZonePicker(false);
    //   }
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 1000);
    // });
  }, []);

  if (loading) return <Loading />;

  if (error) return <Error func={getStoredData} />;

  return (
    <Box
      w='full'
      h='full'
      overflow='hidden'
      borderColor='coolGray.200'
      borderWidth='1'
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}
    >
      {showZonePicker && (
        <Intro>
          <Zonepicker
            refZone={refZone}
            setShowZonePicker={setShowZonePicker}
            // setZoneData={setZoneData}
          />
        </Intro>
      )}
      {!showZonePicker && (
        <Prayertimes
          refZone={refZone}
          // zoneData={zoneData}
          setLoading={setLoading}
          setShowZonePicker={setShowZonePicker}
        />
      )}
      <StatusBar style='light' />
    </Box>
  );
}
