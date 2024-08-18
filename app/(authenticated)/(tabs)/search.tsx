import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { useSearch } from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { Menu } from "@/components/menu";
import { Route } from "@/utils/types";
import { useTheme } from "@/contexts/theme-context";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Loading } from "@/components/loading";
import { addToSearchHistory, deleteSearchHistory } from "@/utils/helpers";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const { auth, sdk } = useReactiveClient(client);
  const dynamicId = auth.authenticatedUser?.userId;
  const { data, isLoading, isError } = useSearch(dynamicId);
  const searchBarRef = useRef(null);
  const { theme } = useTheme();
  const handleSearch = async () => {
    await addToSearchHistory(dynamicId, searchText);
  };

  const clearSearchHistory = async () => {
    await deleteSearchHistory(dynamicId);
  };

  const handleOutsideClick = useCallback(() => {
    Keyboard.dismiss();
    if (searchText.trim() === "") {
      setSearchText("");
    }
  }, [searchText]);

  useEffect(() => {
    if (!isLoading && data) {
      const newRoutes = data.map((searchItem) => ({
        name: searchItem,
        href: `post/${searchItem.split("/").pop()}` as Href<string>,
      }));
      console.log(newRoutes);
      setRoutes(newRoutes);
    }
  }, [data, isLoading]);

  if (!sdk.loaded || isLoading || isError) {
    return <Loading error={isError ? "Error loading profile" : null} />;
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
            <View className="mt-8">
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
