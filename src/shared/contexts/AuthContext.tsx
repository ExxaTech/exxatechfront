import { AuthenticationDetails, CognitoUser, CognitoUserPool, } from "amazon-cognito-identity-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";


interface IAuthContextData {
  isAuthenticated: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<string | void>;
}

const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
interface IAuthProviderProps {
  children: React.ReactNode
}


export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)

    if (accessToken) {
      setAccessToken(accessToken)
    } else {
      setAccessToken(undefined)
    }
  })

  const handleLogin = useCallback(async (email: string, password: string) => {

    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const poolData = {
      UserPoolId: "us-east-1_dRG0m6SNS",
      ClientId: "7iis3cgb86nqpkst4iibqfg5q4",
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);



    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        localStorage.setItem(
          LOCAL_STORAGE_KEY__ACCESS_TOKEN,
          JSON.stringify(accessToken)
        );
        setAccessToken(accessToken);
      },
      onFailure: (error) => {
        console.error(error);
        return new Error("Error logging in");
      },
    });
  }, []);

  const handleLogout = useCallback(() => {
    setAccessToken(undefined);
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

    const poolData = {
      UserPoolId: "us-east-1_dRG0m6SNS",
      ClientId: "7iis3cgb86nqpkst4iibqfg5q4",
    };

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated, login: handleLogin, logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext)