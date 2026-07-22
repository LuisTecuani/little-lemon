import { View, Text, StyleSheet, Image, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { createTable, getMenuItems, saveMenuItems } from "../infrastructure/database";

export default function Home({ navigation, checkOnboardingCompleted }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUri, setAvatarUri] = useState('');
    const [menu, setMenu] = useState([]);

    const storage = AsyncStorage;
    
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
                if (!menuItems || menuItems.length === 0) {
                    const fetchedItems = await fetchMenu();
                    await saveMenuItems(fetchedItems);
                    menuItems = await getMenuItems();
                    setMenu(menuItems);
                } else {
                    setMenu(menuItems);
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        })()
    }, []);
        

    async function getUser() {
        const user = await storage.getItem('user');
        const { firstName, lastName, avatarUri } = JSON.parse(user || '{}');
        setFirstName(firstName || '');
        setLastName(lastName || '');
        setAvatarUri(avatarUri || '');
    }

    async function fetchMenu() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json')
            const data = await response.json()
            setMenu(data.menu);
            return data.menu;
        } catch (error) {
            console.log('Error fetching menu');
            return [];
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header firstName={firstName} lastName={lastName} avatarUri={avatarUri} navigation={navigation} />
            <View style={styles.aboutBlock}>
                <Text style={styles.aboutTitle}>Little Lemon</Text>
                <View style={styles.heroBlock}>
                    <View style={styles.aboutTexts}>
                        <Text style={styles.aboutSubtitle}>Chicago</Text>
                        <Text style={styles.aboutText}>
                            We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                        </Text>
                    </View>
                    <Image source={require('../../assets/images/hero-image.png')} resizeMode="cover" style={styles.image} />
                </View>
                <View style={styles.search}>
                    <Icon name="search-circle" size={50} color={theme.colors.highlightLight} style={styles.searchIcon} />
                </View>
            </View>
            <View style={styles.deliveryBlock}>
                <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>
                <View style={styles.categoryFilter}>
                    <Pressable style={styles.categoryBtn}>
                        <Text>Starters</Text>
                    </Pressable>
                    <Pressable style={styles.categoryBtn}>
                        <Text>Mains</Text>
                    </Pressable>
                    <Pressable style={styles.categoryBtn}>
                        <Text>Desserts</Text>
                    </Pressable>
                    <Pressable style={styles.categoryBtn}>
                        <Text>Drinks</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.menuContainer}>
                <FlatList
                    data={menu}
                    renderItem={({ item }) => (
                        <View style={styles.menuItem}>
                            <Text style={styles.menuTitle}>{item.name}</Text>
                            <View style={styles.menuItemBody}>
                                <View style={styles.menuItemInfo}>
                                    <Text style={styles.menuDescription}>{item.description}</Text>
                                    <Text style={styles.menuPrice}>${item.price}</Text>
                                </View>
                                <Image source={{uri: "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/"+item.image+"?raw=true"}} resizeMode="cover" style={styles.menuImage} />
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.name}
                    ItemSeparatorComponent={() => <View style={styles.menuSeparator} />}
                    

                />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.highlightLight,
    },
    aboutBlock: {
        backgroundColor: theme.colors.primary1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    aboutTitle: {
        fontSize: 64,
        fontFamily: theme.fonts.heading,
        color: theme.colors.primary2,
        textAlign: 'left',
    },
    aboutSubtitle: {
        fontSize: 40,
        fontFamily: theme.fonts.heading,
        color: theme.colors.highlightLight,
        textAlign: 'left',
    },
    aboutText: {
        fontSize: 18,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightLight,
        textAlign: 'left',
        marginTop: 10,
    },
    heroBlock: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.primary1,
    },
    aboutTexts: {
        width: '65%',
    },
    image: {
        height: '100%',
        width: '35%',
        borderRadius: 10,
    },
    search: {
        alignItems: 'flex-start',
    },
    searchIcon: {
        marginTop: 10,
        paddingLeft: 20,
    },
    deliveryBlock: {
        backgroundColor: theme.colors.highlightLight,
        paddingHorizontal: 10,
    },
    deliveryText: {
        fontSize: 24,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightDark,
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 10,
    },
    categoryFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    categoryBtn: {
        backgroundColor: theme.colors.secondary2,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    menuContainer: {
        flex: 1,
        backgroundColor: theme.colors.highlightLight,
    },
    menuItem: {
        backgroundColor: theme.colors.highlightLight,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    menuTitle: {
        fontSize: 24,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightDark,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    menuItemBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    menuItemInfo: {
        width: '70%',
    },
    menuImage: {
        height: '100%',
        width: '30%',
        borderRadius: 10,
    },
    menuDescription: {
        fontSize: 18,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightDark,
        textAlign: 'left',
        marginTop: 10,
    },
    menuPrice: {
        fontSize: 20,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightDark,
        fontWeight: 500,
        textAlign: 'left',
        marginTop: 10,
    },
    menuSeparator: {
        height: 1,
        backgroundColor: theme.colors.secondary1,
        opacity: 0.3,
    }
});