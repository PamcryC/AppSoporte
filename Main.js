import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Login } from './pages/Login';
import { InicioUsu } from './InicioUsu'
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, getfullSession, getConfig, getCount } from './redux/app'
import { DetallePeticion } from './pages/DetallePeticion'

const Stack = createStackNavigator();

const MyTheme = {
    headerStyle: {
        backgroundColor: '#9EC9F0'
    },
    headerShown:false,
    headerTintColor: '#000000',
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
};

export const Main = () => {
    const dispatch = useDispatch()

    const [isAuth, setAuth] = useState(false)
    const auth = useSelector((store) => store.app.session.session_token)
    const token_app = useSelector((store) => store.app.session.app_token)
    const valTok = useSelector((store) => store.app.session.valTok)
    const server = useSelector((store) => store.app.session.server)

    useEffect(() => {
        if (auth !== '') {
            setAuth(true);
            dispatch(getProfile(server, auth,token_app,valTok));
            dispatch(getfullSession(server, auth,token_app,valTok));
            dispatch(getConfig(server, auth,token_app,valTok));
            dispatch(getCount(server, 'Ticket', auth,token_app,valTok));

        } else {
            setAuth(false)
        }


    }, [auth,valTok,token_app])
    return (
        <NavigationContainer >
            {
                !isAuth ? (
                    <Stack.Navigator initialRouteName='Login'>
                            <Stack.Screen name='Login'  component={Login} options={MyTheme}></Stack.Screen>
                    </Stack.Navigator>

                ) : (
                    <InicioUsu></InicioUsu>
                    )
            }

        </NavigationContainer >

    )
}