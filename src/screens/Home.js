import { View, Text, StyleSheet, Image, FlatList, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import Header from "../components/Header";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { createTable, getMenuItems, saveMenuItems, findByCategories, findBySearchTerm } from "../infrastructure/database";

export default function Home({ navigation, checkOnboardingCompleted }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUri, setAvatarUri] = useState('');
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const isInitialMount = useRef(true);
    const [toggleCategories, setToggleCategories] = useState({
        starters: false,
        mains: false,
        desserts: false,
        drinks: false,
    });

    const handleToggle = (category) => {
        setSearchTerm('');
        setToggleCategories(prevStates => ({...prevStates, [category]: !prevStates[category]}));
    }

    const categories = ['starters', 'mains', 'desserts', 'drinks'];

    const storage = AsyncStorage;
    
    useEffect(() => {
        fetchInitialData();
        getUser();
    }, []);
    
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (searchTerm.trim() !== '') {
            return;
        }
        const updateMenu = async () => {
            let activeCategories = Object.keys(toggleCategories).filter(category => toggleCategories[category]);
            if (activeCategories.length === 0) {
                activeCategories = [];
            }
            const updatedMenu = await findByCategories([...activeCategories]);
            setMenu(updatedMenu);
        };
        updateMenu();
    }, [toggleCategories]);

    async function getUser() {
        const user = await storage.getItem('user');
        const { firstName, lastName, avatarUri } = JSON.parse(user || '{}');
        setFirstName(firstName || '');
        setLastName(lastName || '');
        setAvatarUri(avatarUri || '');
    }

    const fetchInitialData = async () => {
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
                console.log(error);
            }
        };

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

    function handleSearchChange(text) {
        setSearchTerm(text);
    }

    const handleSearchBlur = async () => {
        setToggleCategories({starters: false, mains: false, desserts: false, drinks: false});
        const updatedMenu = await findBySearchTerm(searchTerm);
        setMenu(updatedMenu);
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
                    <Icon name="search" size={35} color={theme.colors.highlightDark} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={theme.colors.highlightLight}
                        value={searchTerm}
                        onChangeText={handleSearchChange}
                        onBlur={handleSearchBlur}
                    />
                </View>
            </View>
            <View style={styles.deliveryBlock}>
                <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>
                <View style={styles.categoryFilter}>
                    {categories.map(category => {
                        const isActive = toggleCategories[category];
                        return (
                        <Pressable 
                            key={category}
                            onPress={() => handleToggle(category)}
                            style={({pressed}) => [
                                styles.buttonBase,
                                isActive ? styles.categoryBtnActive : styles.categoryBtnInactive
                            ]}
                        >
                            {({pressed}) => (
                                <Text 
                                style={[
                                    styles.textBase,
                                    isActive ? styles.textActive : styles.textInactive
                                ]}
                                >
                                    {category.toUpperCase()}
                                </Text>
                            )}
                        </Pressable>
                    )})}
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
        paddingBottom: 6,
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
        marginTop: 8,
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
        marginTop: -28,
    },
    image: {
        height: '90%',
        width: '35%',
        borderRadius: 10,
    },
    search: {
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
        backgroundColor: theme.colors.highlightLight,
        paddingHorizontal: 10,
        height: 45,
        borderRadius: 16,
        width: '90%',
    },
    searchIcon: {
        alignSelf: 'center',
    },
    searchInput: {
        height: '100%',
        width: '80%',
        alignSelf: 'center',
        fontFamily: theme.fonts.regular,
        fontSize: 22,
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
    buttonBase: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 16,
    },
    categoryBtnInactive: {
        backgroundColor: theme.colors.secondary2,
    },
    categoryBtnActive: {
        backgroundColor: theme.colors.primary1,
    },
    textBase: {
        fontSize: 16,
        fontFamily: theme.fonts.regular,
        color: theme.colors.highlightDark,
        textAlign: 'left',
        fontWeight: '500',
    },
    textActive: {
        color: theme.colors.primary2,
    },
    textInactive: {
        color: theme.colors.highlightDark,
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
        fontWeight: '500',
        textAlign: 'left',
        marginTop: 10,
    },
    menuSeparator: {
        height: 1,
        backgroundColor: theme.colors.secondary1,
        opacity: 0.3,
    }
});