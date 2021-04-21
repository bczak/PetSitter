import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'one',
            }
          },
          Search: {
            screens: {
              SearchScreen: 'one'
            }
          },
        },
      },
      Auth: {
        screens: {
          SignIn: {
            screens: {
              SignInScreen: 'one'
            }
          },
          SignUp: {
            screens: {
              SignUpScreen: 'one'
            }
          }
        }
      },
      NotFound: '*',
    },
  },
};
