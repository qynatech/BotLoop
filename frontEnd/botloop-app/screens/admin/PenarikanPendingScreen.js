import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../config";

export default function PenarikanPendingScreen(){
    const [pending, setPending] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPending = async () => {
        try {
            const res = await fetch(`${API}/penarikan/pending`);
            const data = await res.json();
            setPending(data);
        } catch (err) {
            console.log(err);
        }
    };
     
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPending();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        Alert.alert(
            "Konfirmasi",
            "Setujui penarikan ini?",
            [
                {text: "Batal", style: "cancel" },
                {
                    text: "Setujui",
                    onPress: async () => {
                        try {
                            const res = await fetch (`${API}/admin/approve`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json"},
                                body: JSON.stringify({ id }),
                            });
                            const data = await res.json();
                            Alert.alert("Berhasil", "Penarikan disetujui!");
                            fetchPending();
                        } catch (err) {
                            Alert.alert("Error", "Gagal connect ke server");
                        }
                    } 
                }
            ]
        );
    };

    const handleTolak = async (id) => {
      Alert.alert(
        "Tolak Penarikan", "Apakah anda yakin menolak penarikan ini?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Tolak",
            style: "destructive",
            onPress: async () => {
             try {
              const res = await fetch(`${API}/admin/tolak`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
              });
              await fetchPending();  
              Alert.alert("Berhasil", "Penarikan ditolak!");
             } catch (err) {
              Alert.alert("Error", "gagal connect ke server");
             }
            }
          }
        ]
      );
    };

    const formatRupiah = (angka) => "Rp" +  Number(angka).toLocaleString("id-ID");
    const formatTanggal = (tanggal) => {
        const d = new Date(tanggal);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Penarikan Pending</Text>
        <Text style={styles.headerSub}>
          {pending.length} menunggu pembayaran
        </Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.content}
      >
        {pending.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#ccc" />
            <Text style={styles.emptyTitle}>Semua beres!</Text>
            <Text style={styles.emptyText}>Tidak ada penarikan yang menunggu</Text>
          </View>
        ) : (
          pending.map((item, index) => (
            <View key={index} style={styles.card}>
              {/* Info User */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarBox}>
                  <Ionicons name="person" size={22} color="#26A69A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{item.nama}</Text>
                  <Text style={styles.tanggal}>{item.kelas} • {formatTanggal(item.created_at)}</Text>
                </View>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Pending</Text>
                </View>
              </View>

              {/* Detail */}
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Jumlah Penarikan</Text>
                  <Text style={styles.detailNominal}>{formatRupiah(item.jumlah)}</Text>
                </View>
              </View>

              {/* Tombol Approve */}
              <View style={styles.btnRow}>
                 <TouchableOpacity
                 style={styles.tolakBtn}
                 onPress={() => handleTolak(item.id)}>
                  <Ionicons name="close-circle-outline" size={20} color= "#fff" />
                  <Text style={styles.tolakText}>Tolak</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                   style={styles.approveBtn}
                   onPress={() => handleApprove(item.id)}
              > 
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.approveText}>Setujui & Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>
            
          ))
        )}
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
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerSub: { color: "#B2DFDB", fontSize: 13, marginTop: 2 },
  content: { padding: 16 },
  emptyBox: {
    alignItems: "center", paddingTop: 80, gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#aaa" },
  emptyText: { fontSize: 13, color: "#bbb" },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 12, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatarBox: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#E8F5E9", justifyContent: "center",
    alignItems: "center", marginRight: 12,
  },
  userName: { fontSize: 15, fontWeight: "600", color: "#333" },
  tanggal: { fontSize: 12, color: "#888", marginTop: 2 },
  pendingBadge: {
    backgroundColor: "#FFF3E0", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  pendingText: { color: "#F57C00", fontSize: 12, fontWeight: "600" },
  detailRow: {
    backgroundColor: "#f9f9f9", borderRadius: 10,
    padding: 12, marginBottom: 12,
  },
  detailItem: { alignItems: "center" },
  detailLabel: { fontSize: 12, color: "#888" },
  detailNominal: { fontSize: 22, fontWeight: "bold", color: "#F57C00", marginTop: 4 },
  approveBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 14, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnRow: { flexDirection: "row", gap: 8 },
tolakBtn: {
  flex: 1, backgroundColor: "#EF5350", borderRadius: 10,
  padding: 14, flexDirection: "row",
  alignItems: "center", justifyContent: "center", gap: 8,
},
tolakText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
approveBtn: {
  flex: 1, backgroundColor: "#26A69A", borderRadius: 10,
  padding: 14, flexDirection: "row",
  alignItems: "center", justifyContent: "center", gap: 8,
},
  approveText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
