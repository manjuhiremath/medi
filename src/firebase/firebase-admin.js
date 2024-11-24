import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = {
  type: "service_account",
  project_id: "hospital-app-dev",
  private_key_id: "53e19f003211e6b3c1b3572f10ba2eb7fc5ff787",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCWpLMPQZTwjkn4\ncV+ZOlzUCsMqvSotEy7c1gNf10LgEcFIwFxFQlnfzpTxNo0V4/B/BvbQh5NlAUTM\ng1VUxr4CVxZkVQ5jXwKy3AyjKpYPx2+lqGhhMVTyjk1WnCBsm2naKKhAWI+0/Eae\nPij6iEDGTY/UvGPbxhMCGdgqv6YUh2/Xl/L/B2NBh00r1MlnPbnScIMzqs/aAJEM\noweho4sXJ8Acl/QBf1ihmyhn+cJOMka5beNDUg1vOxH6wN/PDUj9rFRVQRaZgHiV\nnja22ANc71WvHcESPV2sEppvsSPNnNV99GEI7YlDB6eIvHVOtCzW52YdOMxOl73A\nE7UlB0yfAgMBAAECgf9ITXtpT9KlSwUJ9AFREVaZ3QWNl3CNMd62REr7PG/Rpt/R\nbf6DpdxROwygyDKQGEiFXwktXZvg+Fgt/INa/bD6fTEoiRgn8X0b7ehAHxbnMr+E\nZ6uFuNrzKdYKxs7JNKoZi2LA3pw4IM681FNhv/yKKep8D8PPXKxcfgO7auj3e7M2\noQFz1nZIy+DtpRcIs4BG+ClkgdhDbgNSPi5KzJ+Fz4VwxNVEizgFKYnDK3xhgOr1\nQU776MBd8v7rVv9CgB4Q2D83eVEVB/CgkeEyIsHo2GSSRtrkHKhqvroAfTgTvlAC\nnvCSAM3pdynggZ5gB8b8gdWm4US25dBrITE8sr0CgYEA03U4qcTZo7rgIywonuKu\n/LuIIN7iHiO0JaFmiiw8fmBkmLVfYm2ANizfPGj2wnuM56gpGAnomu/YmdSlHl5P\nFlYy+nSeWJAk1+Rrq3izlCoSf0GFtZv8hZvr2Q+BTzRAG3vsf2sQWmqHNIWDLsM2\nP7vk6Pa3ramRKafdsjWf2xUCgYEAtmAUXDIkKeLb7GU1QCukJ7gkKIyYwX0dj5Cu\nmc9kAvcKrKtIMLWWuIMAKxL/FsjBrf4CIfbaPQgW22r3tP/46P/F93+mqTvbcp2A\nx2/+nMMfeWGDc9oICqlAUjqAr29DzlBy5dTtZcnNO1Mz5btHrSM6KdZKOPAZ/A5j\nDTamJeMCgYB9xhp2+CxPs8a/hPOAVeqpTs4QZyHttWTggRjhlKBCtwj+v9rFS8ZX\n8uaxIumrEhvkamRO9Q3SolieXxn7bzLxYUIfMKBCozIW67mTG08NEN1BrfJe7DIO\nMojc6dkLCFQdRN+NhlwKu5RCDCvT867fx93HJ4BnHhXGxh8accTsZQKBgEt/Nq57\n61CToysXMpYf+tKefglzOoFOw//8iusNWX+IuRiFx1qysXQsdtNeB89syBC5CDT7\nNZjyUlP+0hBRrr71swQkCeAg8VVfMkJdcG+ArvTWk05QQef37LKdmUwGqXEtCINw\nQ95RTe5zIRbHEoLwBFHxbcRoULlxUzvTFbC1AoGBALUKxPZcZho8O7dsM548M15z\nICSbnoK6eaKKYkPS6mbHvIGzVlEuAkOG+TXAYhfkwEMQmNDW8s3ARF1H6W+JyQt8\nzWUUYefZwgIZK63fSssMJdGZOhk31TuX6mYESmuIEl/1USIANUrmd9RvF/LT2aJq\nPtzIeVDiQNNZnXUM2OfT\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-r9shs@hospital-app-dev.iam.gserviceaccount.com",
  client_id: "106445979781255735176",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r9shs%40hospital-app-dev.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

initializeApp({
  credential: cert(serviceAccount)
});

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
