import React from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

type FavoritesListProps = {
  favorites: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
};

export default function FavoritesList({
  favorites,
  onSelect,
  onRemove
}: FavoritesListProps) {
  if (favorites.length === 0) return null;

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontSize: 20, color: '#fff', marginBottom: 8 }}>
        Suosikit:
      </Text>

      <FlatList
        horizontal
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ marginRight: 12, position: 'relative' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#27c0ef',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                width: width / 4,
                alignItems: 'center'
              }}
              onPress={() => onSelect(item)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {item}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: '#ff4d4d',
                borderRadius: 12,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => onRemove(item)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}