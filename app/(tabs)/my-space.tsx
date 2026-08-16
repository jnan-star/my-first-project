import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Label, ScreenHeader } from '@/components/common/UI';
import { DogMascot } from '@/components/common/DogMascot';
import { colors } from '@/constants/theme';
import { usePlannerStore } from '@/store/usePlannerStore';

type Destination = {
  id: string;
  city: string;
  country: string;
  emoji: string;
  cost: number;
  x: `${number}%`;
  y: `${number}%`;
  tint: string;
  note: string;
};

const destinations: Destination[] = [
  { id: 'london', city: 'London', country: 'United Kingdom', emoji: '☂', cost: 120, x: '42%', y: '31%', tint: '#AFC1BA', note: 'Rainy parks, red buses and a very proper afternoon tea.' },
  { id: 'paris', city: 'Paris', country: 'France', emoji: '✦', cost: 180, x: '45%', y: '43%', tint: '#E8B8AE', note: 'Croissants at sunrise and a slow walk beside the Seine.' },
  { id: 'iceland', city: 'Reykjavík', country: 'Iceland', emoji: '❄', cost: 220, x: '34%', y: '16%', tint: '#A9C8D2', note: 'Waterfalls, woolly blankets and a chance to see the northern lights.' },
  { id: 'new-york', city: 'New York', country: 'United States', emoji: '★', cost: 280, x: '18%', y: '39%', tint: '#E5BC72', note: 'Big parks, tiny bagel crumbs and a skyline full of lights.' },
  { id: 'cape-town', city: 'Cape Town', country: 'South Africa', emoji: '☀', cost: 260, x: '49%', y: '75%', tint: '#D99672', note: 'Ocean air, mountain trails and the softest golden sunset.' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', emoji: '◉', cost: 320, x: '83%', y: '43%', tint: '#D9A4B1', note: 'Quiet gardens, bright crossings and a pocket full of new memories.' },
];

export default function MySpace() {
  const store = usePlannerStore();
  const [tab, setTab] = useState<'World Tour' | 'Rewards'>('World Tour');
  const [selectedId, setSelectedId] = useState('paris');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPick, setAiPick] = useState<Destination | null>(null);
  const selected = destinations.find((item) => item.id === selectedId) ?? destinations[1];
  const visited = store.visitedDestinations ?? ['london'];
  const travelFund = store.travelFund ?? 140;
  const current = destinations.find((item) => item.id === (store.currentDestination ?? 'london')) ?? destinations[0];
  const canTravel = travelFund >= selected.cost;

  const askTravelAI = () => {
    const prompt = aiPrompt.toLowerCase();
    const matches: [string[], string][] = [
      [['snow', 'cold', 'quiet', 'aurora', '冰', '雪', '安静', '极光'], 'iceland'],
      [['food', 'japan', 'anime', 'city', '日本', '美食', '动漫', '东京'], 'tokyo'],
      [['beach', 'ocean', 'sun', 'nature', '海', '阳光', '自然'], 'cape-town'],
      [['art', 'romantic', 'bread', '浪漫', '艺术', '面包', '巴黎'], 'paris'],
      [['shopping', 'busy', 'skyline', '购物', '热闹', '纽约'], 'new-york'],
      [['park', 'rain', 'classic', '公园', '下雨', '伦敦'], 'london'],
    ];
    const match = matches.find(([words]) => words.some((word) => prompt.includes(word)))?.[1];
    const affordable = destinations.filter((destination) => !visited.includes(destination.id)).sort((a, b) => Math.abs(a.cost - travelFund) - Math.abs(b.cost - travelFund))[0];
    const pick = destinations.find((destination) => destination.id === match) ?? affordable ?? destinations[0];
    setAiPick(pick);
    setSelectedId(pick.id);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          eyebrow="Small steps, big world"
          title="Dog's World Tour"
          right={<View style={styles.wallet}><Text style={styles.coinDot}>●</Text><Text style={styles.walletText}>{store.coins}</Text></View>}
        />

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>NEXT STOP</Text>
            <Text style={styles.heroTitle}>{selected.city}</Text>
            <Text style={styles.heroText}>Help your Old English Sheepdog save up, pack a tiny suitcase and see the world.</Text>
          </View>
          <View style={styles.heroDog}><DogMascot size={126} pose="traveling" /></View>
          <View style={styles.cloudOne} /><View style={styles.cloudTwo} />
        </View>

        <View style={styles.mainTabs}>
          {(['World Tour', 'Rewards'] as const).map((value) => (
            <Pressable key={value} onPress={() => setTab(value)} style={[styles.mainTab, tab === value && styles.mainTabOn]}>
              <Ionicons name={value === 'World Tour' ? 'earth-outline' : 'gift-outline'} size={18} color={tab === value ? colors.ink : colors.muted} />
              <Text style={[styles.mainTabText, tab === value && styles.mainTabTextOn]}>{value}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'World Tour' ? (
          <>
            <Card style={styles.fundCard}>
              <View style={styles.fundTop}>
                <View>
                  <Label>Travel fund</Label>
                  <View style={styles.fundAmountRow}><Text style={styles.fundDot}>●</Text><Text style={styles.fundAmount}>{travelFund}</Text></View>
                </View>
                <View style={styles.fundCopy}><Text style={styles.fundCopyTitle}>Every little bit becomes a new memory.</Text><Text style={styles.fundCopySub}>Move coins from your wallet into the travel jar.</Text></View>
              </View>
              <View style={styles.fundButtons}>
                {[20, 50, 100].map((amount) => (
                  <Pressable key={amount} disabled={store.coins < amount} onPress={() => store.fundTravel(amount)} style={({ pressed }) => [styles.fundButton, store.coins < amount && styles.disabled, pressed && { opacity: 0.7 }]}>
                    <Text style={styles.fundButtonText}>+ {amount}</Text>
                  </Pressable>
                ))}
              </View>
            </Card>

            <View style={styles.aiCard}>
              <View style={styles.aiHead}>
                <View style={styles.aiIcon}><Text style={styles.aiSparkle}>✦</Text></View>
                <View style={{ flex: 1 }}><Text style={styles.aiKicker}>AI TRAVEL ASSISTANT</Text><Text style={styles.aiTitle}>Where should doggo go next?</Text></View>
              </View>
              <Text style={styles.aiHelp}>Describe the mood, weather, food or budget you want. English and Chinese both work.</Text>
              <TextInput
                value={aiPrompt}
                onChangeText={setAiPrompt}
                multiline
                placeholder="例如：想去安静、有雪、可以看极光的地方，预算 250…"
                placeholderTextColor="#9A9C96"
                style={styles.aiInput}
              />
              <Pressable disabled={!aiPrompt.trim()} onPress={askTravelAI} style={({ pressed }) => [styles.aiButton, !aiPrompt.trim() && styles.aiButtonDisabled, pressed && { opacity: 0.76 }]}>
                <Text style={styles.aiButtonText}>✦ Ask AI to plan a trip</Text>
              </Pressable>
              {aiPick && (
                <View style={styles.aiResult}>
                  <View style={[styles.aiResultBadge, { backgroundColor: aiPick.tint }]}><Text style={styles.aiResultEmoji}>{aiPick.emoji}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiResultLabel}>MY RECOMMENDATION</Text>
                    <Text style={styles.aiResultTitle}>{aiPick.city} · {aiPick.cost} coins</Text>
                    <Text style={styles.aiResultText}>{aiPick.note} You need {Math.max(0, aiPick.cost - travelFund)} more coins in the travel fund.</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.green} />
                </View>
              )}
            </View>

            <View style={styles.sectionHeading}>
              <View><Label>Choose the next adventure</Label><Text style={styles.sectionNote}>Tap a pin to peek at the trip.</Text></View>
              <Text style={styles.tripCount}>{visited.length}/{destinations.length} visited</Text>
            </View>

            <WorldMap selectedId={selectedId} visited={visited} currentId={current.id} onSelect={setSelectedId} />

            <Card style={{ ...styles.tripCard, borderColor: selected.tint }}>
              <View style={[styles.destinationBadge, { backgroundColor: selected.tint }]}><Text style={styles.destinationEmoji}>{selected.emoji}</Text></View>
              <View style={styles.tripCopy}>
                <Text style={styles.country}>{selected.country.toUpperCase()}</Text>
                <Text style={styles.city}>{selected.city}</Text>
                <Text style={styles.tripNote}>{selected.note}</Text>
              </View>
              <View style={styles.tripBottom}>
                <View>
                  <Text style={styles.costLabel}>TRIP COST</Text>
                  <Text style={styles.cost}>● {selected.cost}</Text>
                </View>
                <Pressable disabled={!canTravel} onPress={() => store.startTrip(selected.id, selected.cost)} style={({ pressed }) => [styles.travelButton, !canTravel && styles.travelButtonDisabled, pressed && { opacity: 0.76 }]}>
                  <Text style={styles.travelButtonText}>{canTravel ? (visited.includes(selected.id) ? 'Visit again' : 'Send doggo') : `${selected.cost - travelFund} more needed`}</Text>
                  {canTravel && <Ionicons name="airplane" size={16} color="#fff" />}
                </Pressable>
              </View>
            </Card>

            <View style={styles.journeyStatus}>
              <View style={styles.statusIcon}><Ionicons name="location" size={18} color={colors.green} /></View>
              <View style={{ flex: 1 }}><Text style={styles.statusLabel}>CURRENTLY EXPLORING</Text><Text style={styles.statusTitle}>{current.city}, {current.country}</Text></View>
              <Text style={styles.statusEmoji}>{current.emoji}</Text>
            </View>
          </>
        ) : (
          <Rewards />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function WorldMap({ selectedId, visited, currentId, onSelect }: { selectedId: string; visited: string[]; currentId: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.map}>
      <View style={styles.mapSun} />
      <View style={[styles.mapCloud, { left: '8%', top: '15%' }]} /><View style={[styles.mapCloud, { right: '8%', bottom: '14%', transform: [{ scale: 0.7 }] }]} />
      <View style={[styles.land, styles.americaNorth]} /><View style={[styles.land, styles.americaSouth]} />
      <View style={[styles.land, styles.europe]} /><View style={[styles.land, styles.africa]} /><View style={[styles.land, styles.asia]} /><View style={[styles.land, styles.australia]} />
      <View style={styles.routeOne} /><View style={styles.routeTwo} /><View style={styles.routeThree} />
      {destinations.map((item) => {
        const isVisited = visited.includes(item.id);
        const isSelected = selectedId === item.id;
        return (
          <Pressable key={item.id} onPress={() => onSelect(item.id)} style={[styles.pinWrap, { left: item.x, top: item.y }, isSelected && styles.pinSelected]}>
            <View style={[styles.pin, isVisited && styles.pinVisited, isSelected && { backgroundColor: item.tint }]}>
              <Text style={styles.pinEmoji}>{isVisited ? '✓' : item.emoji}</Text>
            </View>
            <Text style={[styles.pinLabel, isSelected && styles.pinLabelSelected]}>{item.city}</Text>
          </Pressable>
        );
      })}
      <View style={[styles.currentDog, { left: destinations.find((d) => d.id === currentId)?.x ?? '42%', top: '55%' }]}><DogMascot size={70} pose="traveling" /></View>
    </View>
  );
}

function Rewards() {
  const store = usePlannerStore();
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  const addReward = () => {
    const amount = Number(cost);
    if (!title.trim() || !amount || amount < 1) return;
    store.addReward(title.trim(), amount);
    setTitle('');
    setCost('');
  };

  return (
    <>
      <View style={styles.rewardHero}>
        <View style={styles.rewardHeroCopy}>
          <Text style={styles.rewardEyebrow}>YOUR COINS, YOUR CHOICE</Text>
          <Text style={styles.rewardHeroTitle}>Choose something kind for yourself.</Text>
          <Text style={styles.rewardHeroText}>Create rewards that actually feel good. Progress earns coins; you decide what they mean.</Text>
        </View>
        <View style={styles.rewardGift}><Ionicons name="gift" size={32} color="#B96F5D" /></View>
      </View>

      <Card style={styles.createReward}>
        <Label>Create your own reward</Label>
        <Text style={styles.createHelp}>Anything from a slow coffee to a guilt-free afternoon off.</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="What would feel rewarding?" placeholderTextColor="#9B9C96" style={styles.rewardInput} />
        <View style={styles.costRow}>
          <TextInput value={cost} onChangeText={setCost} keyboardType="number-pad" placeholder="Coin cost" placeholderTextColor="#9B9C96" style={[styles.rewardInput, { flex: 1 }]} />
          <Pressable disabled={!title.trim() || !Number(cost)} onPress={addReward} style={({ pressed }) => [styles.addRewardButton, (!title.trim() || !Number(cost)) && styles.aiButtonDisabled, pressed && { opacity: 0.75 }]}>
            <Ionicons name="add" size={18} color="#fff" /><Text style={styles.addRewardText}>Add reward</Text>
          </Pressable>
        </View>
      </Card>

      <View style={styles.rewardListHeading}><View><Label>My rewards</Label><Text style={styles.sectionNote}>Tap redeem when the moment feels right.</Text></View><Text style={styles.rewardBalance}>● {store.coins} available</Text></View>
      <View style={styles.rewardList}>
        {store.rewards.map((reward, index) => (
          <View key={reward.id} style={styles.rewardItem}>
            <View style={[styles.rewardItemIcon, { backgroundColor: ['#F1DFD6', '#E2E9DC', '#E4E3F0'][index % 3] }]}><Ionicons name={index % 2 ? 'cafe-outline' : 'sparkles-outline'} size={19} color={colors.ink} /></View>
            <View style={{ flex: 1 }}><Text style={styles.rewardTitle}>{reward.title}</Text><Text style={styles.rewardCost}>● {reward.cost} coins</Text></View>
            <Pressable disabled={store.coins < reward.cost || redeemedId === reward.id} onPress={() => { store.redeemReward(reward.cost); setRedeemedId(reward.id); }} style={[styles.redeemButton, (store.coins < reward.cost || redeemedId === reward.id) && styles.disabled]}>
              <Text style={styles.redeemText}>{redeemedId === reward.id ? 'Enjoy! ✓' : 'Redeem'}</Text>
            </Pressable>
            <Pressable accessibilityLabel={`Delete ${reward.title}`} onPress={() => store.deleteReward(reward.id)} style={styles.deleteReward}><Ionicons name="trash-outline" size={17} color={colors.muted} /></Pressable>
          </View>
        ))}
        {!store.rewards.length && <View style={styles.emptyRewards}><Ionicons name="heart-outline" size={28} color={colors.muted} /><Text style={styles.emptyRewardText}>Your first reward can be wonderfully small.</Text></View>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5EF' },
  page: { width: '100%', maxWidth: 920, alignSelf: 'center', padding: 20, paddingBottom: 120 },
  wallet: { flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: '#F3EACD', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20 },
  coinDot: { color: '#B59242', fontSize: 10 }, walletText: { fontSize: 13, fontWeight: '800', color: colors.ink },
  hero: { height: 210, borderRadius: 28, backgroundColor: '#DCE9E4', overflow: 'hidden', marginBottom: 15, position: 'relative', borderWidth: 1, borderColor: '#CEDDD7' },
  heroGlow: { position: 'absolute', right: -30, top: -70, width: 220, height: 220, borderRadius: 120, backgroundColor: '#F4DC9D', opacity: 0.58 },
  heroCopy: { padding: 24, width: '60%', zIndex: 3 }, heroKicker: { fontSize: 10, letterSpacing: 1.5, color: '#667C74', fontWeight: '800' },
  heroTitle: { fontSize: 35, color: colors.ink, fontWeight: '800', marginTop: 4, letterSpacing: -1 }, heroText: { fontSize: 12, lineHeight: 18, color: '#64716D', marginTop: 8, maxWidth: 330 },
  heroDog: { position: 'absolute', right: '7%', bottom: 8, zIndex: 4 }, cloudOne: { position: 'absolute', right: '20%', top: 21, width: 52, height: 17, borderRadius: 12, backgroundColor: 'rgba(255,255,255,.58)' }, cloudTwo: { position: 'absolute', left: '43%', bottom: 23, width: 37, height: 12, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.45)' },
  mainTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 }, mainTab: { flex: 1, minHeight: 47, flexDirection: 'row', gap: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  mainTabOn: { backgroundColor: '#E8EFEA', borderColor: '#C7D7CE' }, mainTabText: { fontSize: 13, fontWeight: '700', color: colors.muted }, mainTabTextOn: { color: colors.ink },
  fundCard: { padding: 17, marginBottom: 21 }, fundTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 18 },
  fundAmountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }, fundDot: { fontSize: 11, color: '#B59242' }, fundAmount: { fontSize: 27, fontWeight: '800', color: colors.ink },
  fundCopy: { flex: 1, maxWidth: 330 }, fundCopyTitle: { fontSize: 12, lineHeight: 17, color: colors.ink, fontWeight: '700' }, fundCopySub: { fontSize: 10, lineHeight: 15, color: colors.muted, marginTop: 3 },
  fundButtons: { flexDirection: 'row', gap: 8, marginTop: 14 }, fundButton: { flex: 1, backgroundColor: '#F1ECDD', borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E0D6BD' }, fundButtonText: { fontSize: 12, fontWeight: '800', color: '#7D6B3C' }, disabled: { opacity: 0.35 },
  aiCard: { backgroundColor: '#343B38', borderRadius: 23, padding: 17, marginBottom: 22, overflow: 'hidden' }, aiHead: { flexDirection: 'row', alignItems: 'center', gap: 11 }, aiIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#51645B', alignItems: 'center', justifyContent: 'center' }, aiSparkle: { color: '#F0D389', fontSize: 20 }, aiKicker: { fontSize: 8, letterSpacing: 1.2, color: '#AFC2B9', fontWeight: '800' }, aiTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 3 }, aiHelp: { color: '#C5CCC8', fontSize: 10, lineHeight: 16, marginTop: 12 },
  aiInput: { minHeight: 82, backgroundColor: '#FAF8F2', color: colors.ink, borderRadius: 14, padding: 13, fontSize: 12, lineHeight: 18, marginTop: 11, textAlignVertical: 'top' }, aiButton: { minHeight: 43, marginTop: 9, borderRadius: 13, backgroundColor: '#819D8F', alignItems: 'center', justifyContent: 'center' }, aiButtonDisabled: { opacity: 0.36 }, aiButtonText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  aiResult: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F1F4EF', padding: 11, borderRadius: 14, marginTop: 10 }, aiResultBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, aiResultEmoji: { color: '#fff', fontSize: 17, fontWeight: '800' }, aiResultLabel: { fontSize: 7, color: colors.green, fontWeight: '900', letterSpacing: 1 }, aiResultTitle: { fontSize: 12, color: colors.ink, fontWeight: '800', marginTop: 2 }, aiResultText: { fontSize: 9, lineHeight: 13, color: colors.muted, marginTop: 2 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 11 }, sectionNote: { fontSize: 11, color: colors.muted, marginTop: 5 }, tripCount: { fontSize: 11, color: colors.green, fontWeight: '800' },
  map: { height: 360, borderRadius: 28, backgroundColor: '#CFE2E1', borderWidth: 1, borderColor: '#BFD3D2', overflow: 'hidden', position: 'relative', marginBottom: 14 },
  mapSun: { position: 'absolute', right: 22, top: 18, width: 35, height: 35, borderRadius: 20, backgroundColor: '#F2D58B', opacity: 0.75 }, mapCloud: { position: 'absolute', width: 55, height: 16, borderRadius: 10, backgroundColor: 'rgba(255,255,255,.5)' },
  land: { position: 'absolute', backgroundColor: '#DCE2C8', borderColor: '#B8C3A8', borderWidth: 1, opacity: 0.98 },
  americaNorth: { left: '8%', top: '24%', width: '23%', height: '28%', borderTopLeftRadius: 55, borderTopRightRadius: 28, borderBottomLeftRadius: 18, borderBottomRightRadius: 45, transform: [{ rotate: '-8deg' }] },
  americaSouth: { left: '24%', top: '51%', width: '13%', height: '32%', borderTopLeftRadius: 30, borderTopRightRadius: 12, borderBottomLeftRadius: 50, borderBottomRightRadius: 18, transform: [{ rotate: '-16deg' }] },
  europe: { left: '43%', top: '25%', width: '15%', height: '18%', borderTopLeftRadius: 26, borderTopRightRadius: 35, borderBottomLeftRadius: 19, borderBottomRightRadius: 26 },
  africa: { left: '44%', top: '42%', width: '18%', height: '36%', borderTopLeftRadius: 35, borderTopRightRadius: 30, borderBottomLeftRadius: 45, borderBottomRightRadius: 50, transform: [{ rotate: '4deg' }] },
  asia: { left: '55%', top: '22%', width: '33%', height: '32%', borderTopLeftRadius: 45, borderTopRightRadius: 55, borderBottomLeftRadius: 28, borderBottomRightRadius: 48, transform: [{ rotate: '3deg' }] },
  australia: { right: '8%', bottom: '13%', width: '16%', height: '17%', borderRadius: 35, transform: [{ rotate: '-8deg' }] },
  routeOne: { position: 'absolute', left: '25%', top: '37%', width: '22%', height: 30, borderTopWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(87,113,108,.45)', borderRadius: 50, transform: [{ rotate: '-7deg' }] },
  routeTwo: { position: 'absolute', left: '47%', top: '37%', width: '35%', height: 36, borderTopWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(87,113,108,.45)', borderRadius: 50, transform: [{ rotate: '2deg' }] },
  routeThree: { position: 'absolute', left: '46%', top: '48%', width: 15, height: '27%', borderLeftWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(87,113,108,.45)', transform: [{ rotate: '-10deg' }] },
  pinWrap: { position: 'absolute', width: 74, marginLeft: -27, marginTop: -17, alignItems: 'center', zIndex: 5 }, pinSelected: { zIndex: 10, transform: [{ scale: 1.08 }] },
  pin: { width: 29, height: 29, borderRadius: 16, backgroundColor: '#FAF7F0', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#4F625C', shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }, pinVisited: { backgroundColor: '#6F9382' }, pinEmoji: { fontSize: 11, fontWeight: '900', color: '#46554F' }, pinLabel: { fontSize: 8, color: '#52635D', fontWeight: '700', marginTop: 2, backgroundColor: 'rgba(247,245,239,.7)', paddingHorizontal: 4, borderRadius: 4 }, pinLabelSelected: { fontSize: 9, color: colors.ink },
  currentDog: { position: 'absolute', zIndex: 7, marginLeft: -25, marginTop: -8, transform: [{ scale: 0.72 }] },
  tripCard: { padding: 16, borderWidth: 1.5, marginBottom: 11, position: 'relative' }, destinationBadge: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 16, top: 16 }, destinationEmoji: { fontSize: 20, color: '#fff', fontWeight: '800' },
  tripCopy: { paddingRight: 58 }, country: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1, color: colors.muted }, city: { fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 3 }, tripNote: { fontSize: 11, lineHeight: 17, color: colors.muted, marginTop: 5, maxWidth: 530 },
  tripBottom: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, costLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: colors.muted }, cost: { fontSize: 14, fontWeight: '800', color: '#9B7937', marginTop: 3 },
  travelButton: { minWidth: 148, minHeight: 43, paddingHorizontal: 17, borderRadius: 13, backgroundColor: '#596E65', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }, travelButtonDisabled: { backgroundColor: '#D7D5CE' }, travelButtonText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  journeyStatus: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#EDF2ED', borderRadius: 16, padding: 13, borderWidth: 1, borderColor: '#D7E1D8' }, statusIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: '#DCE8DE', alignItems: 'center', justifyContent: 'center' }, statusLabel: { fontSize: 8, letterSpacing: 1, color: colors.muted, fontWeight: '800' }, statusTitle: { fontSize: 12, fontWeight: '700', color: colors.ink, marginTop: 3 }, statusEmoji: { fontSize: 20 },
  rewardHero: { minHeight: 150, borderRadius: 23, backgroundColor: '#F0DFD6', padding: 20, marginBottom: 14, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' }, rewardHeroCopy: { width: '76%', zIndex: 2 }, rewardEyebrow: { fontSize: 8, letterSpacing: 1.3, color: '#A26252', fontWeight: '900' }, rewardHeroTitle: { fontSize: 22, lineHeight: 27, color: colors.ink, fontWeight: '800', marginTop: 4 }, rewardHeroText: { fontSize: 10, lineHeight: 15, color: '#7F6C65', marginTop: 6 }, rewardGift: { position: 'absolute', right: 19, width: 65, height: 65, borderRadius: 22, backgroundColor: '#F7ECE6', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '7deg' }] },
  createReward: { padding: 16, gap: 9, marginBottom: 20 }, createHelp: { fontSize: 10, color: colors.muted, lineHeight: 15 }, rewardInput: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FAF8F2', paddingHorizontal: 12, color: colors.ink, fontSize: 12 }, costRow: { flexDirection: 'row', gap: 8 }, addRewardButton: { minWidth: 132, borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#596E65', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }, addRewardText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  rewardListHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 11 }, rewardBalance: { fontSize: 10, color: '#9B7937', fontWeight: '800' }, rewardList: { gap: 8 }, rewardItem: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, padding: 11 }, rewardItemIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, rewardTitle: { fontSize: 13, fontWeight: '800', color: colors.ink }, rewardCost: { fontSize: 9, color: '#9B7937', fontWeight: '700', marginTop: 3 }, redeemButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10, backgroundColor: '#E2EBDD' }, redeemText: { fontSize: 9, color: colors.green, fontWeight: '900' }, deleteReward: { width: 29, height: 29, alignItems: 'center', justifyContent: 'center' }, emptyRewards: { minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line }, emptyRewardText: { fontSize: 11, color: colors.muted },
});
