import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { TouchableOpacity } from "react-native";
import API from "../../config";

export default function LaporanScreen() {
    const [laporan, setLaporan] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLaporan = async () => {
        try {
            const res = await fetch(`${API}/admin/laporan`);
            const data = await res.json();
            setLaporan(data);
        } catch (err) {
            console.log("Error fetch laporan:", err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLaporan();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchLaporan();
    }, []);
    
    const formatRupiah = (angka) => {
        return "Rp " + Number(angka).toLocaleString("id-ID");
    };

    const kartuLaporan = [
        {
            icon: "scale-outline",
            label: "Total Berat Sampah",
            nilai: `${laporan?.total_berat_kg ?? 0} kg`,
            color: "#26a69a",
            bg: "#E8F5E9"
        },
        {
            icon: "cash-outline",
            label: "Total Nilai Setoran",
            nilai: formatRupiah(laporan?.total_nilai_setor ?? 0),
            color: "#1976d2",
            bg: "#E3f2fd"
        },
        {
            icon: "archive-outline",
            label: "Total Transaksi Setor",
            nilai: `${laporan?.total_transaksi_setor ?? 0} transaksi`,
            color: "#7b1fa2",
            bg: "#f3e5f5"
        },
        {
            icon: "wallet-outline",
            label: "Saldo Admin",
            nilai: formatRupiah(laporan?.saldo_admin ?? 0),
            color: "#f57c00",
            bg: "#fff3e0"  
        },
    ];

    const exportPDF = async () => {
        const html = `
        <html>
        <head>
        <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
                h1 { color: #26A69A; font-size: 22px; margin-bottom: 4px; }
                p { color: #888; font-size: 13px; margin-bottom: 30px; }
                .kartu { background: #f9f9f9; border-radius: 10px; padding: 16px 20px; margin-bottom: 12px; border-left: 4px solid #26A69A; }
                .label { font-size: 13px; color: #888; margin-bottom: 4px; }
                .nilai { font-size: 20px; font-weight: bold; color: #333; }
        </style>
    </head>
    <body>
    <h1>Laporan Bank Sampah BotLoop</h1>
    <p>Rekap data bank sampah sekolah</p>
    
    <div class="kartu">
        <div class="label">Total Berat Sampah</div>
        <div class="nilai">${laporan?.total_berat_kg ?? 0} kg</div>
    </div>
    <div class="kartu">
        <div class="label">Total Nilai Setoran</div>
        <div class="nilai">${formatRupiah(laporan?.total_nilai_setor ?? 0)}</div>
    </div>
    <div class="kartu">
        <div class="label">Saldo Admin</div>
        <div class="nilai">${formatRupiah(laporan?.saldo_admin ?? 0)}</div>
    </div>
    </body>
    </html>
    `;
 
    try {
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    } catch (err) {
        console.log("Gagal export PDF.", err);
    }
};

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {/* HEader */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Laporan</Text>
                    <Text style={styles.headerSub}>Rekap data bank sampah sekolah</Text>
                </View>

                {/* kartu laporan */}
                <Text style={styles.sectionTitle}>Ringkasan</Text>

                {laporan ===  null ? (
                    <Text style={styles.loadingText}>Memuat data...</Text>
                ) : (
                    kartuLaporan.map((item, index) => (
                        <View key={index} style={styles.kartu}>
                            <View style={[styles.iconBox, {backgroundColor: item.bg}]}>
                                <Ionicons name={item.icon} size={24} color={item.color} />
                            </View>
                            <View style={styles.kartuInfo}>
                                <Text style={styles.kartuLabel}>{item.label}</Text>
                                <Text style={[styles.kartuNilai, {color: item.color}]}>
                                    {item.nilai}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
                
                <TouchableOpacity style={styles.btnExport} onPress={exportPDF}>
                    <Ionicons name="download-outline" size={20} color="#fff" />
                    <Text style={styles.btnExportText}>Export PDF</Text>
                </TouchableOpacity>

                    <View style={{height: 40}} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    header: {
        backgroundColor: "#26A69A",
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
    },
    headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
    headerSub: { color: "#B2DFDB", fontSize: 13, marginTop: 4 },
    sectionTitle: {
        fontSize: 16, fontWeight: "bold", color: "#333",
        marginHorizontal: 16, marginTop: 16, marginBottom: 8,
    },
    loadingText: {
        textAlign: "center", color: "#888", marginTop: 40,
    },
    kartu: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", marginHorizontal: 16,
        marginBottom: 10, borderRadius: 12, padding: 16,
        elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4,
    },
    iconBox: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: "center", alignItems: "center", marginRight: 14,
    },
    kartuInfo: { flex: 1 },
    kartuLabel: { fontSize: 13, color: "#888" },
    kartuNilai: { fontSize: 18, fontWeight: "bold", marginTop: 2 },
    btnExport: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        backgroundColor: "#26a69a", marginHorizontal: 16, marginTop: 16,
        padding: 14, borderRadius: 12, gap: 8,
    },
    btnExportText: {
        color: "#fff", fontWeight: "bold", fontSize: 15,
    },
});