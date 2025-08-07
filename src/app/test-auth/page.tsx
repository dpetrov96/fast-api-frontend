'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import { AuthResponse } from '@/types/auth';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing login with:', { email, password });
      
      const response = await apiClient.post<AuthResponse>('/test/login-mock', {
        email,
        password
      });
      
      console.log('✅ Login response:', response);
      
      // Store token
      apiClient.setToken(response.token.access_token);
      
      setResult({
        success: true,
        data: response,
        token: response.token.access_token
      });
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setResult({
        success: false,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testProtected = async () => {
    setLoading(true);
    
    try {
      console.log('🧪 Testing protected endpoint...');
      
      const response = await apiClient.get('/protected/dashboard');
      
      console.log('✅ Protected response:', response);
      setResult({
        success: true,
        type: 'protected',
        data: response
      });
      
    } catch (error) {
      console.error('❌ Protected error:', error);
      setResult({
        success: false,
        type: 'protected',
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    apiClient.clearToken();
    setResult(null);
    console.log('🗑 Token cleared');
  };

  const redirectToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Authentication Test Page</CardTitle>
            <CardDescription>
              Test authentication flow manually to debug issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={testLogin} 
                isLoading={loading}
                disabled={loading}
              >
                Test Mock Login
              </Button>
              
              <Button 
                onClick={testProtected} 
                variant="outline"
                disabled={loading}
              >
                Test Protected Route
              </Button>
              
              <Button 
                onClick={clearToken} 
                variant="destructive"
                disabled={loading}
              >
                Clear Token
              </Button>
              
              <Button 
                onClick={redirectToDashboard} 
                variant="secondary"
                disabled={loading}
              >
                Go to Dashboard
              </Button>
            </div>

            <div className="text-sm">
              <p><strong>Current Token:</strong> {apiClient.getToken() ? '✅ Present' : '❌ Missing'}</p>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>
                {result.success ? '✅ Success' : '❌ Error'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Local Storage Token:</strong> {typeof window !== 'undefined' ? (localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing') : 'N/A'}</p>
            <p><strong>API Client Token:</strong> {apiClient.getToken() ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}