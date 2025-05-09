import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-2">
            <CheckCircle className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">TaskShare</h1>
          </div>
          <p className="text-gray-600">Simple task management for teams</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Connect with your Google Workspace account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center" 
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-gray-500 text-center">
              <p>Securely sign in using your Google Workspace account</p>
              <p>No password needed!</p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>TaskShare is a simple task management application</p>
          <p>Create tasks, assign them to team members, and track progress</p>
        </div>
      </div>
    </div>
  );
}
