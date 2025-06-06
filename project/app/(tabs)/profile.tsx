import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { User, MapPin, Bell, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout', 
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive' }
      ]
    );
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileIconContainer}>
          <User size={32} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Guest User</Text>
          <Text style={styles.profileEmail}>guest@example.com</Text>
        </View>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <View style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <MapPin size={20} color="#FF8C00" />
          </View>
          <Text style={styles.menuItemText}>Saved Addresses</Text>
          <ChevronRight size={20} color="#999" />
        </View>
        
        <View style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <CreditCard size={20} color="#FF8C00" />
          </View>
          <Text style={styles.menuItemText}>Payment Methods</Text>
          <ChevronRight size={20} color="#999" />
        </View>
        
        <View style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <Bell size={20} color="#FF8C00" />
          </View>
          <Text style={styles.menuItemText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#D1D1D6', true: '#FFD0A1' }}
            thumbColor={notificationsEnabled ? '#FF8C00' : '#F4F4F4'}
            style={Platform.OS === 'ios' ? styles.switch : {}}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <HelpCircle size={20} color="#FF8C00" />
          </View>
          <Text style={styles.menuItemText}>Help Center</Text>
          <ChevronRight size={20} color="#999" />
        </View>
      </View>
      
      <View style={styles.logoutContainer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF8C00',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  logoutContainer: {
    margin: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});