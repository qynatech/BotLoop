import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import API from "../config";

export default function RegisterScreen({ onLogin, onLoginSuccess }) {
    const [nama, setNama] = useState("");
    const [kelas, setKelas] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nama || !kelas || !email || !password) {
            Alert.alert("Error", "Semua field wajib diisi");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ nama, kelas, email, password}),
            });

            const data = await response.json();

            if (data.message === "Register berhasil") {
                const loginRes = await fetch(`${API}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const loginData = await loginRes.json();
                if (loginData.user) {
                    onLoginSuccess(loginData.user);
                }
            } else {
                Alert.alert("Gagal", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal connect ke server");
        } finally {
            setLoading(false);
        }
    };
     
    return (
       <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner}>

            <Text style={styles.logo}>BotLoop</Text>
            <Text style={styles.title}>Buat Akun Baru</Text>

            <View style={styles.form}>

                <Text style={styles.label}>Nama</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color="#aaa" style={styles.icon} />
                    <TextInput
                    placeholder="Masukkan Nama Lengkap"
                    placeholderTextColor="#bbb"
                    value={nama}
                    onChangeText={setNama}
                    style={styles.input}
                    />
                </View>

                <Text style={styles.label}>Kelas</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="school-outline" size={18} color="#aaa" style={styles.icon} />
                    <TextInput
                    placeholder="Masukkan Kelas"
                    placeholderTextColor="#bbb"
                    value={kelas}
                    onChangeText={setKelas}
                    style={styles.input}
                />
                </View>

                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={18} color="#aaa" style={styles.icon} />
                    <TextInput
                    placeholder="Masukkan Email"
                    placeholderTextColor="#bbb"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.icon} />
                    <TextInput
                    placeholder="Masukkan Password"
                    placeholderTextColor="#bbb"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons 
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={18} color="#aaa"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.registerText}>{loading ? "Loading..." : "Daftar"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
                    <Text style={styles.loginText}>
                        Sudah punya akun? <Text style={styles.loginBold}>Login</Text>
                    </Text>
                </TouchableOpacity>
                
         </View>
        </ScrollView>
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    inner: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 32, paddingVertical: 40 },
    logo: { fontSize: 28, fontWeight: "bold", color: "#26a69a", textAlign: "center", marginBottom: 4 },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 24, color: "#333" },
    form: { width: "100%" },
    label: { fontSize: 11, fontWeight: "bold", color: "#555", marginBottom: 6, marginTop: 12 },
    inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4,
    backgroundColor: "#fafafa",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: "#333" },
  registerBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 14, alignItems: "center", marginTop: 24,
  },
  registerText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginLink: { marginTop: 20, alignItems: "center" },
  loginText: { color: "#888", fontSize: 13 },
  loginBold: { color: "#26A69A", fontWeight: "bold" },  
});