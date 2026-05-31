import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import API from "../config";

export default function LoginScreen({ onLogin, onDaftar }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("error", "email dan password wajib diisi");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.user) {
                onLogin(data.user);
            } else {
                Alert.alert("gagal", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "gagal connect ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
           <Text style={styles.logo}>BotLoop</Text>
           <View style={styles.form}>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#aaa" style={styles.icon}/>
                <TextInput 
                placeholder="Masukkan Email"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none" />
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
                secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18} color="#aaa" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginText}>{loading ? "Loading..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDaftar} style={styles.daftarLink}>
                <Text style={styles.daftarText}>
                    Belum punya akun? <Text style={styles.daftarBold}>Daftar</Text>
                </Text>
            </TouchableOpacity>

           </View>
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  logo: {
    fontSize: 36, fontWeight: "bold", color: "#26A69A",
    textAlign: "center", marginBottom: 40,
  },
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
  loginBtn: {
    backgroundColor: "#26A69A", borderRadius: 10,
    padding: 14, alignItems: "center", marginTop: 24,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  daftarLink: { marginTop: 20, alignItems: "center" },
  daftarText: { color: "#888", fontSize: 13 },
  daftarBold: { color: "#26A69A", fontWeight: "bold" },
});
