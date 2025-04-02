
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Github, Mail, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  const handleProviderLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate authentication with provider
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Logged in with ${provider}!`);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse-subtle"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-pulse-subtle"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-teal-300 rounded-full filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-purple-100 bg-white/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-blue-600">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="px-0 text-xs text-purple-600" onClick={() => toast.info("Password reset feature coming soon!")}>
                  Forgot password?
                </Button>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => handleProviderLogin('Google')}
              disabled={isLoading}
              className="transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleProviderLogin('GitHub')}
              disabled={isLoading}
              className="transition-all duration-300 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleProviderLogin('LinkedIn')}
              disabled={isLoading}
              className="transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <Button 
            variant="link" 
            className="w-full text-purple-600"
            onClick={() => toast.info("Sign up feature coming soon!")}
          >
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
