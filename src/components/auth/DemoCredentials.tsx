'use client';

import { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DemoUser {
  email: string;
  password: string;
  full_name: string;
  description: string;
}

const demoUsers: DemoUser[] = [
  {
    email: "test@example.com",
    password: "password123",
    full_name: "Test User",
    description: "Primary test user"
  },
  {
    email: "demo@example.com", 
    password: "demo123",
    full_name: "Demo User",
    description: "Demo account for presentations"
  },
  {
    email: "admin@example.com",
    password: "admin123", 
    full_name: "Admin User",
    description: "Admin demo account"
  }
];

interface DemoCredentialsProps {
  onCredentialSelect?: (email: string, password: string) => void;
  compact?: boolean;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({
  onCredentialSelect,
  compact = false
}) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCredentialClick = (user: DemoUser) => {
    if (onCredentialSelect) {
      onCredentialSelect(user.email, user.password);
      toast.success(`Credentials loaded for ${user.full_name}`);
    }
  };

  if (compact) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Demo Credentials Available
          </p>
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          {demoUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between bg-blue-100 dark:bg-blue-800 p-2 rounded">
              <div className="flex-1">
                <div className="font-medium text-blue-900 dark:text-blue-100">{user.email}</div>
                <div className="text-blue-700 dark:text-blue-300">
                  {showPasswords ? user.password : '••••••••'}
                </div>
              </div>
              
              {onCredentialSelect && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCredentialClick(user)}
                  className="ml-2 h-6 px-2 text-xs"
                >
                  Use
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          💡 These work with mock authentication when real Supabase fails
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Demo User Credentials
        </CardTitle>
        <CardDescription>
          Use these predefined accounts for testing. Mock authentication validates passwords!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Toggle Password Visibility */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show passwords:</span>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center space-x-2 text-sm text-primary hover:underline"
            >
              {showPasswords ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>

          {/* Demo Users List */}
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{user.full_name}</h4>
                    <p className="text-sm text-muted-foreground">{user.description}</p>
                  </div>
                  
                  {onCredentialSelect && (
                    <Button
                      onClick={() => handleCredentialClick(user)}
                      variant="outline"
                      size="sm"
                    >
                      Use Credentials
                    </Button>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">
                      {user.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(user.email, 'Email')}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedField === 'Email' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Password</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">
                      {showPasswords ? user.password : '••••••••••••'}
                    </code>
                    <button
                      onClick={() => copyToClipboard(user.password, 'Password')}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedField === 'Password' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Usage Notes */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">📝 Usage Notes:</p>
              <ul className="text-xs space-y-1">
                <li>• These credentials only work with mock authentication</li>
                <li>• Wrong passwords will be rejected (realistic validation)</li>
                <li>• Unknown emails will be rejected</li>
                <li>• Perfect for testing login flows without Supabase</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};