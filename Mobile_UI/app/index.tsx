import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = () => {
    if (!id || !pass) {
      return Alert.alert("Missing Data", "Please enter ID and Password");
    }

    setLoading(true); 

    const isStudent = !isNaN(Number(id));
    const userEmail = isStudent ? `${id}@std.sci.edu.eg` : `${id}@sci.edu.eg`; 

    signInWithEmailAndPassword(auth, userEmail, pass)
      .then(() => {
        setLoading(false); 
        router.replace('/dashboard' as any); 
      })
      .catch((error) => {
        setLoading(false); 
        Alert.alert("Login Failed", "Invalid ID or Password. Make sure you are registered.");
      });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity onPress={() => router.push('/add-request' as any)} style={styles.topBtn}>
        <Text style={styles.topBtnText}>Add Request</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.subText}>Login using your University ID</Text>

        <Text style={styles.label}>University Code</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your University Code " 
          placeholderTextColor="#aaa"
          onChangeText={setId}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your password" 
          placeholderTextColor="#aaa"
          secureTextEntry 
          onChangeText={setPass}
        />

        <TouchableOpacity onPress={() => router.push('/forgotpassword' as any)}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginBtn, loading && { backgroundColor: '#ccc' }]} 
          onPress={handleLogin}
          disabled={loading} 
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
  topBtn: { position: 'absolute', top: 60, right: 20, zIndex: 10, padding: 10, backgroundColor: '#eef6ff', borderRadius: 8 },
  topBtnText: { color: '#1a3a8a', fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 25, elevation: 5 },
  welcome: { fontSize: 26, fontWeight: 'bold', color: '#1a3a8a', textAlign: 'center', marginBottom: 5 },
  subText: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 30 },
  label: { color: '#333', fontWeight: '600', marginBottom: 5, fontSize: 12 },
  input: { width: '100%', height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingLeft: 10, marginBottom: 15, color: '#000' },
  forgot: { alignSelf: 'flex-end', color: '#1a3a8a', fontWeight: 'bold', marginBottom: 25, fontSize: 13 },
  loginBtn: { width: '100%', height: 50, backgroundColor: '#1a3a8a', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});