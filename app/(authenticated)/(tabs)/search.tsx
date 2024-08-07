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
import { useRouter, Href } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useSearch } from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { Menu } from "@/components/menu";
import { Route } from "@/utils/types";
import { useTheme } from "@/contexts/theme-context";
import { ActivityIndicator } from "react-native";
import { Header } from "@/components/header";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const { data, isLoading, isError } = useSearch();
  const searchBarRef = useRef(null);
  const { theme } = useTheme();

  const address = "0x1234567890abcdef1234567890abcdef12345678";

  const handleSearch = useCallback(() => {
    const id = searchText.split("/").pop();
    router.push(`/(authenticated)/item/${id}` as Href);
  }, [searchText, router]);

  const clearSearchHistory = async () => {
    const { error } = await supabase
      .from("Search")
      .delete()
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

  if (isLoading) return <ActivityIndicator />;

  if (isError) {
    return (
      <View
        className="flex-1"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <Text style={{ color: theme.textColor }}>Error loading profile</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View
        className="flex-1"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <Text style={{ color: theme.textColor }}>No profile data found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
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
                <Text
                  className="text-xl font-semibold"
                  style={{ color: theme.textColor }}
                >
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={{ color: theme.tintColor }}>Clear</Text>
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
    const { theme } = useTheme();
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
          style={{
            color: theme.textColor,
            backgroundColor: theme.backgroundColor,
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2"
          ></TouchableOpacity>
        )}
      </View>
    );
  }
);

export default SearchScreen;
