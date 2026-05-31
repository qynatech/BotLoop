import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TarikSaldoScreen from "./TarikSaldoScreen";
import { Ionicons } from "@expo/vector-icons";
import PanduanScreen from "./PanduanScreen";

import API from "../../config";

export default function DashboardUser({ user, onLogout, navigation }) {
    const [saldo, setSaldo] = useState(user.saldo);
    const [riwayat, setRiwayat] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showTarik, setShowTarik] = useState(false);
    const [showPanduan, setShowPanduan] = useState(false);

    const fetchRiwayat = async () => {
        try {
            const res = await fetch(`${API}/riwayat/${user.id}`);
            const data = await res.json();

            if (data.data) {
                setRiwayat(data.data.slice(0, 5));
            }
            // Note: kalau tidak simpan password, saldo diambil dari riwayat saja
      // Kita akan pake cara lain — lihat catatan di bawah
        } catch (err) {
            console.log(err);
        }
    };

    const fetchSaldo = async () => {
        try {
            const res = await fetch(`${API}/user/${user.id}`);
            const data = await res.json();
            if (data.saldo !== undefined) {
                setSaldo(data.saldo);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSaldo();
        await fetchRiwayat();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchSaldo();
        fetchRiwayat();
    }, []);

    if (showPanduan) {
      return <PanduanScreen onBack={() => setShowPanduan(false)} />;
    }
    
    if (showTarik) {
        return <TarikSaldoScreen
        user={{ ...user, saldo }}
        onBack={() => { setShowTarik(false); onRefresh(); }}
        />;
    }
    
    const formatRupiah = (angka) => {
        return "Rp " + Number(angka).toLocaleString("id-ID");
    };

    const formatTanggal = (tanggal) => {
        const d = new Date(tanggal);
        return d.toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>

            {/*Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Selamat Datang</Text>
                    <Text style={styles.nama}>Halo, {user.nama}👋</Text>
                </View>
                <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate("Profil")}>
                    <Ionicons name="person-circle-outline" size={42} color="#26a69a"/>
                </TouchableOpacity>
            </View>

            {/* card saldo */}
            <View style={styles.saldoCard}>
                <Text style={styles.saldoLabel}>SALDO KAMU</Text>
                <Text style={styles.saldoNominal}>{formatRupiah(saldo)}</Text>

            {/* tombol aksi */}
            <View style={styles.actionRow}>
                <TouchableOpacity  style={styles.actionBtn} onPress={() => setShowPanduan(true)}>
                    <Ionicons name="archive-outline" size={20} color="#26a69a" />
                    <Text style={styles.actionText}>Setor Botol Plastik</Text>
                </TouchableOpacity>

                <View style={styles.divider} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTarik(true)}>
                    <Ionicons name="wallet-outline" size={20} color="#26a69a" />
                    <Text style={styles.actionText}>Tarik Saldo</Text>
                </TouchableOpacity>
            </View>
            </View> 

            {/* aktivitas terbaru */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>

            {riwayat.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="receipt-outline" size={40} color="#ccc" />
                    <Text style={styles.emptyText}>Belum ada transaksi</Text>
                </View>
            ) : (
                 riwayat.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemIconBox}>
                  <Ionicons
                    name={item.tipe === "setor" ? "archive" : "wallet"}
                    size={22}
                    color={item.tipe === "setor" ? "#26A69A" : "#EF5350"}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTipe}>
                    {item.tipe === "setor" ? "Setor Botol Plastik" : "Tarik Saldo"}
                  </Text>
                  <Text style={styles.itemTanggal}>{formatTanggal(item.created_at)}</Text>
                  <View style={[
                    styles.statusBadge,
                    item.status === "approved" ? styles.badgeApproved :
                    item.status === "rejected" ? styles.badgeDitolak : 
                    styles.badgePending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      item.status === "approved" ? styles.textApproved : 
                      item.status === "rejected" ? styles.textDitolak :
                      styles.textPending
                    ]}>
                      {item.status === "approved" ? "Berhasil" : 
                      item.status === "rejected" ? "Ditolak" : "Menunggu"}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.itemJumlah,
                  item.tipe === "setor" ? styles.plus : styles.minus
                ]}>
                  {item.tipe === "setor" ? "+" : "-"}{formatRupiah(item.jumlah)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: "#fff"
  },
  greeting: { fontSize: 13, color: "#888" },
  nama: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 2 },
  avatarBtn: { padding: 4 },
  saldoCard: {
    margin: 16, backgroundColor: "#fff", borderRadius: 16,
    padding: 20, elevation: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  saldoLabel: { fontSize: 11, color: "#888", fontWeight: "bold", letterSpacing: 1 },
  saldoNominal: { fontSize: 32, fontWeight: "bold", color: "#333", marginTop: 4, marginBottom: 20 },
  actionRow: {
    flexDirection: "row", borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 16
  },
  actionBtn: { flex: 1, alignItems: "center", gap: 6 },
  actionText: { fontSize: 12, color: "#26A69A", fontWeight: "600", textAlign: "center" },
  divider: { width: 1, backgroundColor: "#f0f0f0", marginHorizontal: 8 },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12 },
  emptyBox: {
    backgroundColor: "#fff", borderRadius: 12, padding: 32,
    alignItems: "center", gap: 8
  },
  emptyText: { color: "#bbb", fontSize: 14 },
  itemCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 12, padding: 14, marginBottom: 8,
    elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  itemIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center",
    marginRight: 12
  },
  itemInfo: { flex: 1 },
  itemTipe: { fontSize: 14, fontWeight: "600", color: "#333" },
  itemTanggal: { fontSize: 12, color: "#888", marginTop: 2 },
  statusBadge: {
    alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, marginTop: 4
  },
  badgeApproved: { backgroundColor: "#E8F5E9" },
  badgePending: { backgroundColor: "#FFF3E0" },
  statusText: { fontSize: 11, fontWeight: "600" },
  textApproved: { color: "#26A69A" },
  textPending: { color: "#F57C00" },
  itemJumlah: { fontSize: 14, fontWeight: "bold" },
  plus: { color: "#26A69A" },
  minus: { color: "#EF5350" },
  badgeDitolak: { backgroundColor: "#FFEBEE"},
  textDitolak: { color: "#ef5350"},
});