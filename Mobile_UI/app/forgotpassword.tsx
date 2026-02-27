import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function ForgotPass() {
  const router = useRouter();
  const [natId, setNatId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!natId || !email || !phone) {
      return Alert.alert("Missing Info", "Please fill all fields!");
    }
    if (isNaN(Number(natId)) || natId.length < 10) {
      return Alert.alert("Invalid ID", "National ID must be numbers and correct length!");
    }
    if (isNaN(Number(phone))) {
      return Alert.alert("Invalid Phone", "Mobile number must be numbers only!");
    }
    if (!email.includes('@') || !email.includes('.')) {
      return Alert.alert("Invalid Email", "Please enter a valid academic email!");
    }

    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        Alert.alert("Success", "A reset link has been sent to: " + email);
        router.back();
      })
      .catch(() => {
        setLoading(false);
        Alert.alert("Error", "This email is not registered in our database.");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        
        <Text style={styles.label}>National ID</Text>
        <TextInput style={styles.input} placeholder="Your 14-digit ID" keyboardType="numeric" onChangeText={setNatId} />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput style={styles.input} placeholder="01xxxxxxxxx" keyboardType="phone-pad" onChangeText={setPhone} />
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="****@std.sci.edu.eg" onChangeText={setEmail} />
        
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
  input: { height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingLeft: 10, marginBottom: 15 },
  btn: { height: 50, backgroundColor: '#1a3a8a', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});