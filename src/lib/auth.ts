/**
 * Cognito auth gate for the edit lock.
 *
 * Editing (add/export/import/edit/delete) is unlocked only when signed in as a
 * specific Cognito identity in the `tigersndragons-users` pool. Uses the public
 * SPA app client (no secret) with SRP auth — the user's password goes straight
 * to Cognito, never to any server of ours (there is none).
 *
 * These IDs are not secrets: the pool id and public client id ship in every
 * Cognito SPA's JS, and the allowed `sub` is just an allow-list identifier.
 */
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';

const USER_POOL_ID = 'us-west-2_OMwj6Yfpn';
const CLIENT_ID = '5p01qepq8kh9qfuji1occiud19';
/** Only this Cognito identity may unlock editing. */
const ALLOWED_SUB = 'c831f380-7071-7082-6ecc-6110e068d744';

const pool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

function subOf(session: CognitoUserSession): string {
  return session.getIdToken().decodePayload().sub as string;
}

/** Sign in with SRP; resolves only if the authenticated user is the allowed one. */
export function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    const details = new AuthenticationDetails({ Username: email.trim(), Password: password });
    user.authenticateUser(details, {
      onSuccess: (session) => {
        if (subOf(session) === ALLOWED_SUB) resolve();
        else {
          user.signOut();
          reject(new Error('Dieser Benutzer ist nicht berechtigt zu bearbeiten.'));
        }
      },
      onFailure: (err) => reject(err instanceof Error ? err : new Error(String(err))),
      newPasswordRequired: () =>
        reject(new Error('Passwortänderung erforderlich — bitte zuerst anderswo abschließen.')),
    });
  });
}

/** True if there is a valid cached session for the allowed user (no network if the token is still valid). */
export function currentAllowedUser(): Promise<boolean> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(false);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) return resolve(false);
      resolve(subOf(session) === ALLOWED_SUB);
    });
  });
}

export function signOut(): void {
  pool.getCurrentUser()?.signOut();
}

/**
 * The current owner's Cognito **ID token** (JWT) for authorizing writes, or null
 * if there is no valid session. Resolves without a network call while the cached
 * token is still valid; amazon-cognito-identity-js refreshes it if needed.
 */
export function getIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const user = pool.getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid() || subOf(session) !== ALLOWED_SUB) {
        return resolve(null);
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
