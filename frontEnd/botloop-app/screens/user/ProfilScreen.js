import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilScreen({ user, onLogout }) {

    const infoItems = [
        { icon: "mail-outline", label: "Email", value: user.email },
        { icon: "school-outline", label: "Kelas", value: user.kelas || "-" },
        { icon: "calendar-outline", label: "Bergabung Sejak", value: user.created_at
            ?  new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric"})
            : "-"
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
        </View>

        {/* Avatar & Nama */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={48} color="#26A69A" />
          </View>
          <Text style={styles.nama}>{user.nama}</Text>
          <Text style={styles.kelas}>{user.kelas || "-"}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          {infoItems.map((item, index) => (
            <View key={index} style={[
              styles.infoRow,
              index < infoItems.length - 1 && styles.infoRowBorder
            ]}>
              <View style={styles.infoLeft}>
                <Ionicons name={item.icon} size={18} color="#26A69A" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF5350" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5"},
    header: {
        backgroundColor: "#26a69a", paddingHorizontal: 20,
        paddingTop: 25, paddingBottom: 10,
    },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    profileCard: {
        backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16,
        borderRadius: 16, padding: 24, alignItems: "center",
        elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 8,
    },
    avatarBox: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: "#e8f5e9", justifyContent: "center",
        alignItems: "center", marginBottom: 12,
    },
    nama: { fontSize: 20, fontWeight: "bold", color: "#333"},
    kelas: { fontSize: 14, color: "#888", marginTop: 4},
    infoCard: {
        backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, 
        borderRadius: 16, padding: 16, elevation: 2,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.08, shadowRadius: 8,
    },
    sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 12 },
    infoRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingVertical: 12,
    },
    infoRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
    infoLeft: { flexDirection: "row", alignItems: "center" },
    infoIcon: { marginRight: 10},
    infoLabel: { fontSize: 13, color: "#888" },
    infoValue: { fontSize: 13, color: "#333", fontWeight: "500", maxWidth: "55%" },
    logoutBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16,
    borderRadius: 12, padding: 16, gap: 8,
    borderWidth: 1, borderColor: "#FFCDD2",
    elevation: 1,
  },
  logoutText: { color: "#ef5350", fontWeight: "bold", fontSize: 16},
});