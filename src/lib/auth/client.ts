'use client';

import type { User } from '@/types/user';
import axios from 'axios';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  userName: string;
  password: string;
  passwordRepead: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  userName: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request
    try {
      await axios.post("http://38.242.146.83:3001/RegisterAgent",{
        AgentNumber: _.userName,
        AgentPassword: _.password
      })
      localStorage.setItem('custom-auth-token', _.userName);
    } catch (error) {
      return { error: 'Bir hata oluştu' };
    }
    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { userName, password } = params;

    //Make API request
    try {
      let response = await axios.post("http://38.242.146.83:3001/login",{
        Name: userName,
        Password: password
      })
      localStorage.setItem('custom-auth-token', userName);
    } catch (error) {
      return { error: 'Kullanıcı Adı Yada Şifre Hatalı' };
    }
    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    // if (userName !== 'sofia@devias.io' || password !== 'Secret1') {
    //   return { error: 'Kullanıcı Adı Yada Şifre Hatalı' };
    // }

    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
