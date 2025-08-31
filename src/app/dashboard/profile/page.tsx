
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // In a real app, you would fetch and update user data from a database.
  // For this prototype, we'll find the user in our mock data.
  const currentUser = users.find(u => u.email === user?.email) ?? users[0];

  const [name, setName] = useState(currentUser.name);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  const handleSaveChanges = () => {
    // This would be an API call in a real app.
    currentUser.name = name;
    currentUser.avatarUrl = avatarUrl;
    
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result will be a base64 encoded data URL
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Your Profile"
        description="Customize your display name and profile picture."
      />
      <div className="mt-6 mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Changes will be reflected across the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl} alt={name} data-ai-hint="person portrait" />
                    <AvatarFallback>{name?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Label htmlFor="avatar-file">Upload new picture</Label>
                    <Input 
                        id="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input 
                id="display-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveChanges} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
