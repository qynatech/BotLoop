import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../config";

export default function DashboardAdmin({ user, onLogout, navigation }) {
  const [stats, setStats] = useState({
    totalUser: 0,
    pendingPenarikan: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [resUsers, resPending] = await Promise.all([
        fetch(`${API}/users`),
        fetch(`${API}/penarikan/pending`),
      ]);
      const users = await resUsers.json();
      const pending = await resPending.json();
      setStats({
        totalUser: users.length,
        pendingPenarikan: pending.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const menuItems = [
    { icon: "archive-outline", title: "Input Setoran", sub: "Input setoran siswa", color: "#26A69A", bg: "#E8F5E9", route: "Setoran" },
    { icon: "wallet-outline", title: "Penarikan Pending", sub: `${stats.pendingPenarikan} menunggu pembayaran`, color: "#F57C00", bg: "#FFF3E0" , route: "Penarikan" },
    { icon: "time-outline", title: "Riwayat Transaksi", sub: "Lihat semua transaksi", color: "#1976D2", bg: "#E3F2FD", route: "Riwayat" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Selamat Datang,</Text>
            <Text style={styles.headerName}>Admin {user.nama}!</Text>
            <Text style={styles.headerSub}>Smart Recycling Management</Text>
          </View>
          <TouchableOpacity onPress={onLogout}>
            <Ionicons name="log-out-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={22} color="#26A69A" />
            <Text style={styles.statNum}>{stats.totalUser}</Text>
            <Text style={styles.statLabel}>Total Pengguna</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="wallet-outline" size={22} color="#F57C00" />
            <Text style={styles.statNum}>{stats.pendingPenarikan}</Text>
            <Text style={styles.statLabel}>Pending Penarikan</Text>
          </View>
        </View>

        {/* Menu Aksi */}
        <Text style={styles.sectionTitle}>Menu Aksi</Text>

        {menuItems.map((item, index) => (
            <TouchableOpacity
            key={index} style={styles.menuCard} onPress={() => navigation.navigate(item.route)}>
            <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#26A69A", paddingHorizontal: 20,
    paddingTop: 25, paddingBottom: 10,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
  },
  headerTitle: { color: "#B2DFDB", fontSize: 14 },
  headerName: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 2 },
  headerSub: { color: "#B2DFDB", fontSize: 12, marginTop: 4 },
  statsRow: {
    flexDirection: "row", gap: 12,
    marginHorizontal: 16, marginTop: 16, marginBottom: 8,
  },
  statCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 12,
    padding: 16, alignItems: "center", gap: 6,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  statNum: { fontSize: 24, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 11, color: "#888", textAlign: "center" },
  sectionTitle: {
    fontSize: 16, fontWeight: "bold", color: "#333",
    marginHorizontal: 16, marginTop: 16, marginBottom: 8,
  },
  menuCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16,
    elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  menuIconBox: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  menuSub: { fontSize: 12, color: "#888", marginTop: 2 },
});