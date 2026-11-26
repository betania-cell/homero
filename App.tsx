import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Song = {
  title: string;
  artist: string;
  style: string;
  key: string;
  capo: number;
  bpm: number;
  duration: number;
  accent: string;
  chords: string[];
};

type Tab = 'Início' | 'Biblioteca' | 'Prática' | 'Perfil';
type QuickAction = 'Tom' | 'Capotraste' | 'Loop' | 'Metrônomo';

const songs: Song[] = [
  { title: 'Cafeína e Sol', artist: 'Luna Harp', style: 'MPB', key: 'D', capo: 0, bpm: 82, duration: 226, accent: '#8b5cf6', chords: ['D', 'F#m7', 'G', 'A'] },
  { title: 'Vento Fora', artist: 'Silveira', style: 'Pop', key: 'G', capo: 2, bpm: 90, duration: 252, accent: '#22c55e', chords: ['G', 'D', 'Em', 'C'] },
  { title: 'Entre Pontos', artist: 'AsterN', style: 'Indie', key: 'A', capo: 1, bpm: 76, duration: 199, accent: '#f59e0b', chords: ['A', 'E', 'F#m', 'D'] },
  { title: 'Madrugada Azul', artist: 'Pilar Vale', style: 'Folk', key: 'E', capo: 3, bpm: 68, duration: 274, accent: '#38bdf8', chords: ['E', 'B', 'C#m', 'A'] },
];

const genres = ['Todos', 'MPB', 'Pop', 'Indie', 'Folk'];
const quickActions: { label: QuickAction; icon: string; color: string }[] = [
  { label: 'Tom', icon: 'music-note', color: '#8b5cf6' },
  { label: 'Capotraste', icon: 'guitar-pick', color: '#22c55e' },
  { label: 'Loop', icon: 'repeat', color: '#f59e0b' },
  { label: 'Metrônomo', icon: 'metronome', color: '#38bdf8' },
];
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteIndex = (key: string) => notes.indexOf(key.replace('m', '').replace('b', '#'));
const transpose = (chord: string, semitones: number) => {
  const match = chord.match(/^([A-G]#?)(.*)$/);
  if (!match) return chord;
  const index = notes.indexOf(match[1]);
  return index < 0 ? chord : `${notes[(index + semitones + 12) % 12]}${match[2]}`;
};
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function App() {
  const [query, setQuery] = useState('');
  const [activeSong, setActiveSong] = useState<Song>(songs[0]);
  const [activeTab, setActiveTab] = useState<Tab>('Início');
  const [genre, setGenre] = useState('Todos');
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [transposeBy, setTransposeBy] = useState(0);
  const [capo, setCapo] = useState<number | null>(null);
  const [loop, setLoop] = useState(false);
  const [metronome, setMetronome] = useState(false);
  const [modalAction, setModalAction] = useState<QuickAction | null>(null);
  const [sessions, setSessions] = useState(18);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setPosition((current) => {
        if (current + 1 >= activeSong.duration) {
          if (loop) return 0;
          setPlaying(false);
          return activeSong.duration;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, activeSong, loop]);

  const filteredSongs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return songs.filter((song) =>
      (genre === 'Todos' || song.style === genre) &&
      (!term || [song.title, song.artist, song.style, song.key].some((value) => value.toLowerCase().includes(term)))
    );
  }, [query, genre]);

  const selectSong = (song: Song) => {
    setActiveSong(song);
    setPosition(0);
    setPlaying(false);
    setTransposeBy(0);
    setCapo(null);
    setActiveTab('Prática');
    setNotice(`${song.title} selecionada para a prática.`);
  };

  const changeSong = (direction: number) => {
    const currentIndex = songs.findIndex((song) => song.title === activeSong.title);
    const next = (currentIndex + direction + songs.length) % songs.length;
    setActiveSong(songs[next]);
    setPosition(0);
    setTransposeBy(0);
    setCapo(null);
  };

  const startSession = () => {
    setSessions((value) => value + 1);
    setPosition(0);
    setPlaying(false);
    setActiveTab('Prática');
    setNotice(`Nova sessão iniciada com ${activeSong.title}.`);
  };

  const openAction = (action: QuickAction) => {
    if (action === 'Loop') {
      setLoop((value) => !value);
      setNotice(`Loop ${loop ? 'desativado' : 'ativado'}.`);
      return;
    }
    if (action === 'Metrônomo') {
      setMetronome((value) => !value);
      setNotice(`Metrônomo ${metronome ? 'desativado' : `ativado em ${activeSong.bpm} BPM`}.`);
      return;
    }
    setModalAction(action);
  };

  const renderPlayer = () => (
    <View style={styles.playerCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Player de prática</Text>
        <TouchableOpacity style={styles.ghostButton} onPress={() => setNotice('A sincronização ficará disponível quando houver uma faixa de áudio ou cifra vinculada.') }>
          <Text style={styles.ghostButtonText}>Sincronizar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.playerHeader}>
        <View style={styles.songInfo}>
          <Text style={styles.songStyle}>{activeSong.style}</Text>
          <Text style={styles.songTitle}>{activeSong.title}</Text>
          <Text style={styles.songArtist}>{activeSong.artist}</Text>
        </View>
        <View style={styles.scoreBadge}><Text style={styles.scoreText}>PRÁTICA</Text></View>
      </View>
      <View style={styles.playerMetaRow}>
        <View style={styles.metaPill}><Text style={styles.metaLabel}>Tom</Text><Text style={styles.metaValue}>{transpose(activeSong.key, transposeBy)}</Text></View>
        <View style={styles.metaPill}><Text style={styles.metaLabel}>Capo</Text><Text style={styles.metaValue}>{capo ?? activeSong.capo}</Text></View>
        <View style={styles.metaPill}><Text style={styles.metaLabel}>BPM</Text><Text style={styles.metaValue}>{activeSong.bpm}</Text></View>
      </View>
      <View style={styles.timelineBlock}>
        <View style={styles.timelineTrack}><View style={[styles.timelineProgress, { width: `${Math.min(100, (position / activeSong.duration) * 100)}%` }]} /></View>
        <View style={styles.timelineLabels}><Text style={styles.timelineText}>{formatTime(position)}</Text><Text style={styles.timelineText}>{formatTime(activeSong.duration)}</Text></View>
      </View>
      <View style={styles.controlsRow}>
        <TouchableOpacity accessibilityLabel="Faixa anterior" style={styles.controlButton} onPress={() => changeSong(-1)}><MaterialCommunityIcons name="skip-previous" size={24} color="#f8fafc" /></TouchableOpacity>
        <TouchableOpacity accessibilityLabel={playing ? 'Pausar' : 'Reproduzir'} style={styles.playButton} onPress={() => setPlaying((value) => !value)}><MaterialCommunityIcons name={playing ? 'pause' : 'play'} size={28} color="#08111c" /></TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Próxima faixa" style={styles.controlButton} onPress={() => changeSong(1)}><MaterialCommunityIcons name="skip-next" size={24} color="#f8fafc" /></TouchableOpacity>
      </View>
      <Text style={styles.demoNote}>{playing ? 'Demonstração do progresso — áudio ainda não conectado.' : 'Controles de prática; o áudio será conectado numa próxima etapa.'}</Text>
      <View style={styles.chordPanel}>
        <Text style={styles.chordLabel}>Sequência demonstrativa de acordes</Text>
        <View style={styles.chordRow}>{activeSong.chords.map((chord, index) => <Text key={`${chord}-${index}`} style={index === 0 ? styles.chordMain : styles.chordSmall}>{transpose(chord, transposeBy)}</Text>)}</View>
        <Text style={styles.demoNote}>Acordes de exemplo, ainda sem cifra verificada da música.</Text>
      </View>
    </View>
  );

  const renderLibrary = () => (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Biblioteca de músicas</Text>
      <View style={styles.searchRow}><MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" /><TextInput style={styles.searchInput} value={query} onChangeText={setQuery} placeholder="Buscar música, artista ou tom" placeholderTextColor="#94a3b8" /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreList}>
        {genres.map((item) => <TouchableOpacity key={item} onPress={() => setGenre(item)} style={[styles.genreChip, genre === item && styles.genreChipActive]}><Text style={genre === item ? styles.genreChipTextActive : styles.genreChipText}>{item}</Text></TouchableOpacity>)}
      </ScrollView>
      <View style={styles.songList}>
        {filteredSongs.length ? filteredSongs.map((song) => <TouchableOpacity key={song.title} style={[styles.songItem, song.title === activeSong.title && styles.songItemActive]} onPress={() => selectSong(song)}><View style={[styles.songDot, { backgroundColor: song.accent }]} /><View style={styles.songSummary}><Text style={styles.songListTitle}>{song.title}</Text><Text style={styles.songListMeta}>{song.artist} • {song.style} • tom {song.key}</Text></View><MaterialCommunityIcons name="chevron-right" size={22} color="#94a3b8" /></TouchableOpacity>) : <Text style={styles.emptyText}>Nenhuma música encontrada.</Text>}
      </View>
    </View>
  );

  const renderHome = () => (
    <>
      <View style={styles.heroCard}><View style={styles.heroTextWrap}><Text style={styles.kicker}>Seu estúdio musical</Text><Text style={styles.heroTitle}>Pratique acordes em qualquer tom.</Text></View><TouchableOpacity style={styles.primaryButton} onPress={startSession}><Text style={styles.primaryButtonText}>Nova sessão</Text></TouchableOpacity></View>
      <View style={styles.statsRow}>{[{ label: 'Músicas', value: String(songs.length) }, { label: 'Tom atual', value: transpose(activeSong.key, transposeBy) }, { label: 'Sessões', value: String(sessions) }].map((stat) => <View key={stat.label} style={styles.statCard}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}</View>
      <View style={styles.mainGrid}>{renderPlayer()}<View style={styles.sidePanel}><View style={styles.panel}><Text style={styles.sectionTitle}>Ações rápidas</Text><View style={styles.quickActionsGrid}>{quickActions.map((action) => <TouchableOpacity key={action.label} style={[styles.quickActionItem, (action.label === 'Loop' && loop || action.label === 'Metrônomo' && metronome) && styles.quickActionActive]} onPress={() => openAction(action.label)}><View style={[styles.quickActionIcon, { backgroundColor: `${action.color}22` }]}><MaterialCommunityIcons name={action.icon as any} size={20} color={action.color} /></View><Text style={styles.quickActionLabel}>{action.label}</Text><Text style={styles.quickActionState}>{action.label === 'Loop' && loop || action.label === 'Metrônomo' && metronome ? 'Ativo' : action.label === 'Tom' ? transpose(activeSong.key, transposeBy) : action.label === 'Capotraste' ? `${capo ?? activeSong.capo}` : ''}</Text></TouchableOpacity>)}</View></View>{renderLibrary()}</View></View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.shell, Platform.OS === 'web' && styles.webShell]}>
          <View style={styles.topBar}><View style={styles.logoWrap}><Text style={styles.logo}>H</Text></View><Text style={styles.brand}>HOMERO</Text><TouchableOpacity style={styles.premiumButton} onPress={() => setNotice('O perfil Premium ainda não está configurado neste protótipo.')}><Text style={styles.premiumText}>Premium</Text></TouchableOpacity></View>
          {notice ? <TouchableOpacity style={styles.notice} onPress={() => setNotice('')}><Text style={styles.noticeText}>{notice}  ×</Text></TouchableOpacity> : null}
          {activeTab === 'Início' ? renderHome() : null}
          {activeTab === 'Biblioteca' ? renderLibrary() : null}
          {activeTab === 'Prática' ? <>{renderPlayer()}<View style={styles.panel}><Text style={styles.sectionTitle}>Ajustes da prática</Text><View style={styles.quickActionsGrid}>{quickActions.map((action) => <TouchableOpacity key={action.label} style={styles.quickActionItem} onPress={() => openAction(action.label)}><Text style={styles.quickActionLabel}>{action.label}</Text><Text style={styles.quickActionState}>{action.label === 'Tom' ? transpose(activeSong.key, transposeBy) : action.label === 'Capotraste' ? `${capo ?? activeSong.capo}` : action.label === 'Loop' ? loop ? 'Ativo' : 'Desativado' : metronome ? 'Ativo' : 'Desativado'}</Text></TouchableOpacity>)}</View><TouchableOpacity style={styles.primaryButton} onPress={startSession}><Text style={styles.primaryButtonText}>Nova sessão</Text></TouchableOpacity></View></> : null}
          {activeTab === 'Perfil' ? <View style={styles.panel}><Text style={styles.sectionTitle}>Perfil</Text><Text style={styles.profileTitle}>Seu espaço musical</Text><Text style={styles.profileText}>Sessões iniciadas neste dispositivo: {sessions}</Text><Text style={styles.profileText}>Premium e sincronização ainda não estão conectados a uma conta.</Text><TouchableOpacity style={styles.primaryButton} onPress={() => setNotice('Seu progresso está somente nesta sessão de demonstração.')}><Text style={styles.primaryButtonText}>Ver estado da conta</Text></TouchableOpacity></View> : null}
          {activeTab === 'Início' ? <View style={styles.genreSection}><Text style={styles.sectionTitle}>Descobrir por estilo</Text><View style={styles.genreList}>{genres.slice(1).map((item, index) => <TouchableOpacity key={item} onPress={() => { setGenre(item); setActiveTab('Biblioteca'); }} style={[styles.genreCard, { backgroundColor: ['#312e81', '#0f766e', '#374151', '#164e63'][index] }]}><Text style={styles.genreText}>{item}</Text></TouchableOpacity>)}</View></View> : null}
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>{([{ label: 'Início', icon: 'home' }, { label: 'Biblioteca', icon: 'playlist-music' }, { label: 'Prática', icon: 'guitar-acoustic' }, { label: 'Perfil', icon: 'account' }] as const).map((tab) => <TouchableOpacity key={tab.label} style={styles.navItem} onPress={() => { setActiveTab(tab.label); setNotice(''); }}><MaterialCommunityIcons name={tab.icon as any} size={20} color={activeTab === tab.label ? '#8b5cf6' : '#94a3b8'} /><Text style={activeTab === tab.label ? styles.navTextActive : styles.navText}>{tab.label}</Text></TouchableOpacity>)}</View>
      <Modal transparent visible={modalAction !== null} animationType="fade" onRequestClose={() => setModalAction(null)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}><Text style={styles.sectionTitle}>{modalAction === 'Tom' ? 'Ajustar tom' : 'Ajustar capotraste'}</Text><Text style={styles.modalDescription}>{modalAction === 'Tom' ? 'Transposição demonstrativa em semitons.' : 'Escolha a posição do capotraste.'}</Text><View style={styles.adjustRow}><TouchableOpacity style={styles.adjustButton} onPress={() => modalAction === 'Tom' ? setTransposeBy((value) => Math.max(-11, value - 1)) : setCapo((value) => Math.max(0, (value ?? activeSong.capo) - 1))}><Text style={styles.adjustText}>−</Text></TouchableOpacity><Text style={styles.adjustValue}>{modalAction === 'Tom' ? `${transpose(activeSong.key, transposeBy)} (${transposeBy > 0 ? '+' : ''}${transposeBy})` : `${capo ?? activeSong.capo}`}</Text><TouchableOpacity style={styles.adjustButton} onPress={() => modalAction === 'Tom' ? setTransposeBy((value) => Math.min(11, value + 1)) : setCapo((value) => Math.min(12, (value ?? activeSong.capo) + 1))}><Text style={styles.adjustText}>+</Text></TouchableOpacity></View><View style={styles.modalActions}><TouchableOpacity style={styles.ghostButton} onPress={() => { if (modalAction === 'Tom') setTransposeBy(0); else setCapo(activeSong.capo); }}><Text style={styles.ghostButtonText}>Restaurar</Text></TouchableOpacity><TouchableOpacity style={styles.primaryButton} onPress={() => setModalAction(null)}><Text style={styles.primaryButtonText}>Concluído</Text></TouchableOpacity></View></View></View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#08111c' }, container: { paddingBottom: 110 }, shell: { flex: 1, paddingHorizontal: 16, paddingTop: 18, backgroundColor: '#08111c', gap: 16 }, webShell: { maxWidth: 1200, alignSelf: 'center', width: '100%' },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 }, logoWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#8b5cf6', alignItems: 'center', justifyContent: 'center' }, logo: { color: '#fff', fontWeight: '700', fontSize: 22 }, brand: { flex: 1, marginLeft: 12, color: '#f8fafc', fontSize: 18, fontWeight: '700', letterSpacing: 1.2 }, premiumButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#172033', borderWidth: 1, borderColor: '#2a3654' }, premiumText: { color: '#f8fafc', fontWeight: '700', fontSize: 12 },
  notice: { backgroundColor: '#1d2d47', padding: 12, borderRadius: 12 }, noticeText: { color: '#e2e8f0', fontSize: 13 }, heroCard: { backgroundColor: '#111c2d', borderColor: '#24324f', borderWidth: 1, borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, heroTextWrap: { flex: 1 }, kicker: { color: '#8b5cf6', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }, heroTitle: { color: '#f8fafc', fontSize: 28, fontWeight: '800', maxWidth: 360 }, primaryButton: { backgroundColor: '#8b5cf6', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 10 }, primaryButtonText: { color: '#fff', fontWeight: '700' }, statsRow: { flexDirection: 'row', marginBottom: 2, gap: 12 }, statCard: { flex: 1, backgroundColor: '#121d2d', borderWidth: 1, borderColor: '#1e2d46', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 14 }, statValue: { color: '#f8fafc', fontWeight: '800', fontSize: 24, marginBottom: 4 }, statLabel: { color: '#94a3b8', fontSize: 12 },
  mainGrid: { flexDirection: 'row', gap: 16, marginBottom: 2, alignItems: 'flex-start' }, playerCard: { flex: 1.5, backgroundColor: '#101b2c', borderRadius: 24, borderWidth: 1, borderColor: '#20314b', padding: 18, marginBottom: 16 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, sectionTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 16 }, ghostButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#1a2b44' }, ghostButtonText: { color: '#dbeafe', fontSize: 12, fontWeight: '700' }, playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }, songInfo: { flex: 1, paddingRight: 8 }, songStyle: { color: '#8b5cf6', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', marginBottom: 4 }, songTitle: { color: '#f8fafc', fontSize: 25, fontWeight: '800' }, songArtist: { color: '#94a3b8', fontSize: 14, marginTop: 4 }, scoreBadge: { backgroundColor: '#1f2937', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 }, scoreText: { color: '#34d399', fontWeight: '800', fontSize: 10 }, playerMetaRow: { flexDirection: 'row', gap: 8, marginBottom: 18 }, metaPill: { flex: 1, backgroundColor: '#162337', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 10 }, metaLabel: { color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }, metaValue: { color: '#f8fafc', fontWeight: '800', fontSize: 20 },
  timelineBlock: { marginBottom: 18 }, timelineTrack: { height: 8, backgroundColor: '#1c2943', borderRadius: 999, overflow: 'hidden' }, timelineProgress: { height: '100%', backgroundColor: '#8b5cf6', borderRadius: 999 }, timelineLabels: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }, timelineText: { color: '#94a3b8', fontSize: 12 }, controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }, controlButton: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#18263d', alignItems: 'center', justifyContent: 'center' }, playButton: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }, demoNote: { color: '#94a3b8', fontSize: 11, marginBottom: 12, lineHeight: 16 }, chordPanel: { backgroundColor: '#14213a', borderRadius: 20, borderWidth: 1, borderColor: '#26395f', padding: 16 }, chordLabel: { color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', marginBottom: 12 }, chordRow: { flexDirection: 'row', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }, chordMain: { fontSize: 42, color: '#f8fafc', fontWeight: '800' }, chordSmall: { fontSize: 20, color: '#cbd5e1', fontWeight: '700' }, sidePanel: { flex: 0.9, gap: 16 }, panel: { backgroundColor: '#101b2c', borderRadius: 24, borderWidth: 1, borderColor: '#243653', padding: 18, marginBottom: 16 }, quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }, quickActionItem: { width: '47%', backgroundColor: '#172637', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', minHeight: 92 }, quickActionActive: { borderWidth: 1, borderColor: '#8b5cf6' }, quickActionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }, quickActionLabel: { color: '#e2e8f0', fontWeight: '700', fontSize: 12, textAlign: 'center' }, quickActionState: { color: '#a78bfa', fontSize: 11, marginTop: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#101b2e', borderWidth: 1, borderColor: '#1d2a42', borderRadius: 16, paddingHorizontal: 14, minHeight: 48, marginTop: 14 }, searchInput: { flex: 1, color: '#f8fafc', fontSize: 15 }, genreList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14, marginBottom: 8 }, genreChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#172637' }, genreChipActive: { backgroundColor: '#6d42d8' }, genreChipText: { color: '#cbd5e1', fontWeight: '600' }, genreChipTextActive: { color: '#fff', fontWeight: '700' }, songList: { marginTop: 14, gap: 10 }, songItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#162338', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 10 }, songItemActive: { backgroundColor: '#1d2d47', borderWidth: 1, borderColor: '#3b82f6' }, songDot: { width: 10, height: 10, borderRadius: 999, marginRight: 10 }, songSummary: { flex: 1 }, songListTitle: { color: '#f8fafc', fontWeight: '700', marginBottom: 2 }, songListMeta: { color: '#94a3b8', fontSize: 12 }, emptyText: { color: '#94a3b8', paddingVertical: 18 }, genreSection: { backgroundColor: '#101b2c', borderRadius: 24, borderWidth: 1, borderColor: '#243653', padding: 18, marginBottom: 16 }, genreCard: { width: '46%', minHeight: 72, borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 14 }, genreText: { color: '#f8fafc', fontWeight: '800', fontSize: 16 }, profileTitle: { color: '#f8fafc', fontWeight: '800', fontSize: 23, marginTop: 18 }, profileText: { color: '#94a3b8', marginTop: 12, lineHeight: 20 },
  bottomNav: { position: 'absolute', bottom: 8, left: 16, right: 16, height: 74, backgroundColor: '#101b2c', borderRadius: 22, borderWidth: 1, borderColor: '#213453', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 }, navText: { color: '#94a3b8', fontSize: 11, marginTop: 3, fontWeight: '600' }, navTextActive: { color: '#8b5cf6', fontSize: 11, marginTop: 3, fontWeight: '700' }, modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 }, modalCard: { width: '100%', maxWidth: 380, backgroundColor: '#101b2c', borderColor: '#2a3654', borderWidth: 1, borderRadius: 24, padding: 22 }, modalDescription: { color: '#94a3b8', marginTop: 8 }, adjustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 24 }, adjustButton: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#1a2b44', alignItems: 'center', justifyContent: 'center' }, adjustText: { color: '#fff', fontSize: 28, fontWeight: '700' }, adjustValue: { color: '#fff', fontSize: 22, fontWeight: '800' }, modalActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
