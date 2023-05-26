import { AuthenticationDetails, CognitoUser, CognitoUserPool, } from "amazon-cognito-identity-js";

interface IAuth {
  accessToken: string;
}

const auth = async (email: string, password: string): Promise<IAuth | Error> => {
  try {
    const poolData = {
      UserPoolId: "us-east-1_dRG0m6SNS",
      ClientId: "7iis3cgb86nqpkst4iibqfg5q4",
    };

    const userPool = new CognitoUserPool(poolData);
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          resolve({ accessToken });
        },
        onFailure: (error) => {
          console.error(error);
          reject(new Error("Error logging in"));
        },
      });
    });
  } catch (error) {
    console.error(error);
    return new Error("Error logging in");
  }
};


export const AuthService = {
  auth,
}