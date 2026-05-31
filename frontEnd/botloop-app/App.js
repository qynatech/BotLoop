import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardUser from "./screens/user/DashboardUser";
import RiwayatScreen from "./screens/user/RiwayatScreen";
import ProfilScreen from "./screens/user/ProfilScreen";
import DashboardAdmin from "./screens/admin/DashboardAdmin";
import InputSetoranScreen from "./screens/admin/InputSetoranScreen";
import PenarikanPendingScreen from "./screens/admin/PenarikanPendingScreen";
import RiwayatAdminScreen from "./screens/admin/RiwayatAdminScreen";
import SplashScreen from "./screens/SplashScreen";
import LaporanScreen from "./screens/admin/LaporanScreen";

const Tab = createBottomTabNavigator();

function UserTabs({ user, onLogout }) {
    return (
        <Tab.Navigator 
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#26a69a",
            tabBarInactiveTintColor: "#888",
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "Beranda") iconName = "home-outline";
                else if (route.name === "Riwayat") iconName = "time-outline";
                else if (route.name === "Profil") iconName = "person-outline";
                return <Ionicons name={iconName} size={size} color={color} />
            },
        })} 
        >

            <Tab.Screen 
            name="Beranda">
            {(props)=> <DashboardUser {...props} user={user} onLogout={onLogout}/> } 
            </Tab.Screen>

            <Tab.Screen 
            name="Riwayat">
            {() => <RiwayatScreen  user={user} />} 
            </Tab.Screen>

            <Tab.Screen 
            name="Profil">
            {() => <ProfilScreen user={user} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function AdminTabs({ user, onLogout }) {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#26a69a",
            tabBarInactiveTintColor: "#888",
            tabBarIcon: ({ color, size}) => {
                let iconName;
                if (route.name === "Dashboard") iconName = "home-outline";
                else if (route.name === "Setoran") iconName = "archive-outline";
                else if (route.name === "Penarikan") iconName = "wallet-outline";
                else if (route.name === "Riwayat") iconName = "time-outline";
                else if (route.name === "Laporan") iconName = "bar-chart-outline";
                return <Ionicons name={iconName} size={size} color={color}/>
            },
        })}
    >
        <Tab.Screen name="Dashboard">
            {(props) => <DashboardAdmin {...props} user={user} onLogout={onLogout} />}
        </Tab.Screen>
        <Tab.Screen name="Setoran">
            {(props) => <InputSetoranScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Penarikan">
            {(props) => <PenarikanPendingScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Riwayat">
            {(props) => <RiwayatAdminScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Laporan">
            {(props) => <LaporanScreen {...props} />}
        </Tab.Screen>
    </Tab.Navigator>
    );
}

export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [user, setUser] = useState(null);
    const [screen, setScreen] = useState("login");

    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedUser = await AsyncStorage.getItem("user");
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.log(err);
            }
        };
        loadSession();
    }, []);

    const handleLogin = async (userData) => {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        setUser(null);
        setScreen("login");
    };

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />
    }

    if(!user) {
       if (screen === "register") {
        return (
        <RegisterScreen 
        onLogin={() => setScreen("login")}
        onLoginSuccess={handleLogin}
        />
       );
    }
    return (
        <LoginScreen
        onLogin={handleLogin}
        onDaftar={() => setScreen("register")}
        />
    );
}

    if (user.role === "admin") {
        return ( <NavigationContainer>
            <AdminTabs user={user} onLogout={handleLogout} />
        </NavigationContainer> 
        );
    }
    return (
        <NavigationContainer>
            <UserTabs user={user}  onLogout={handleLogout} />
        </NavigationContainer>
    );
}