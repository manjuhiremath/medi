export default function AuthError(error) {
    let errorMessage;
    switch (error.code) {
        case 'auth/claims-too-large':
            errorMessage = 'The claims payload exceeds the maximum allowed size of 1000 bytes.';
            break;
        case 'auth/email-already-exists':
            errorMessage = 'The provided email is already in use by an existing user.';
            break;
        case 'auth/invalid-password':
            errorMessage = 'The password must be at least six characters.';
            break;
        case 'auth/id-token-expired':
            errorMessage = 'The provided Firebase ID token is expired.';
            break;
        case 'auth/id-token-revoked':
            errorMessage = 'The Firebase ID token has been revoked.';
            break;
        case 'auth/insufficient-permission':
            errorMessage = 'Insufficient permissions to access the requested resource.';
            break;
        case 'auth/internal-error':
            errorMessage = 'The server encountered an unexpected error. Please try again later.';
            break;
        case 'auth/invalid-argument':
            errorMessage = 'An invalid argument was provided. Please check your inputs.';
            break;
        case 'auth/invalid-claims':
            errorMessage = 'Invalid custom claim attributes provided.';
            break;
        case 'auth/invalid-continue-uri':
            errorMessage = 'The continue URL must be a valid URL string.';
            break;
        case 'auth/invalid-creation-time':
            errorMessage = 'The creation time must be a valid UTC date string.';
            break;
        case 'auth/invalid-credential':
            errorMessage = 'Invalid credential.';
            break;
        case 'auth/invalid-disabled-field':
            errorMessage = 'The disabled user property must be a boolean.';
            break;
        case 'auth/invalid-display-name':
            errorMessage = 'The display name must be a non-empty string.';
            break;
        case 'auth/invalid-dynamic-link-domain':
            errorMessage = 'The dynamic link domain is not configured for the project.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'The email address is invalid.';
            break;
        case 'auth/invalid-email-verified':
            errorMessage = 'The email verified property must be a boolean.';
            break;
        case 'auth/invalid-hash-algorithm':
            errorMessage = 'The hash algorithm must be supported.';
            break;
        case 'auth/invalid-hash-block-size':
            errorMessage = 'The hash block size must be a valid number.';
            break;
        case 'auth/invalid-hash-derived-key-length':
            errorMessage = 'The hash derived key length must be a valid number.';
            break;
        case 'auth/invalid-hash-key':
            errorMessage = 'The hash key must be a valid byte buffer.';
            break;
        case 'auth/invalid-hash-memory-cost':
            errorMessage = 'The hash memory cost must be a valid number.';
            break;
        case 'auth/invalid-hash-parallelization':
            errorMessage = 'The hash parallelization must be a valid number.';
            break;
        case 'auth/invalid-hash-rounds':
            errorMessage = 'The hash rounds must be a valid number.';
            break;
        case 'auth/invalid-hash-salt-separator':
            errorMessage = 'The salt separator field must be a valid byte buffer.';
            break;
        case 'auth/invalid-id-token':
            errorMessage = 'The ID token is not a valid Firebase ID token.';
            break;
        case 'auth/invalid-last-sign-in-time':
            errorMessage = 'The last sign-in time must be a valid UTC date string.';
            break;
        case 'auth/invalid-page-token':
            errorMessage = 'The next page token must be a valid non-empty string.';
            break;
        case 'auth/invalid-password-hash':
            errorMessage = 'The password hash must be a valid byte buffer.';
            break;
        case 'auth/invalid-password-salt':
            errorMessage = 'The password salt must be a valid byte buffer.';
            break;
        case 'auth/invalid-phone-number':
            errorMessage = 'The phone number is invalid.';
            break;
        case 'auth/invalid-photo-url':
            errorMessage = 'The photo URL must be a string URL.';
            break;
        case 'auth/invalid-provider-data':
            errorMessage = 'The provider data must be a valid array of UserInfo objects.';
            break;
        case 'auth/invalid-provider-id':
            errorMessage = 'The provider ID must be a valid supported provider identifier.';
            break;
        case 'auth/invalid-oauth-responsetype':
            errorMessage = 'Only one OAuth responseType should be set to true.';
            break;
        case 'auth/invalid-session-cookie-duration':
            errorMessage = 'The session cookie duration must be between 5 minutes and 2 weeks.';
            break;
        case 'auth/invalid-uid':
            errorMessage = 'The UID must be a non-empty string with at most 128 characters.';
            break;
        case 'auth/invalid-user-import':
            errorMessage = 'The user record to import is invalid.';
            break;
        case 'auth/maximum-user-count-exceeded':
            errorMessage = 'The maximum allowed number of users to import has been exceeded.';
            break;
        case 'auth/missing-android-pkg-name':
            errorMessage = 'An Android Package Name must be provided if required.';
            break;
        case 'auth/missing-continue-uri':
            errorMessage = 'A valid continue URL must be provided.';
            break;
        case 'auth/missing-hash-algorithm':
            errorMessage = 'Importing users requires the hashing algorithm and its parameters.';
            break;
        case 'auth/missing-ios-bundle-id':
            errorMessage = 'The request is missing a Bundle ID.';
            break;
        case 'auth/missing-uid':
            errorMessage = 'A UID identifier is required for the operation.';
            break;
        case 'auth/missing-oauth-client-secret':
            errorMessage = 'The OAuth client secret is required for OIDC code flow.';
            break;
        case 'auth/operation-not-allowed':
            errorMessage = 'The sign-in provider is disabled for the Firebase project.';
            break;
        case 'auth/phone-number-already-exists':
            errorMessage = 'The phone number is already in use by an existing user.';
            break;
        case 'auth/project-not-found':
            errorMessage = 'No Firebase project was found for the credential.';
            break;
        case 'auth/reserved-claims':
            errorMessage = 'One or more custom user claims are reserved.';
            break;
        case 'auth/session-cookie-expired':
            errorMessage = 'The session cookie is expired.';
            break;
        case 'auth/session-cookie-revoked':
            errorMessage = 'The session cookie has been revoked.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many requests. Please try again later.';
            break;
        case 'auth/uid-already-exists':
            errorMessage = 'The UID is already in use by an existing user.';
            break;
        case 'auth/unauthorized-continue-uri':
            errorMessage = 'The domain of the continue URL is not whitelisted.';
            break;
        case 'auth/user-not-found':
            errorMessage = 'No user found with this identifier.';
            break;
        default:
            errorMessage = 'An unknown error occurred.';
            break;
    }
    return errorMessage;
};


