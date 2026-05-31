import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API from "../../config";

export default function InputSetoranScreen() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [berat, setBerat] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.kelas.toLowerCase().includes(search.toLowerCase())
  );

    const hargaPerKg = 3000;
    const total = berat ? parseFloat(berat) * hargaPerKg: 0;

    const formatRupiah = (angka) => "Rp" + Number(angka).toLocaleString("id-ID");

    const fetchUsers = async () => {
        try {
            const res = await fetch (`${API}/users/all`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSimpan = async () => {
        if (!selectedUser) {
            Alert.alert("Error", "Pilih siswa terlebih dahulu");
            return;
        }
        if (!berat || parseFloat(berat) <= 0) {
            Alert.alert("Error", "Masukkan berat yang valid");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch (`${API}/setor`, {
                method: "POST",
                headers: { "Content-Type": "application/json "},
                body: JSON.stringify({
                    user_id: selectedUser.id,
                    berat: parseFloat(berat),
                }),
            });
            const data = await res.json();
            Alert.alert("Berhasil", `Setoran ${selectedUser.nama} sebesar ${formatRupiah(total)} berhasil disimpan!`, [
            { text: "OK", onPress: () => { setSelectedUser(null); setBerat(""); }}
        ]);
        } catch (err) {
            Alert.alert("Error", "Gagal connect ke server");
        } finally {
            setLoading(false);
        }
    };

    
    return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Input Setoran</Text>
          <Text style={styles.headerSub}>Catat setoran botol plastik siswa</Text>
        </View>

        <View style={styles.form}>

          {/* Dropdown Siswa */}
          <Text style={styles.label}>Nama Siswa</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Ionicons name="person-outline" size={18} color="#aaa" style={styles.icon} />
            <Text style={[styles.dropdownText, !selectedUser && { color: "#bbb" }]}>
              {selectedUser ? `${selectedUser.nama} - ${selectedUser.kelas}` : "Pilih siswa..."}
            </Text>
            <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#aaa" />
          </TouchableOpacity>

          {/* List Dropdown */}
          {showDropdown && (
            <View style={styles.dropdownList}>
            {/* search box */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={16} color="#aaa" style={styles.icon} />
              <TextInput 
              placeholder="Cari nama atau kelas"
              placeholderTextColor="#bbb"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              autoFocus />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={16} color="#aaa" />
                </TouchableOpacity>
              )}
              </View>

              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {filteredUsers.length === 0 ? (
                  <View style={{ padding: 16, alignItems: "center" }}>
                    <Text style={{ color: "#aaa"}}>Siswa tidak ditemukan</Text>
                  </View>
                ) : (
                  filteredUsers.map((u) => (
                    <TouchableOpacity 
                    key={u.id}
                    style={styles.dropdownItem}
                    onPress={() => { setSelectedUser(u); setShowDropdown(false); setSearch(""); }}>
                      <Ionicons name="person-circle-outline" size={20} color="#26a69a" />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.dropdownName}>{u.nama}</Text>
                        <Text style={styles.dropdownKelas}>{u.kelas}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                </ScrollView>
            </View>
          )}

          {/* Berat */}
          <Text style={styles.label}>Berat Botol (kg)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="scale-outline" size={18} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#bbb"
              value={berat}
              onChangeText={setBerat}
              style={styles.input}
              keyboardType="decimal-pad"
            />
            <Text style={styles.suffix}>kg</Text>
          </View>

          {/* Harga per kg */}
          <Text style={styles.label}>Harga/kg</Text>
          <View style={[styles.inputWrapper, { backgroundColor: "#f0f0f0" }]}>
            <Ionicons name="pricetag-outline" size={18} color="#aaa" style={styles.icon} />
            <Text style={styles.input}>{formatRupiah(hargaPerKg)}</Text>
          </View>

          {/* Total */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Pembayaran:</Text>
            <Text style={styles.totalNominal}>{formatRupiah(total)}</Text>
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity
            style={styles.simpanBtn}
            onPress={handleSimpan}
            disabled={loading}
          >
            <Text style={styles.simpanText}>{loading ? "Menyimpan..." : "SIMPAN"}</Text>
          </TouchableOpacity>

        </View>
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
    form: { margin: 16 },
    label: { fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 8, marginTop: 16 },
    searchBox: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: 12, paddingVertical: 8,
      borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
    },
    searchInput: { flex: 1, fontSize: 14, color: "#333", marginLeft: 6},
  dropdown: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1,
    borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 14,
  },
  dropdownText: { flex: 1, fontSize: 14, color: "#333" },
  dropdownList: {
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1,
    borderColor: "#ddd", marginTop: 4, elevation: 4,
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  dropdownName: { fontSize: 14, fontWeight: "600", color: "#333" },
  dropdownKelas: { fontSize: 12, color: "#888" },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1,
    borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: "#333" },
  suffix: { fontSize: 14, color: "#888" },
  totalBox: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#E8F5E9", borderRadius: 10, padding: 16, marginTop: 16,
  },
  totalLabel: { fontSize: 14, color: "#555", fontWeight: "600" },
  totalNominal: { fontSize: 20, fontWeight: "bold", color: "#26A69A" },
  simpanBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 16, alignItems: "center", marginTop: 24,
  },
  simpanText: { color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 1 },
});
