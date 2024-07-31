import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/Menu";
import { Route } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const { data, isLoading, isError } = useSearch();
  const searchBarRef = useRef(null);

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

  const handleOutsideClick = useCallback(() => {
    Keyboard.dismiss();
    if (searchText.trim() === "") {
      setSearchText("");
    }
  }, [searchText]);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View>
              <SearchBar
                ref={searchBarRef}
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
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type SearchBarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
};

const SearchBar = React.forwardRef<TextInput, SearchBarProps>(
  ({ searchText, setSearchText, handleSearch }, ref) => {
    const handleClear = () => {
      setSearchText("");
      if (ref && typeof ref !== "function") {
        ref.current?.blur();
      }
    };

    return (
      <View className="p-4 relative">
        <Input
          ref={ref}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          search
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2"
          >
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default SearchScreen;
