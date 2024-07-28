import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/Menu";
import { Route } from "@/utils/types";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const { data, isLoading, isError } = useSearch();

  const address = "0x1234567890abcdef1234567890abcdef12345678";

  const handleSearch = useCallback(() => {
    const id = searchText.split("/").pop();
    router.push(`/(authenticated)/item/${id}`);
  }, [searchText, router]);

  const clearSearchHistory = async () => {
    const { error } = await supabase
      .from("Search")
      .update({ show: false })
      .eq("show", true)
      .eq("address", address);
    if (error) {
      console.error("Error clearing all alerts", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-background">
        <Text>Error loading profile</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 bg-background">
        <Text>No profile data found</Text>
      </View>
    );
  }

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
        <TouchableOpacity onPress={clearSearchHistory}>
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
