import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import API from "../../config";

export default function TarikSaldoScreen({ user, onBack, onSuccess }) {
    const [nominal, setNominal] = useState("");
    const [loading, setLoading] = useState(false);
    
    const quickAmounts = [10000, 25000, 50000];

    const formatRupiah = (angka) => {
        return "Rp" + Number(angka).toLocaleString("id-ID");
    };

    const handleTarik = async () => {
        const jumlah = parseInt(nominal);

        if(!jumlah || jumlah <= 0) {
            Alert.alert("Error", "Masukkan nominal yang valid");
            return;
        }

        if (jumlah < 10000) {
            Alert.alert("Error", "Minimal penarikan Rp10.000");
            return;
        }

        if (jumlah > user.saldo) {
            Alert.alert("Error", "Saldo tidak mencukupi");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch (`${API}/tarik`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, jumlah }),
            });

           const data = await res.json();
           Alert.alert("Berhasil", "Permintaan penarikan dikirim, menunggu persetujuan admin.", [
            { text: "OK", onPress: onBack }
         ]);
     } catch (err) {
      Alert.alert("Error", "Gagal connect ke server");
    } finally {
      setLoading(false);
    }
  };

 return ( <SafeAreaView style={styles.container}>
    {/* header */}
    <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarik Saldo</Text>
        <View style={{ width: 24 }} />
    </View>

    <ScrollView contentContainerStyle={styles.content}>
        {/* Info saldo */}
        <View style={styles.saldoBox}>
            <Text style={styles.saldoLabel}>Saldo:</Text>
            <View style={styles.row}>
                <Text style={styles.saldoNominal}>{formatRupiah(user.saldo)}</Text>
                <Ionicons name="wallet-outline" size={22} color="#26a69a" />
            </View>
        </View>

        { /*input nominal */}
        <Text style={styles.label}>Nominal</Text>
        <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>Rp</Text>
            <TextInput
            placeholder="0"
            placeholderTextColor="#bbb"
            value={nominal}
            onChangeText={setNominal}
            style={styles.input}
            keyboardType="numeric"
            />
        </View>

        <Text style={styles.minText}>*Minimal Rp10.000</Text>

        {/* quick amount */}
        <View style={styles.quickRow}>
            {quickAmounts.map((amt)=>(
                <TouchableOpacity 
                key={amt} 
                style={styles.quickBtn} 
                onPress={() => setNominal(String(amt))}>
                    <Text style={styles.quickText}>{formatRupiah(amt)}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Peringatan */}
        <View style={styles.warningBox}>
            <Ionicons name="information-circle-outline" size={18} color="#f57c00" />
            <Text style={styles.warningText}>
                Penarikan akan diproses oleh admin. Kamu bisa mengambil uang di tempat setor setelah disetujui
            </Text>
        </View>

        {/* tombol */}
        <TouchableOpacity style={styles.tarikBtn}
        onPress={handleTarik}
        disabled={loading}>
            <Text style={styles.tarikText}>{loading ? "Loading..." : "Ajukan Penarikan"}</Text>
        </TouchableOpacity>

    </ScrollView>
 </SafeAreaView>
     );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#26A69A", paddingHorizontal: 16, paddingVertical: 14, paddingTop: 25,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 16 },
  saldoBox: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    marginBottom: 20, elevation: 1,
  },
  saldoLabel: { fontSize: 13, color: "#888" },
  row: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  saldoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  saldoNominal: { fontSize: 24, fontWeight: "bold", color: "#333" },
  label: { fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1,
    borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 12,
  },
  prefix: { fontSize: 16, color: "#333", marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  minText: { fontSize: 11, color: "#888", marginTop: 6, marginBottom: 16 },
  quickRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  quickBtn: {
    flex: 1, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1,
    borderColor: "#26A69A", padding: 10, alignItems: "center",
  },
  quickText: { color: "#26A69A", fontWeight: "600", fontSize: 13 },
  warningBox: {
    flexDirection: "row", backgroundColor: "#FFF3E0", borderRadius: 10,
    padding: 12, gap: 8, marginBottom: 24,
  },
  warningText: { flex: 1, fontSize: 12, color: "#F57C00", lineHeight: 18 },
  tarikBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 16, alignItems: "center",
  },
  tarikText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});