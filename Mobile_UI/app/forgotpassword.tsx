import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ForgotPass() {
  const router = useRouter();
  const [natId, setNatId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!natId || !email || !phone) return Alert.alert("Error", "Fill all fields");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      await addDoc(collection(db, "requests"), {
        nationalID: natId,
        mobileNumber: phone,
        email: email.trim(),
        type: "password_reset",
        status: "sent",
        createdAt: serverTimestamp()
      });
      setLoading(false);
      Alert.alert("Success", "Reset link sent!");
      router.back();
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Check your data and connection.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        
        <Text style={styles.label}>National ID</Text>
        <TextInput style={styles.input} placeholder="14-digit ID" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setNatId} />
        
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#999" keyboardType="phone-pad" onChangeText={setPhone} />
        
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" onChangeText={setEmail} />
        
        <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 25, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a3a8a', marginBottom: 20, textAlign: 'center' },
  label: { color: '#333', fontWeight: '600', marginBottom: 5, fontSize: 12 },
  input: { height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingLeft: 10, marginBottom: 15, color: '#000', backgroundColor: '#fff' },
  btn: { height: 50, backgroundColor: '#1a3a8a', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
