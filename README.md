import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
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
  duration: string;
  accent: string;
  score: number;
};

const songs: Song[] = [
  {
    title: 'Cafeína e Sol',
    artist: 'Luna Harp',
    style: 'MPB',
    key: 'D',
    capo: 0,
    bpm: 82,
    duration: '3:46',
    accent: '#8b5cf6',
    score: 92,
  },
  {
    title: 'Vento Fora',
    artist: 'Silveira',
    style: 'Pop',
    key: 'G',
    capo: 2,
    bpm: 90,
    duration: '4:12',
    accent: '#22c55e',
    score: 88,
  },
  {
    title: 'Entre Pontos',
    artist: 'AsterN',
    style: 'Indie',
    key: 'A',
    capo: 1,
    bpm: 76,
    duration: '3:19',
    accent: '#f59e0b',
    score: 95,
  },
  {
    title: 'Madrugada Azul',
    artist: 'Pilar Vale',
    style: 'Folk',
    key: 'E',
    capo: 3,
    bpm: 68,
    duration: '4:34',
    accent: '#38bdf8',
    score: 90,
  },
];

const quickActions = [
  { label: 'Tom', icon: 'music-note', color: '#8b5cf6' },
  { label: 'Capotraste', icon: 'guitar-pick', color: '#22c55e' },
  { label: 'Loop', icon: 'repeat', color: '#f59e0b' },
  { label: 'Metronomo', icon: 'metronome', color: '#38bdf8' },
];

const genres = ['MPB', 'Pop', 'Rock', 'Gospel', 'Jazz', 'Acústico'];

const stats = [
  { label: 'Músicas', value: '128' },
  { label: 'Tom atual', value: 'D' },
  { label: 'Sessões', value: '18' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeSong, setActiveSong] = useState<Song>(songs[0]);

  const filteredSongs = useMemo(() => {
    const lower = query.trim().toLowerCase();

    if (!lower) return songs;

    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lower) ||
        song.artist.toLowerCase().includes(lower) ||
        song.style.toLowerCase().includes(lower) ||
        song.key.toLowerCase().includes(lower)
    );
  }, [query]);

  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.shell, isWeb && styles.webShell]}>
          <View style={styles.topBar}>
            <View style={styles.logoWrap}>
              <Text style={styles.logo}>H</Text>
            </View>
            <Text style={styles.brand}>HOMERO</Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumText}>Premium</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar música, artista ou tom"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.kicker}>Seu estúdio musical</Text>
              <Text style={styles.heroTitle}>Pratique acordes em qualquer tom.</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Nova sessão</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.mainGrid}>
            <View style={styles.playerCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Player</Text>
                <TouchableOpacity style={styles.ghostButton}>
                  <Text style={styles.ghostButtonText}>Sincronizar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.playerHeader}>
                <View>
                  <Text style={styles.songStyle}>{activeSong.style}</Text>
                  <Text style={styles.songTitle}>{activeSong.title}</Text>
                  <Text style={styles.songArtist}>{activeSong.artist}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{activeSong.score}%</Text>
                </View>
              </View>

              <View style={styles.playerMetaRow}>
                <View style={styles.metaPill}>
                  <Text style={styles.metaLabel}>Tom</Text>
                  <Text style={styles.metaValue}>{activeSong.key}</Text>
                </View>
                <View style={styles.metaPill}>
                  <Text style={styles.metaLabel}>Capo</Text>
                  <Text style={styles.metaValue}>{activeSong.capo}</Text>
                </View>
                <View style={styles.metaPill}>
                  <Text style={styles.metaLabel}>BPM</Text>
                  <Text style={styles.metaValue}>{activeSong.bpm}</Text>
                </View>
              </View>

              <View style={styles.timelineBlock}>
                <View style={styles.timelineTrack}>
                  <View style={[styles.timelineProgress, { width: '62%' }]} />
                </View>
                <View style={styles.timelineLabels}>
                  <Text style={styles.timelineText}>1:24</Text>
                  <Text style={styles.timelineText}>{activeSong.duration}</Text>
                </View>
              </View>

              <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.controlButton}>
                  <MaterialCommunityIcons name="skip-previous" size={24} color="#f8fafc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playButton}>
                  <MaterialCommunityIcons name="play" size={28} color="#08111c" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <MaterialCommunityIcons name="skip-next" size={24} color="#f8fafc" />
                </TouchableOpacity>
              </View>

              <View style={styles.chordPanel}>
                <Text style={styles.chordLabel}>Próximo acorde</Text>
                <View style={styles.chordRow}>
                  <Text style={styles.chordMain}>D</Text>
                  <Text style={styles.chordSmall}>F#m7</Text>
                  <Text style={styles.chordSmall}>G</Text>
                </View>
              </View>
            </View>

            <View style={styles.sidePanel}>
              <View style={styles.quickActionPanel}>
                <Text style={styles.sectionTitle}>Ações rápidas</Text>
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action) => (
                    <TouchableOpacity key={action.label} style={styles.quickActionItem}>
                      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '22' }]}>
                        <MaterialCommunityIcons name={action.icon as any} size={20} color={action.color} />
                      </View>
                      <Text style={styles.quickActionLabel}>{action.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.libraryPanel}>
                <Text style={styles.sectionTitle}>Biblioteca</Text>
                <View style={styles.songList}>
                  {filteredSongs.map((song) => (
                    <TouchableOpacity
                      key={song.title}
                      style={[styles.songItem, song.title === activeSong.title && styles.songItemActive]}
                      onPress={() => setActiveSong(song)}
                    >
                      <View style={[styles.songDot, { backgroundColor: song.accent }]} />
                      <View style={styles.songSummary}>
                        <Text style={styles.songListTitle}>{song.title}</Text>
                        <Text style={styles.songListMeta}>{song.artist} • {song.key}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.genreSection}>
            <Text style={styles.sectionTitle}>Descobrir</Text>
            <View style={styles.genreList}>
              {genres.map((genre, index) => (
                <View
                  key={genre}
                  style={[styles.genreCard, { backgroundColor: ['#1f2937', '#312e81', '#0f766e', '#7c2d12', '#374151', '#164e63'][index] }]}
                >
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={20} color="#8b5cf6" />
          <Text style={styles.navTextActive}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="playlist-music" size={20} color="#94a3b8" />
          <Text style={styles.navText}>Biblioteca</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="guitar-acoustic" size={20} color="#94a3b8" />
          <Text style={styles.navText}>Prática</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={20} color="#94a3b8" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111c',
  },
  container: {
    paddingBottom: 110,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    backgroundColor: '#08111c',
  },
  webShell: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logoWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  logo: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
  },
  brand: {
    flex: 1,
    marginLeft: 12,
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  premiumButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#172033',
    borderWidth: 1,
    borderColor: '#2a3654',
  },
  premiumText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#101b2e',
    borderWidth: 1,
    borderColor: '#1d2a42',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
    paddingVertical: 0,
  },
  heroCard: {
    backgroundColor: '#111c2d',
    borderColor: '#24324f',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroTextWrap: {
    flex: 1,
  },
  kicker: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    maxWidth: 360,
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#121d2d',
    borderWidth: 1,
    borderColor: '#1e2d46',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  statValue: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  playerCard: {
    flex: 1.5,
    backgroundColor: '#101b2c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#20314b',
    padding: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
  },
  ghostButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1a2b44',
  },
  ghostButtonText: {
    color: '#dbeafe',
    fontSize: 12,
    fontWeight: '700',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  songStyle: {
    color: '#8b5cf6',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 4,
  },
  songTitle: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
  },
  songArtist: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  scoreBadge: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  scoreText: {
    color: '#34d399',
    fontWeight: '800',
  },
  playerMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  metaPill: {
    flex: 1,
    backgroundColor: '#162337',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metaLabel: {
    color: '#94a3b8',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaValue: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 20,
  },
  timelineBlock: {
    marginBottom: 18,
  },
  timelineTrack: {
    height: 8,
    backgroundColor: '#1c2943',
    borderRadius: 999,
    overflow: 'hidden',
  },
  timelineProgress: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 999,
  },
  timelineLabels: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#18263d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 28,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f8fafc',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  chordPanel: {
    backgroundColor: '#14213a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#26395f',
    padding: 18,
  },
  chordLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chordRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 18,
  },
  chordMain: {
    fontSize: 56,
    color: '#f8fafc',
    fontWeight: '800',
  },
  chordSmall: {
    fontSize: 22,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  sidePanel: {
    flex: 0.9,
    gap: 16,
  },
  quickActionPanel: {
    backgroundColor: '#101b2c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#243653',
    padding: 18,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  quickActionItem: {
    width: '46%',
    backgroundColor: '#172637',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  libraryPanel: {
    backgroundColor: '#101b2c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#243653',
    padding: 18,
  },
  songList: {
    marginTop: 12,
    gap: 10,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162338',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  songItemActive: {
    backgroundColor: '#1d2d47',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  songDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
  },
  songSummary: {
    flex: 1,
  },
  songListTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    marginBottom: 2,
  },
  songListMeta: {
    color: '#94a3b8',
    fontSize: 12,
  },
  genreSection: {
    backgroundColor: '#101b2c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#243653',
    padding: 18,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  genreCard: {
    width: '30%',
    minHeight: 88,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  genreText: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    height: 74,
    backgroundColor: '#101b2c',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#213453',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#8b5cf6',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '700',
  },
});
