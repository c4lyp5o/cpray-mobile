import { Box, Select, Button, CheckCircleIcon } from 'native-base';
import { storeData } from '../lib/Helper';
import { useNNWSStore } from '../lib/Context';
import simpleLogger from '../lib/Logger';

export default function Zonepicker({ refZone, setShowZonePicker }) {
  const { setState } = useNNWSStore();

  const handleSubmit = async () => {
    try {
      await storeData('yourZone', refZone.current);
      setState((prevState) => ({ ...prevState, yourZone: refZone.current }));
    } catch (error) {
      simpleLogger('ZONEPICKER', error);
    } finally {
      setShowZonePicker(false);
    }
  };

  return (
    <Box w='full'>
      <Select
        onValueChange={(value) => (refZone.current = value)}
        minWidth='200'
        accessibilityLabel='Select Timezone'
        placeholder='Select Timezone'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckCircleIcon size={5} />,
        }}
        mt='1'
      >
        <Select.Item
          value='kdh01'
          label='KOTA SETAR, POKOK SENA DAN KUBANG PASU'
        />
        <Select.Item value='kdh02' label='KUALA MUDA, PENDANG DAN YAN' />
        <Select.Item value='kdh03' label='PADANG TERAP DAN SIK' />
        <Select.Item value='kdh04' label='BALING' />
        <Select.Item value='kdh05' label='KULIM DAN BANDAR BAHARU' />
        <Select.Item value='kdh06' label='LANGKAWI' />
        <Select.Item value='kdh07' label='GUNUNG JERAI' />
        <Select.Item
          value='ktn01'
          label='JAJAHAN KOTA BHARU, BACHOK, PASIR PUTEH, TUMPAT, PASIR MAS, TANAH MERAH, MACHANG KUALA KRAI DAN GUA MUSANG (DAERAH CHIKU)'
        />
        <Select.Item
          value='ktn03'
          label='JAJAHAN JELI, GUA MUSANG (DAERAH GALAS DAN BERTAM) DAN JAJAHAN KECIL LOJING'
        />
        <Select.Item value='jhr01' label='PULAU AUR DAN PULAU PEMANGGIL' />
        <Select.Item
          value='jhr02'
          label='KOTA TINGGI, MERSING DAN JOHOR BAHRU'
        />
        <Select.Item value='jhr03' label='KLUANG DAN PONTIAN' />
        <Select.Item
          value='jhr04'
          label='BATU PAHAT, MUAR, SEGAMAT DAN GEMAS JOHOR'
        />
        <Select.Item value='mlk01' label='Seluruh Negeri Melaka' />
        <Select.Item value='ngs01' label='JEMPOL DAN TAMPIN' />
        <Select.Item
          value='ngs01'
          label='PORT DICKSON, SEREMBAN, KUALA PILAH, JELEBU DAN REMBAU'
        />
        <Select.Item value='phg01' label='PULAU TIOMAN' />
        <Select.Item
          value='phg02'
          label='ROMPIN, PEKAN, MUADZAM SHAH DAN KUANTAN'
        />
        <Select.Item
          value='phg03'
          label='MARAN, CHENOR, TEMERLOH, BERA, JENGKA DAN JERANTUT'
        />
        <Select.Item value='phg04' label='BENTONG, RAUB DAN LIPIS' />
        <Select.Item
          value='phg05'
          label='BUKIT TINGGI, GENTING SEMPAH, DAN JANDA BAIK'
        />
        <Select.Item
          value='phg06'
          label='CAMERON HIGHLANDS, BUKIT FRASER DAN GENTING HIGHLANDS'
        />

        <Select.Item
          value='prk01'
          label='TAPAH, SLIM RIVER DAN TANJUNG MALIM'
        />
        <Select.Item
          value='prk02'
          label='IPOH, BATU GAJAH, KAMPAR, SG. SIPUT DAN KUALA KANGSAR'
        />
        <Select.Item value='prk03' label='PENGKALAN HULU, GERIK DAN LENGGONG' />
        <Select.Item value='prk04' label='TEMENGOR DAN BELUM' />
        <Select.Item
          value='prk05'
          label='TELUK INTAN, BAGAN DATUK, KG. GAJAH, SERI ISKANDAR, BERUAS, PARIT, LUMUT, SITIAWAN DAN PULAU PANGKOR'
        />
        <Select.Item
          value='prk06'
          label='SELAMA, TAIPING, BAGAN SERAI DAN PARIT BUNTAR'
        />
        <Select.Item value='prk07' label='BUKIT LARUT' />
        <Select.Item value='pls01' label='Seluruh negeri Perlis' />
        <Select.Item value='png01' label='Seluruh negeri Pulau Pinang' />
        <Select.Item
          value='sbh01'
          label='BAHAGIAN SANDAKAN (TIMUR) BANDAR SANDAKAN, BUKIT GARAM, SEMAWANG, TEMANGGONG DAN TAMBISAN'
        />
        <Select.Item
          value='sbh02'
          label='BAHAGIAN SANDAKAN (BARAT) PINANGAH, TERUSAN, BELURAN, KUAMUT DAN TELUPID'
        />
        <Select.Item
          value='sbh03'
          label='BAHAGIAN TAWAU (TIMUR) LAHAD DATU, KUNAK, SILABUKAN, TUNGKU, SAHABAT, DAN SEMPORNA'
        />
        <Select.Item
          value='sbh04'
          label='BAHAGIAN TAWAU (BARAT), BANDAR TAWAU, BALONG, MEROTAI DAN KALABAKAN'
        />
        <Select.Item
          value='sbh05'
          label='BAHAGIAN KUDAT KUDAT, KOTA MARUDU, PITAS DAN PULAU BANGGI'
        />
        <Select.Item value='sbh06' label='GUNUNG KINABALU' />
        <Select.Item
          value='sbh07'
          label='BAHAGIAN PANTAI BARAT KOTA KINABALU, PENAMPANG, TUARAN, PAPAR, KOTA BELUD, PUTATAN DAN RANAU'
        />
        <Select.Item
          value='sbh08'
          label='BAHAGIAN PEDALAMAN (ATAS) PENSIANGAN, KENINGAU, TAMBUNAN DAN NABAWAN'
        />
        <Select.Item
          value='sbh09'
          label='BAHAGIAN PEDALAMAN (BAWAH) SIPITANG, MEMBAKUT, BEAUFORT, KUALA PENYU, WESTON, TENOM DAN LONG PA SIA'
        />
        <Select.Item value='swk01' label='LIMBANG, SUNDAR, TRUSAN DAN LAWAS' />
        <Select.Item
          value='swk02'
          label='NIAH, SIBUTI, MIRI, BEKENU DAN MARUDI'
        />
        <Select.Item
          value='swk03'
          label='TATAU, SUAI, BELAGA, PANDAN, SEBAUH, BINTULU'
        />
        <Select.Item
          value='swk04'
          label='IGAN, KANOWIT, SIBU, DALAT, OYA, BALINGIAN, MUKAH, KAPIT DAN SONG'
        />
        <Select.Item
          value='swk05'
          label='BELAWAI, MATU, DARO, SARIKEI, JULAU, BINTANGOR DAN RAJANG'
        />
        <Select.Item
          value='swk06'
          label='KABONG, LINGGA, SRI AMAN, ENGKELILI, BETONG, SPAOH, PUSA, SARATOK, ROBAN, DEBAK DAN LUBOK ANTU'
        />
        <Select.Item
          value='swk07'
          label='SAMARAHAN, SIMUNJAN, SERIAN, SEBUYAU DAN MELUDAM'
        />
        <Select.Item value='swk08' label='KUCHING, BAU, LUNDU DAN SEMATAN' />
        <Select.Item value='swk09' label='KAMPUNG PATARIKAN' />
        <Select.Item
          value='sgr01'
          label='HULU SELANGOR, GOMBAK, PETALING/SHAH ALAM, HULU LANGAT DAN SEPANG'
        />
        <Select.Item value='sgr02' label='SABAK BERNAM DAN KUALA SELANGOR' />
        <Select.Item value='sgr03' label='KLANG DAN KUALA LANGAT' />
        <Select.Item
          value='trg01'
          label='KUALA TERENGGANU, MARANG DAN KUALA NERUS'
        />
        <Select.Item value='trg02' label='BESUT DAN SETIU' />
        <Select.Item value='trg03' label='HULU TERENGGANU' />
        <Select.Item value='trg04' label='DUNGUN DAN KEMAMAN' />
        <Select.Item value='wly01' label='Kuala Lumpur dan Putrajaya' />
        <Select.Item value='wly02' label='Labuan' />
      </Select>
      <Button marginTop={4} backgroundColor='violet.500' onPress={handleSubmit}>
        Set Timezone
      </Button>
    </Box>
  );
}
