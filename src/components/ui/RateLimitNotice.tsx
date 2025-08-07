'use client';

import { useState } from 'react';
import { AlertTriangle, X, Clock, TestTube } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

export const RateLimitNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <CardTitle className="text-lg text-yellow-800 dark:text-yellow-200">
              Development Notice
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          Supabase has rate limiting for authentication operations. If you encounter registration errors,
          the system will automatically switch to test mode.
        </CardDescription>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-700 dark:text-yellow-300">
              Wait 60+ seconds between registration attempts
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <TestTube className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-700 dark:text-yellow-300">
              Test endpoints automatically used when rate limited
            </span>
          </div>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            💡 Pro Tip: Use different email addresses for testing, or wait between attempts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};