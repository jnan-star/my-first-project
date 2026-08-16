import { StyleSheet, View } from 'react-native';

type DogMascotProps = {
  size?: number;
  pose?: 'sitting' | 'sleeping' | 'traveling';
};

const fur = {
  ink: '#4B4B49',
  grey: '#8F9797',
  greyDark: '#667070',
  white: '#F7F4ED',
  cream: '#E9E4DA',
  blue: '#87A8B1',
  scarf: '#D98969',
};

export function DogMascot({ size = 88, pose = 'sitting' }: DogMascotProps) {
  if (pose === 'sleeping') return <SleepingSheepdog size={size} />;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={styles.tail} />
      <View style={styles.body}>
        <View style={styles.bodyWhitePatch} />
        <View style={[styles.furPuff, styles.bodyPuffOne]} />
        <View style={[styles.furPuff, styles.bodyPuffTwo]} />
        <View style={[styles.leg, styles.legLeft]}><View style={styles.pawLine} /></View>
        <View style={[styles.leg, styles.legRight]}><View style={styles.pawLine} /></View>
      </View>

      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />
      <View style={styles.head}>
        <View style={styles.greyFacePatch} />
        <View style={[styles.headPuff, styles.headPuffOne]} />
        <View style={[styles.headPuff, styles.headPuffTwo]} />
        <View style={[styles.headPuff, styles.headPuffThree]} />
        <View style={[styles.fringe, styles.fringeLeft]} />
        <View style={[styles.fringe, styles.fringeMiddle]} />
        <View style={[styles.fringe, styles.fringeRight]} />
        <View style={[styles.eye, styles.eyeLeft]}><View style={styles.eyeShine} /></View>
        <View style={[styles.eye, styles.eyeRight]}><View style={styles.eyeShine} /></View>
        <View style={styles.muzzle}><View style={styles.nose} /><View style={styles.smile} /></View>
      </View>

      <View style={styles.collar}><View style={styles.tag} /></View>
      {pose === 'traveling' && (
        <>
          <View style={styles.scarf}><View style={styles.scarfTail} /></View>
          <View style={styles.suitcase}><View style={styles.caseHandle} /><View style={styles.caseStripe} /></View>
        </>
      )}
    </View>
  );
}

function SleepingSheepdog({ size }: { size: number }) {
  return (
    <View style={[styles.sleepWrap, { width: size, height: size * 0.66 }]}>
      <View style={styles.sleepTail} />
      <View style={styles.sleepBody}>
        <View style={[styles.furPuff, styles.sleepPuffOne]} />
        <View style={[styles.furPuff, styles.sleepPuffTwo]} />
      </View>
      <View style={styles.sleepHead}>
        <View style={styles.sleepPatch} />
        <View style={[styles.fringe, styles.sleepFringeOne]} />
        <View style={[styles.fringe, styles.sleepFringeTwo]} />
        <View style={styles.closedEye} />
        <View style={styles.sleepNose} />
      </View>
      <View style={styles.sleepPaw} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  body: { position: 'absolute', left: '20%', right: '12%', bottom: '3%', height: '48%', borderRadius: 25, backgroundColor: fur.grey, borderWidth: 1.5, borderColor: fur.ink, overflow: 'hidden' },
  bodyWhitePatch: { position: 'absolute', left: '-7%', top: '-4%', width: '46%', height: '115%', borderRadius: 24, backgroundColor: fur.white },
  furPuff: { position: 'absolute', borderRadius: 20, backgroundColor: fur.white },
  bodyPuffOne: { width: 21, height: 21, left: 7, top: -6 }, bodyPuffTwo: { width: 19, height: 19, left: 17, bottom: -6 },
  leg: { position: 'absolute', bottom: '-5%', width: '26%', height: '45%', borderRadius: 12, backgroundColor: fur.white, borderWidth: 1.3, borderColor: fur.ink },
  legLeft: { left: '12%' }, legRight: { right: '10%' }, pawLine: { position: 'absolute', left: 4, right: 4, bottom: 5, height: 1, backgroundColor: fur.cream },
  tail: { position: 'absolute', right: '1%', bottom: '22%', width: '27%', height: '25%', borderTopWidth: 7, borderRightWidth: 7, borderColor: fur.white, borderRadius: 22, transform: [{ rotate: '18deg' }] },
  head: { position: 'absolute', left: '13%', top: '2%', width: '68%', height: '59%', borderRadius: 28, backgroundColor: fur.white, borderWidth: 1.5, borderColor: fur.ink, zIndex: 5, overflow: 'hidden' },
  greyFacePatch: { position: 'absolute', left: '-4%', top: '-8%', width: '49%', height: '90%', borderRadius: 24, backgroundColor: fur.grey },
  ear: { position: 'absolute', top: '9%', width: '27%', height: '39%', borderRadius: 20, backgroundColor: fur.greyDark, borderWidth: 1.5, borderColor: fur.ink, zIndex: 3 },
  earLeft: { left: '5%', transform: [{ rotate: '12deg' }] }, earRight: { right: '7%', transform: [{ rotate: '-11deg' }] },
  headPuff: { position: 'absolute', top: -8, borderRadius: 22, backgroundColor: fur.white },
  headPuffOne: { left: '5%', width: 25, height: 25 }, headPuffTwo: { left: '34%', width: 28, height: 28, top: -12 }, headPuffThree: { right: '3%', width: 25, height: 25 },
  fringe: { position: 'absolute', top: '5%', width: '29%', height: '48%', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, backgroundColor: fur.white, zIndex: 6 },
  fringeLeft: { left: '10%', transform: [{ rotate: '10deg' }], backgroundColor: '#D7D9D5' },
  fringeMiddle: { left: '35%', height: '52%', transform: [{ rotate: '-3deg' }] }, fringeRight: { right: '8%', transform: [{ rotate: '-12deg' }] },
  eye: { position: 'absolute', top: '48%', width: 7, height: 8, borderRadius: 5, backgroundColor: fur.ink, zIndex: 7 },
  eyeLeft: { left: '27%', backgroundColor: fur.blue }, eyeRight: { right: '24%' }, eyeShine: { position: 'absolute', width: 2.5, height: 2.5, borderRadius: 2, backgroundColor: '#fff', left: 1, top: 1 },
  muzzle: { position: 'absolute', left: '31%', bottom: '3%', width: '45%', height: '34%', borderRadius: 20, backgroundColor: fur.cream, zIndex: 8 },
  nose: { width: 10, height: 7, borderRadius: 5, backgroundColor: fur.ink, alignSelf: 'center', marginTop: 2 }, smile: { width: 12, height: 7, borderBottomWidth: 1.4, borderColor: fur.ink, borderRadius: 8, alignSelf: 'center' },
  collar: { position: 'absolute', left: '28%', top: '54%', width: '42%', height: 6, borderRadius: 5, backgroundColor: fur.blue, zIndex: 8 },
  tag: { position: 'absolute', left: '43%', top: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#D9AE57' },
  scarf: { position: 'absolute', left: '24%', top: '51%', width: '52%', height: 10, borderRadius: 7, backgroundColor: fur.scarf, zIndex: 9, transform: [{ rotate: '-3deg' }] },
  scarfTail: { position: 'absolute', right: 4, top: 6, width: 12, height: 28, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: '#C96F55', transform: [{ rotate: '-20deg' }] },
  suitcase: { position: 'absolute', right: '-7%', bottom: '1%', width: '31%', height: '30%', borderRadius: 6, backgroundColor: '#C99A67', borderWidth: 1.5, borderColor: '#715A45', zIndex: 10 },
  caseHandle: { position: 'absolute', left: '28%', right: '28%', top: -7, height: 8, borderWidth: 2, borderBottomWidth: 0, borderColor: '#715A45', borderTopLeftRadius: 4, borderTopRightRadius: 4 }, caseStripe: { position: 'absolute', left: '45%', top: 0, bottom: 0, width: 3, backgroundColor: '#E2C493' },
  sleepWrap: { position: 'relative' },
  sleepBody: { position: 'absolute', left: '14%', right: '0%', bottom: '4%', height: '59%', borderRadius: 30, backgroundColor: fur.grey, borderWidth: 1.5, borderColor: fur.ink, overflow: 'hidden' },
  sleepPuffOne: { left: -5, top: -5, width: 30, height: 30 }, sleepPuffTwo: { left: 13, bottom: -8, width: 30, height: 30 },
  sleepHead: { position: 'absolute', left: '0%', bottom: '1%', width: '48%', height: '78%', borderRadius: 26, backgroundColor: fur.white, borderWidth: 1.5, borderColor: fur.ink, zIndex: 4, overflow: 'hidden' },
  sleepPatch: { position: 'absolute', left: -6, top: -5, width: '58%', height: '86%', borderRadius: 22, backgroundColor: fur.grey },
  sleepFringeOne: { left: '15%', top: '-2%', height: '52%', transform: [{ rotate: '10deg' }], backgroundColor: '#D6D9D5' }, sleepFringeTwo: { left: '39%', top: '-3%', height: '55%', transform: [{ rotate: '-7deg' }] },
  closedEye: { position: 'absolute', right: '20%', top: '49%', width: 11, height: 5, borderBottomWidth: 1.5, borderColor: fur.ink, borderRadius: 8 },
  sleepNose: { position: 'absolute', right: '3%', bottom: '23%', width: 9, height: 7, borderRadius: 5, backgroundColor: fur.ink },
  sleepPaw: { position: 'absolute', left: '28%', bottom: '0%', width: '34%', height: '23%', borderRadius: 13, backgroundColor: fur.white, borderWidth: 1.2, borderColor: fur.ink, zIndex: 5 },
  sleepTail: { position: 'absolute', right: '-2%', bottom: '20%', width: '26%', height: '37%', borderTopWidth: 7, borderRightWidth: 7, borderColor: fur.white, borderRadius: 24, transform: [{ rotate: '25deg' }] },
});
