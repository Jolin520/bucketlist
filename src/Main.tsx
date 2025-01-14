import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { Icon, NativeBaseProvider } from 'native-base';
import React, { useContext } from 'react';
import { Context } from '../App';
import { theme } from './core/theme';
import {
    AboutScreen,
    ContactScreen,
    HomeScreen,
    LoadingScreen,
    LoginScreen,
    LogoutScreen,
    PrivacyPolicyScreen,
    ProfileScreen,
    SignupScreen,
    SponsorScreen,
    TermsScreen,
    ResetScreen,
    
} from './screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type ScreenMap = {
    [key: string]: {
        url: string;
        component: React.FunctionComponent;
        provider?: any;
        icon?: string;
    };
};

/**
 * Screens that do not require a JWT
 */
export const unprotectedScreens: ScreenMap = {
    Login: {
        url: '/bucketlist/login',
        component: LoginScreen
    },
    Signup: {
        url: '/bucketlist/signup',
        component: SignupScreen
    },
    Reset:{
        url: '/bucketlist/reset',
        component: ResetScreen
    },
    
    About:{
        url: '/bucketlist/about',
        component: AboutScreen
    },
    Sponsor: {
        url: '/bucketlist/sponsor',
        component: SponsorScreen
    },
    Terms: {
        url: 'bucketlist/terms',
        component: TermsScreen
    },
    Privacy: {
        url: 'bucketlist/privacy',
        component: PrivacyPolicyScreen
    },
    Contact: {
        url: 'bucketlist/contact',
        component: ContactScreen
    } 
};

/**
 * Screens that require a JWT (authentication)
 */
export const protectedScreens: ScreenMap = {
    Home: {
        url: '/bucketlist/home',
        component: HomeScreen,
        provider: AntDesign,
        icon: 'home'
    },
    Profile: {
        url: '/bucketlist/profile',
        component: ProfileScreen,
        provider: AntDesign,
        icon: 'user'
    },
    Logout: {
        url: '/bucketlist/logout',
        component: LogoutScreen,
        provider: MaterialIcons,
        icon: 'logout'
    }
};

const linking = {
    prefixes: [Linking.createURL('/'), 'https://cis-linux2.temple.edu'],
    config: {
        screens: {
            ...Object.keys(unprotectedScreens).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: unprotectedScreens[key].url
                }),
                {}
            ),
            ...Object.keys(protectedScreens).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: protectedScreens[key].url
                }),
                {}
            )
        }
    }
};

const Main = () => {
    const { token, loadingContext } = useContext(Context);

    if (loadingContext) {
        return <LoadingScreen />;
    }

    if (!token) {
        return (
            <NavigationContainer linking={linking}>
                <NativeBaseProvider theme={theme}>
                    <Stack.Navigator>
                        <>
                            {Object.keys(unprotectedScreens).map((screen) => (
                                <Stack.Screen
                                    key={screen}
                                    name={screen}
                                    options={{
                                        title: `Bucketlist | ${screen}`
                                    }}
                                    component={
                                        unprotectedScreens[screen].component
                                    }
                                />
                            ))}
                        </>
                    </Stack.Navigator>
                </NativeBaseProvider>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer linking={linking}>
            <NativeBaseProvider theme={theme}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarLabel: '',
                        tabBarIcon: ({ color }) => {
                            return (
                                <Icon
                                    size="lg"
                                    as={protectedScreens[route.name].provider}
                                    name={protectedScreens[route.name].icon}
                                    color={color}
                                />
                            );
                        }
                    })}
                >
                    <>
                        {Object.keys(protectedScreens).map((screen) => (
                            <Tab.Screen
                                key={screen}
                                name={screen}
                                options={{
                                    title: `Bucketlist | ${screen}`
                                }}
                                component={protectedScreens[screen].component}
                            />
                        ))}
                    </>
                </Tab.Navigator>
            </NativeBaseProvider>
        </NavigationContainer>
    );
};

export default Main;
