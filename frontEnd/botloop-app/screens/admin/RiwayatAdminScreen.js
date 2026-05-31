import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../config";

export default function RiwayatAdminScreen(){
    const [riwayat, setRiwayat] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRiwayat = async () => {
  try {
    const res = await fetch(`${API}/admin/riwayat`);
    const data = await res.json();
    console.log(data); // cek struktur
    if (Array.isArray(data)) {
      setRiwayat(data);
    } else if (data.data) {
      setRiwayat(data.data);
    } else {
      setRiwayat([]);
    }
  } catch (err) {
    console.log(err);
  }
};
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRiwayat();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const formatRupiah = (angka) => "Rp " + Number(angka).toLocaleString("id-ID");
    const formatTanggal = (tanggal) => {
        const d = new Date(tanggal);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };

    const setor = riwayat.filter(i => i.tipe === "setor").length;
    const tarik = riwayat.filter(i => i.tipe === "tarik").length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
                 <Text style={styles.headerSub}>Semua transaksi siswa</Text>
            </View>

            {/* summary */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryNum}>{riwayat.length}</Text>
                    <Text style={styles.summaryLabel}>Total</Text>
                </View>
                <View style={[styles.summaryBox, styles.summaryBorder]}>
                    <Text style={[styles.summaryNum, { color: "#26a69a" }]}>{setor}</Text>
                    <Text style={styles.summaryLabel}>Setoran</Text>
                </View>
                <View style={[styles.summaryBox, styles.summaryBorder]}>
                    <Text style={[styles.summaryNum, { color: "#ef5350" }]}>{tarik}</Text>
                    <Text style={styles.summaryLabel}>Penarikan</Text>
                </View>
            </View>

            <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
      >
        {riwayat.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          </View>
        ) : (
          riwayat.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={[
                styles.iconBox,
                { backgroundColor: item.tipe === "setor" ? "#E8F5E9" : "#FFEBEE" }
              ]}>
                <Ionicons
                  name={item.tipe === "setor" ? "arrow-down-circle" : "arrow-up-circle"}
                  size={22}
                  color={item.tipe === "setor" ? "#26A69A" : "#EF5350"}
                />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNama}>{item.nama}</Text>
                <Text style={styles.itemTipe}>
                  {item.tipe === "setor" ? "Setoran Plastik" : "Penarikan Saldo"}
                </Text>
                <Text style={styles.itemTanggal}>{formatTanggal(item.created_at)}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={[
                  styles.jumlah,
                  item.tipe === "setor" ? styles.plus : styles.minus
                ]}>
                  {item.tipe === "setor" ? "+" : "-"}{formatRupiah(item.jumlah)}
                </Text>
                <View style={[
                  styles.badge,
                  item.status === "approved" ? styles.badgeApproved : 
                  item.status === "rejected" ? styles.badgeDitolak : styles.badgePending
                ]}>
                  <Text style={[
                    styles.badgeText,
                    item.status === "approved" ? styles.textApproved : 
                    item.status === "rejected" ? styles.textDitolak : styles.textPending
                  ]}>
                    {item.status === "approved" ? "Berhasil" : 
                     item.status === "rejected" ? "Ditolak" : "Menunggu"} 
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    header: {
        backgroundColor: "#26a69a", paddingHorizontal: 20,
        paddingTop: 25, paddingBottom: 10,
    },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    headerSub: { color: "#b2dfdb", fontSize: 13, marginTop: 2 },
     summaryRow: {
    flexDirection: "row", backgroundColor: "#fff",
    marginHorizontal: 16, marginTop: 16, borderRadius: 12,
    elevation: 3, marginBottom: 16,
  },
    summaryBox: { flex: 1, alignItems: "center", paddingVertical: 14 },
    summaryBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#f0f0f0" },
    summaryNum: { fontSize: 20, fontWeight: "bold", color: "#333" },
    summaryLabel: { fontSize: 11, color: "#888", marginTop: 2 },
    list: { paddingHorizontal: 16 },
    emptyBox: { alignItems: "center", paddingTop: 60, gap: 12 },
    emptyText: { color: "#bbb", fontSize: 14 },
    itemCard: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
        borderRadius: 12, padding: 14, marginBottom: 8,
        elevation: 1,
    },
    iconBox: {
        width: 44, height: 44, borderRadius: 22,
        justifyContent: "center", alignItems: "center", marginRight: 12,
    },
    itemInfo: { flex: 1 },
    itemNama: { fontSize: 13, fontWeight: "600", color: "#333" },
    itemTipe: { fontSize: 12, color: "#888", marginTop: 2 },
    itemTanggal: { fontSize: 11, color: "#bbb", marginTop: 2 },
    itemRight: { alignItems: "flex-end", gap: 4 },
    jumlah: { fontSize: 14, fontWeight: "bold" },
    plus: { color: "#26A69A" },
    minus: { color: "#EF5350" },
    badge: {
        paddingHorizontal: 8, paddingVertical: 2,
        borderRadius: 20,
    },
    badgeApproved: { backgroundColor: "#E8F5E9" },
    badgePending: { backgroundColor: "#FFF3E0" },
    badgeText: { fontSize: 10, fontWeight: "600" },
    textApproved: { color: "#26A69A" },
    textPending: { color: "#F57C00" },
    badgeDitolak: { backgroundColor: "#ffebee"},
    textDitolak: { color: "#ef5350"},
});
