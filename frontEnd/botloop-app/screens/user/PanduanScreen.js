import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function PanduanScreen({ onBack }) {
    const steps = [
        {
            icon: "bag-outline",
            title: "Kumpulkan Botol Plastik",
            desc: "Kumpulkan sampah botol plastik bekas yang sudah tidak terpakai."
        },
        {
            icon: "walk-outline",
            title: "Datang ke Tempat Setor",
            desc: "Bawa botol plastikmu ke tempat setor yang ada di sekolah."
        },
        {
            icon: "scale-outline",
            title: "Admin Menimbang",
            desc: "Admin akan menimbang botol plastikmu dan menginput beratnya."
        },
        {
            icon: "cash-outline",
            title: "Tarik Saldo",
            desc: "Kamu bisa tarik saldo kapan saja dan ambil uang di tempat setor setelah disetujui admin.",
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tata Cara Setor</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="refresh-circle-outline" size={48} color="#26A69A" />
          <Text style={styles.bannerTitle}>Bank Sampah BotLoop</Text>
          <Text style={styles.bannerSub}>Tukar botol plastikmu jadi uang!</Text>
        </View>

        {/* Harga */}
        <View style={styles.hargaBox}>
          <Text style={styles.hargaLabel}>Harga Botol Plastik</Text>
          <Text style={styles.hargaNominal}>Rp 3.000 / kg</Text>
        </View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>Langkah-langkah</Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepLeft}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{index + 1}</Text>
              </View>
              <View style={styles.stepLine} />
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepIconBox}>
                <Ionicons name={step.icon} size={22} color="#26A69A" />
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#1976D2" />
          <Text style={styles.infoText}>
            Setor hanya bisa dilakukan di hari Selasa & Jumat di tempat setor sekolah.
          </Text>
        </View>

        <TouchableOpacity style={styles.mengertiBtn} onPress={onBack}>
          <Text style={styles.mengertiText}>Mengerti, siap setor!</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#26A69A", paddingHorizontal: 16,
    paddingTop: 25, paddingBottom: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  backBtn: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 16 },
  banner: {
    backgroundColor: "#fff", borderRadius: 16, padding: 24,
    alignItems: "center", marginBottom: 16, gap: 8,
    elevation: 2,
  },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bannerSub: { fontSize: 13, color: "#888" },
  hargaBox: {
    backgroundColor: "#26A69A", borderRadius: 12, padding: 16,
    alignItems: "center", marginBottom: 16,
  },
  hargaLabel: { color: "#B2DFDB", fontSize: 12 },
  hargaNominal: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12 },
  stepCard: {
    flexDirection: "row", marginBottom: 8,
  },
  stepLeft: { alignItems: "center", marginRight: 12, width: 28 },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#26A69A", justifyContent: "center", alignItems: "center",
  },
  stepNumText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  stepLine: { width: 2, flex: 1, backgroundColor: "#E0E0E0", marginTop: 4 },
  stepContent: {
    flex: 1, flexDirection: "row", backgroundColor: "#fff",
    borderRadius: 12, padding: 12, marginBottom: 8, gap: 12,
    elevation: 1,
  },
  stepIconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center",
  },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  stepDesc: { fontSize: 12, color: "#888", marginTop: 4, lineHeight: 18 },
  infoBox: {
    flexDirection: "row", backgroundColor: "#E3F2FD", borderRadius: 10,
    padding: 12, gap: 8, marginTop: 8, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 12, color: "#1976D2", lineHeight: 18 },
  mengertiBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 16, alignItems: "center",
  },
  mengertiText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
