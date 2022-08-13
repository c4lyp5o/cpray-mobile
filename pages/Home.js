import { useState, useRef, useEffect } from 'react';
import { View, Text } from 'native-base';
import Intro from '../components/Intro';
import Zonepicker from '../components/Zonepicker';
import Prayertimes from '../components/Prayertimes';
import { getData } from '../lib/Helper';

export default function Home() {
  const refZone = useRef(null);
  const [showZonePicker, setShowZonePicker] = useState(true);
  const [loading, setLoading] = useState(true);
  const [zoneData, setZoneData] = useState(null);
  useEffect(() => {
    const getZoneData = async () => {
      console.log('-------------this is the start of the app--------------');
      const zone = await getData('yourZone');
      if (zone) {
        console.log('zone:', zone);
        setZoneData(zone);
        setTimeout(() => {
          setLoading(false);
          setShowZonePicker(false);
        }, 300);
      } else {
        console.log('No zone data');
        setLoading(false);
        setShowZonePicker(true);
      }
    };
    getZoneData();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {showZonePicker && (
          <Intro>
            <Zonepicker
              refZone={refZone}
              setShowZonePicker={setShowZonePicker}
              setZoneData={setZoneData}
            />
          </Intro>
        )}
        {!showZonePicker && (
          <Prayertimes
            refZone={refZone}
            zoneData={zoneData}
            setLoading={setLoading}
            setShowZonePicker={setShowZonePicker}
          />
        )}
      </View>
    </>
  );
}
