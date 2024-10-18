import { useLazyQuery } from '@apollo/client';
import {
  AuthenticationDetails,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// import { CREATE_ADMIN_WALLET_QUERY } from '@/apollo/schemas/createAdminWallet';
import ErrorPopup from '@/components/common/errorAlert/ErrorPopup';
import { Loader } from '@/components/common/Loader';
import { useToast } from '@/hooks/use-toast';
import { IDBUser } from '@/types/User';
import { LocalStorageService } from '@/utils/LocalStorage';

import { SIGN_IN_QUERY } from '../apollo/schemas/signin';

export interface AuthContextProps {
  error: any;
  isLoading: boolean;
  isOtpVerifying: boolean;
  isAuthenticated: boolean;
  showVerifyOtp: boolean;
  showMfaSettingModal: boolean;
  mfaAuthUrl: string;
  showVerifySignupModal: boolean;
  updateUserAttributes: (attributeList: CognitoUserAttribute[]) => void;
  setShowVerifySignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMfaSettingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVerifyOtp: React.Dispatch<React.SetStateAction<boolean>>;
  createAccount: (
    username: string,
    password: string,
    attributes: CognitoUserAttribute[],
  ) => void;
  signInWithEmail: (email: string, password: string) => void;
  logout: () => void;
  resendConfirmationCode: (email: string) => void;
  verifyConfirmationCode: (
    username: string,
    code: string,
    onClose: () => void,
  ) => void;
  signInWithGoogle: () => void;
  signInWithApple: () => void;
  signInWithFacebook: () => void;
  forgotPassword: (email: string) => void;
  resetPassword: (username: string, code: string, newPassword: string) => void;
  verifyTOTP: (code: string) => void;
  verifyAssociateSoftwareToken: (code: string) => void;
  changePassword: (
    username: string,
    oldPassword: string,
    newPassword: string,
  ) => void;
  isCheckingAuth: boolean;
  session: CognitoUserSession | null;
  dbUser: IDBUser | null | 'loading';
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const redirect_uri: string = new URL('/login', window.location.href).toString();

const poolData: ICognitoUserPoolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID || '', //env variables
  ClientId: process.env.REACT_APP_POOL_CLIENT_ID || '', //env variables
};

const userPool = new CognitoUserPool(poolData);

let logoutReference: any = null;
export const getLogoutFunction = () => {
  return logoutReference;
};
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);
  const [showVerifyOtp, setShowVerifyOtp] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [coginitoUser, setCognitoUser] = useState<CognitoUser>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mfaAuthUrl, setMfaAuthUrl] = useState<string>('');
  const [showMfaSettingModal, setShowMfaSettingModal] =
    useState<boolean>(false);
  const [showVerifySignupModal, setShowVerifySignupModal] =
    useState<boolean>(false);
  const [isSigningUser, setIsSigningUser] = useState(false);
  const [session, setSession] = useState<CognitoUserSession | null>(null);
  const [dbUser, setDbUser] = useState<IDBUser | null | 'loading'>(null);

  const [onSignIn] = useLazyQuery(SIGN_IN_QUERY);
  // const [handleCreateWallet] = useLazyQuery(CREATE_ADMIN_WALLET_QUERY);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error_description = params.get('error_description');
    if (error_description) {
      const err = error_description
        ? error_description.split(':')[1]
        : error_description;
      setError(err);
      return;
    }

    const fetchTokenFromCode = async (code: string) => {
      try {
        const response = await fetch(
          `https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code,
              grant_type: 'authorization_code',
              client_id: process.env.REACT_APP_POOL_CLIENT_ID!,
              redirect_uri,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        handleUserSession(data);
        LocalStorageService.setItem('idToken', data?.id_token);

        setUserFromToken(data?.id_token);
        setIsAuthenticated(true);
        navigate('/');
      } catch (error) {
        console.log(error);
        // Handle the error
      } finally {
        window.close();
      }
    };
    if (code) {
      fetchTokenFromCode(code);
      new BroadcastChannel('oauth_code').postMessage({
        code,
      });
    }
  }, []);

  useEffect(() => {
    const getUserSession = () => {
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession(
          (err: any, session: CognitoUserSession | null) => {
            if (err) {
              console.error('Failed to get session:', err);
              setSession(null);
            } else {
              setSession(session);
            }
            setIsLoading(false);
          },
        );
      }
    };

    getUserSession();
  }, [isLoading]);

  // Check if the user is already signed in

  useEffect(() => {
    const fetchUser = async () => {
      const [user, wallet] = await Promise.all([
        LocalStorageService.getItem('bt-customer'),
        LocalStorageService.getItem('wallet'),
      ]);
      if (user) {
        setDbUser(JSON.parse(user));
        // setAdminWallet(JSON.parse(wallet ?? ''));
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
      } else {
        setIsCheckingAuth(false);
      }
    };

    fetchUser();
  }, []);

  // async function handleCreateCurrentAdminWallet(oidcToken: string) {
  //   try {
  //     const user = (await jwtDecode(oidcToken)) as any;
  //     const response = await handleCreateWallet({
  //       variables: { chainType: 'Solana', tenantUserId: user?.email },
  //       context: {
  //         headers: {
  //           identity: oidcToken,
  //         },
  //       },
  //     });

  //     if (response.errors) {
  //       toast({
  //         title: '',
  //         description: response.errors[0]?.message || 'An error occurred',
  //       });
  //       return;
  //     }
  //     const adminWallet = response?.data?.CreateAdminWallet?.data;
  //     if (adminWallet && response.data.CreateAdminWallet.status === 200) {
  //       LocalStorageService.setItem('wallet', JSON.stringify(adminWallet));
  //       toast({ title: 'Wallet created successfully' });
  //     } else {
  //       toast({ title: response.data.CreateAdminWallet.error });
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error(error);
  //     toast({ title: 'An unexpected error occurred.', variant: 'destructive' });
  //   } finally {
  //     setIsSigningUser(false);
  //   }
  // }

  /** Handle oidc token */
  async function getSignedInUserData(oidcToken: string) {
    try {
      setIsSigningUser(true);
      const user = (await jwtDecode(oidcToken)) as any;
      const response = await onSignIn({
        variables: { tenantUserId: user?.email },
        context: {
          headers: {
            identity: oidcToken,
          },
        },
      });
      setIsLoading(false);
      // Check if there's any error in the response
      if (response.errors) {
        toast({
          title: '',
          description: response.errors[0]?.message || 'An error occurred',
        });
        return;
      }
      const signInData = response?.data?.AdminSignin?.data;
      if (signInData && response.data.AdminSignin.status === 200) {
        setDbUser(signInData);
        LocalStorageService.setItem('bt-customer', JSON.stringify(signInData));
        LocalStorageService.setItem('idToken', oidcToken);
        navigate('/');
      } else {
        toast({ title: '', description: response.data.AdminSignin.error });
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({ title: '', description: 'An unexpected error occurred.' });
    } finally {
      setIsSigningUser(false);
    }
  }

  // Function for setting user from token
  const setUserFromToken = async (token: string) => {
    await getSignedInUserData(token);
    // await handleCreateCurrentAdminWallet(token);
  };

  const handleUserSession = (tokens: {
    access_token: string;
    id_token: string;
    refresh_token?: string;
  }) => {
    const userData = {
      Username: 'SOCIAL_LOGIN_USER', // Placeholder username as it's a federated login
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    let RefreshToken;
    try {
      RefreshToken = tokens.refresh_token
        ? new CognitoRefreshToken({ RefreshToken: tokens.refresh_token })
        : undefined;
    } catch (error) {
      console.error('Error creating refresh token:', error);
    }
    RefreshToken = tokens.refresh_token
      ? new CognitoRefreshToken({ RefreshToken: tokens.refresh_token })
      : undefined;
    const sessionData = {
      IdToken: new CognitoIdToken({ IdToken: tokens.id_token }),
      AccessToken: new CognitoAccessToken({ AccessToken: tokens.access_token }),
      RefreshToken: RefreshToken,
    };
    const userSession = new CognitoUserSession(sessionData);
    cognitoUser.setSignInUserSession(userSession);
    // Now you can use the cognitoUser object to manage the session
    console.log('User session set:', cognitoUser.getSignInUserSession());
  };

  // Function for signing in with email and password
  const signInWithEmail = async (username: string, password: string) => {
    setIsLoading(true);
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const newUser = new CognitoUser(userData);
    setCognitoUser(newUser);

    newUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        // Store the user data in localStorage
        try {
          LocalStorageService.setItem(
            'user',
            JSON.stringify(session.getIdToken().payload),
          );
          LocalStorageService.setItem(
            'idToken',
            session.getIdToken().getJwtToken(),
          );
          setUserFromToken(session.getIdToken().getJwtToken());
          setIsAuthenticated(true);
          navigate('/');
        } catch (error) {
          console.error('Error storing user data:', error);
        } finally {
          setIsLoading(false);
        }
      },
      onFailure: (err) => {
        if (err.code === 'UserNotConfirmedException') {
          resendConfirmationCode(username);
          // navigate("/verifyemail");
        }
        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // User was signed up by an admin and must provide new password
        // Set the new password and submit to complete login.
        newUser.completeNewPasswordChallenge(
          'Ai@bt123',
          {},
          {
            onSuccess: (result) => {
              console.log('Password changed successfully');
            },
            onFailure: (err) => {
              console.error('Password change error:', err);
            },
          },
        );
      },
      mfaSetup(challengeName) {
        if (challengeName === 'MFA_SETUP') {
          newUser.associateSoftwareToken({
            associateSecretCode: (secretCode) => {
              // navigate("setuptotp?secretCode=" + secretCode + "&username=" + username);
              const otpauthUrl = `otpauth://totp/${encodeURIComponent('Meadowland')}:${encodeURIComponent(username ?? '')}?secret=${secretCode}&issuer=${encodeURIComponent('Meadowland.com')}`;
              setMfaAuthUrl(otpauthUrl);
              setShowMfaSettingModal(true);
              setIsLoading(false);
            },
            onFailure: (err) => {
              setIsLoading(false);
              toast({
                title: 'Something went wrong!',
                description: err?.message || JSON.stringify(err),
                variant: 'destructive',
              });
            },
          });
        }
        if (challengeName === 'SOFTWARE_TOKEN_MFA') {
          setIsLoading(false);
          setShowVerifyOtp(true);
        }
      },
      totpRequired: (challengeName) => {
        if (challengeName === 'SOFTWARE_TOKEN_MFA') {
          setIsLoading(false);
          setShowVerifyOtp(true);
        }
      },
    });
  };

  const verifyAssociateSoftwareToken = (code: string) => {
    setIsOtpVerifying(true);
    coginitoUser?.verifySoftwareToken(code, '', {
      onSuccess: (session) => {
        LocalStorageService.setItem(
          'idToken',
          session.getIdToken().getJwtToken(),
        );
        setUserFromToken(session.getIdToken().getJwtToken());
        setIsAuthenticated(true);
        setIsOtpVerifying(false);
        setShowMfaSettingModal(false);
        // navigate('/'); // Redirect to the tabs page after successful login
      },
      onFailure: (err) => {
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
        setIsOtpVerifying(false);
      },
    });
  };

  // Function for verifying the SOFTWARE_TOKEN_MFA challenge
  const verifyTOTP = (code: string) => {
    setIsOtpVerifying(true);
    coginitoUser?.sendMFACode(
      code,
      {
        onSuccess: (session) => {
          try {
            LocalStorageService.setItem(
              'idToken',
              session.getIdToken().getJwtToken(),
            );
            setUserFromToken(session.getIdToken().getJwtToken());
            setIsAuthenticated(true);
            setShowVerifyOtp(false);
            // navigate('/');
          } catch (error) {
            console.error('Error storing user data:', error);
          } finally {
            setIsOtpVerifying(false);
          }
        },
        onFailure: (err) => {
          // toast.error(err?.message);
          setError(err?.message || JSON.stringify(err));
          setIsOtpVerifying(false);
        },
      },
      'SOFTWARE_TOKEN_MFA',
    );
  };

  function oauth2PKCELogin(
    authEndpoint: string,
    tokenEndpoint: string,
    client_id: string,
    scope: string,
    identityProvider: string,
  ) {
    const params = new URLSearchParams({
      identity_provider: identityProvider,
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      prompt: 'select_account',
    });

    const authorizeURL = `${authEndpoint}?${params}`;
    console.log(authorizeURL);

    window.location.assign(authorizeURL);
  }

  const signInWithSocial = (identityProvider: string) => {
    try {
      setIsLoading(true);
      const authEndpoint = `https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/authorize`;
      const tokenEndpoint = `https://${process.env.REACT_APP_OAUTH_DOMAIN}/oauth2/token`;
      const clientId = process.env.REACT_APP_POOL_CLIENT_ID!;
      const scope = 'openid profile email';

      oauth2PKCELogin(
        authEndpoint,
        tokenEndpoint,
        clientId,
        scope,
        identityProvider,
      );
    } catch (err: any) {
      // toast.error(err?.message || JSON.stringify(err));
      console.error(err);
      setError(err?.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Function for signing in with Google
  const signInWithGoogle = () => {
    signInWithSocial('Google');
  };

  // Function for signing in with Facebook
  const signInWithFacebook = () => {
    signInWithSocial('Facebook');
  };

  // Function for signing in with Apple
  const signInWithApple = () => {
    signInWithSocial('SignInWithApple');
  };

  // Function for creating a new account
  const createAccount = (
    username: string,
    password: string,
    newAttributeList: { Name: string; Value: string }[],
  ) => {
    setIsLoading(true);
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: username,
    };
    const attributeEmail = new CognitoUserAttribute({ ...dataEmail });
    attributeList.push(attributeEmail);
    newAttributeList.forEach((att) => {
      const data = {
        Name: att.Name,
        Value: att.Value,
      };
      const attribute = new CognitoUserAttribute(data);
      attributeList.push(attribute);
    });
    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        console.log(err);

        // toast.error(err?.message || JSON.stringify(err));
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      } else {
        console.log(result);

        setIsLoading(false);
        setShowVerifySignupModal(true);
        toast({
          title: 'Account created successfully',
        });
        if (!result?.userConfirmed) {
          setIsAuthenticated(true);
        }
      }
    });
  };

  // Function for resending the confirmation code
  const resendConfirmationCode = (email: string) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        toast({
          title: 'Failed to resend confirmation code',
          variant: 'destructive',
        });

        return;
      }
      toast({
        title: 'Confirmation code sent successfully',
      });

      setShowVerifySignupModal(true);
    });
  };

  // Function for verifying the confirmation code
  const verifyConfirmationCode = (
    username: string,
    code: string,
    onClose: () => void,
  ) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        setError(err);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        navigate('/');
        toast({
          title: 'Signup confirmed successfully, you can now login',
        });
        onClose();
      }
    });
  };

  // Function for initiating the forgot password flow
  const forgotPassword = (username: string) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: () => {
        setIsLoading(false);
        navigate('reset-password?username=' + username);
        toast({
          title: 'Forget password code has been send to your email',
        });
      },
      onFailure: (err) => {
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      },
    });
  };

  // Function for resetting the password
  const resetPassword = (
    username: string,
    code: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: 'Password reset successfully',
        });
        navigate('/'); // Redirect to the login page after successful password reset
      },
      onFailure: (err) => {
        setError(err?.message || JSON.stringify(err));
        setIsLoading(false);
      },
    });
  };

  /**
   * Function for changing the password
   * @param username
   * @param code
   * @param newPassword
   */
  const changePassword = (
    username: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.changePassword(
      oldPassword,
      newPassword,
      (err: Error | undefined, result: 'SUCCESS' | undefined) => {
        if (result) {
          setIsLoading(false);
          toast({
            title: 'Password updated successfully',
          });
          navigate('/');
        } else {
          // toast.error(err?.message || JSON.stringify(err));
          setError(err?.message || JSON.stringify(err));
          setIsLoading(false);
        }
      },
    );
  };
  function removeSession() {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_POOL_CLIENT_ID!,
      logout_uri: redirect_uri,
    });

    const authorizeURL = ` https://${process.env.REACT_APP_OAUTH_DOMAIN}/logout?${params}`;
    window.location.assign(authorizeURL);
  }

  // Function for logging out the user
  const logout = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut(async () => {
          setIsAuthenticated(false);
          setSession(null);
          localStorage.removeItem('bt-customer');
          localStorage.removeItem('idToken');
          setDbUser(null);

          navigate('/sign-in');
        });
      } else {
        setIsAuthenticated(false);
        setSession(null);
        localStorage.removeItem('bt-customer');
        localStorage.removeItem('idToken');
        setDbUser(null);

        navigate('/sign-in');
      }
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };
  logoutReference = logout;

  const updateUserAttributes = (attributeList: CognitoUserAttribute[]) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser?.updateAttributes(attributeList, (err) => {
        if (err) {
          // toast.error(err?.message || JSON.stringify(err));
          setError(err?.message || JSON.stringify(err));
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast({
            title: 'Account updated successfully',
          });
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        error,
        isLoading,
        isCheckingAuth,
        isOtpVerifying,
        isAuthenticated,
        showVerifyOtp,
        mfaAuthUrl,
        showMfaSettingModal,
        showVerifySignupModal,
        session,
        updateUserAttributes,
        setShowVerifySignupModal,
        setShowMfaSettingModal,
        setShowVerifyOtp,
        createAccount,
        logout,
        signInWithEmail,
        resendConfirmationCode,
        verifyConfirmationCode,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        forgotPassword,
        resetPassword,
        verifyTOTP,
        verifyAssociateSoftwareToken,
        changePassword,
        dbUser,
      }}
    >
      <ErrorPopup open={!!error} message={error} onClose={() => setError('')} />
      {isSigningUser && <Loader show />}
      {children ? children : <Outlet />}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = (): AuthContextProps => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};
