import { useState, useRef, useEffect } from 'react';
import { View, Text } from 'native-base';
import Intro from '../components/Intro';
import Zonepicker from '../components/Zonepicker';
import Prayertimes from '../components/Prayertimes';
import { getZoneData } from '../lib/Helper';

export default function Home() {
  const refZone = useRef(null);
  const [showZonePicker, setShowZonePicker] = useState(true);
  const [loading, setLoading] = useState(true);
  const [zoneData, setZoneData] = useState(null);
  useEffect(() => {
    getZoneData().then((res) => {
      console.log('in useeffect', res);
      if (!res) {
        setLoading(false);
        setShowZonePicker(true);
        return;
      }
      setZoneData(res);
      setTimeout(() => {
        setLoading(false);
        setShowZonePicker(false);
      }, 1000);
    });
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
  );
}
