import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 detik
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")}
      style={{ width: 125, height: 125 }}
      resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#26a69a",
        justifyContent: "center", alignItems: "center",
    },
    logo: {
        fontSize: 36, fontWeight: "bold",
        color: "#fff", marginTop: 16,
    },
    tagline: {
        fontSize: 13, color: "#b2dfdb", marginTop: 8,
    },
});