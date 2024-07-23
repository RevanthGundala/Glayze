import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Route } from "@/types/types";
import { useEffect } from "react";
import { Menu } from "@/components/Menu";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");

  // TODO: Fetch recent searches from API
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "https://x.com/ElonMusk/123213",
    "Crypto",
    "memes",
  ]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const handleSearch = () => {
    // TODO: Implement search functionality
  };

  const handleClear = () => {
    setRecentSearches([]);
  };

  useEffect(() => {
    setRoutes(recentSearches.map((search) => ({ name: search, href: "/" })));
  }, [recentSearches]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
      />
      <View className="flex-row justify-between items-center px-6 pt-2 pb-6">
        <Text className="text-white text-xl font-semibold">
          Recent Searches
        </Text>
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-white">Clear</Text>
        </TouchableOpacity>
      </View>

      <Menu routes={routes} search />
    </SafeAreaView>
  );
};

type SearchBarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
};

const SearchBar = ({
  searchText,
  setSearchText,
  handleSearch,
}: SearchBarProps) => {
  return (
    <View className="p-4">
      <Input
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        search
      />
    </View>
  );
};

export default SearchScreen;
