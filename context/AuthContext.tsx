import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

// Definiujemy kształt danych, które będą dostępne w całym kontekście
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<AuthResponse>;
  signUp: (data: { email: string; password: string }) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

// Tworzymy kontekst z początkową wartością undefined (dla bezpieczeństwa typów)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Sprawdź aktywną sesję przy starcie aplikacji
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Błąd podczas pobierania sesji:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Nasłuchuj zmian w autoryzacji (zalogowanie, wylogowanie, odświeżenie tokena)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Czyszczenie subskrypcji przy odmontowaniu
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funkcje pomocnicze
  const signUp = (data: { email: string; password: string }) => 
    supabase.auth.signUp(data);

  const signIn = (data: { email: string; password: string }) => 
    supabase.auth.signInWithPassword(data);

  const signOut = () => 
    supabase.auth.signOut();

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook do łatwego używania kontekstu
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};