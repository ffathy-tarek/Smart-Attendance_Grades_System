  import { useRouter } from 'expo-router';
  import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
  import React, { useState } from 'react';
  import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
  import { db } from '../firebaseConfig';

  export default function AddRequest() {
    const router = useRouter();
    const [role, setRole] = useState('student'); 
    const [name, setName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const submitData = async () => {
      if (!name || !nationalId || !email) return Alert.alert("Error", "All fields are required!");
      setLoading(true);
      try {
        await addDoc(collection(db, "requests"), {
          fullName: name,
          nationalID: nationalId,
          role: role,
          universityCode: role === 'student' ? uniCode : "N/A",
          email: email.trim(),
          status: "pending",
          type: "new_registration",
          createdAt: serverTimestamp()
        });
        setLoading(false);
        Alert.alert("Success", "Request sent to Admin.");
        router.back();
      } catch (e) {
        setLoading(false);
        Alert.alert("Error", "Failed to send request.");
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>New Request</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Enter name" placeholderTextColor="#999" onChangeText={setName} />
          
          <Text style={styles.label}>National ID</Text>
          <TextInput style={styles.input} placeholder="14 digits" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setNationalId} />

          <Text style={styles.label}>Register as:</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity style={[styles.roleBtn, role === 'student' && styles.activeRole]} onPress={() => setRole('student')}>
              <Text style={[styles.roleText, role === 'student' && styles.activeText]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleBtn, role === 'instructor' && styles.activeRole]} onPress={() => setRole('instructor')}>
              <Text style={[styles.roleText, role === 'instructor' && styles.activeText]}>Instructor</Text>
            </TouchableOpacity>
          </View>

          {role === 'student' && (
            <>
              <Text style={styles.label}>University Code</Text>
              <TextInput style={styles.input} placeholder="University Code" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setUniCode} />
            </>
          )}

          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" onChangeText={setEmail} />

          <TouchableOpacity style={styles.btn} onPress={submitData} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 15, padding: 25, elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1a3a8a', marginBottom: 20, textAlign: 'center' },
    label: { color: '#333', fontWeight: '600', marginBottom: 5, fontSize: 12 },
    input: { height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingLeft: 10, marginBottom: 15, color: '#000', backgroundColor: '#fff' },
    roleRow: { flexDirection: 'row', marginBottom: 20 },
    roleBtn: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginHorizontal: 5 },
    activeRole: { backgroundColor: '#1a3a8a' },
    roleText: { color: '#666', fontWeight: 'bold' },
    activeText: { color: '#fff' },
    btn: { height: 50, backgroundColor: '#1a3a8a', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    btnText: { color: '#fff', fontWeight: 'bold' }
  });
