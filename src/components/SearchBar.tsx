import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type SearchBarProps = {
  city: string;
  setCity: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ city, setCity, onSearch }: SearchBarProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 8,
          fontSize: 18,
          marginBottom: 12,
        }}
        placeholder="Kirjoita kaupunki"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#1e90ff',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={onSearch}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Hae sää kaupungin perusteella
        </Text>
      </TouchableOpacity>
    </View>
  );
}