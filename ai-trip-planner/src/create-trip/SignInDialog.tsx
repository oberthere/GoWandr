import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getUserProfile, type GoogleUser } from '@/service/GoogleAuth';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignedIn: (user: GoogleUser) => void;
}

export function SignInDialog({ open, onOpenChange, onSignedIn }: Props) {
  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        const user = await getUserProfile(tokenInfo);
        onSignedIn(user);
        onOpenChange(false);
      } catch {
        toast.error('Could not sign you in. Please try again.');
      }
    },
    onError: () => toast.error('Google sign-in failed.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Sign in with Google to generate and save your trip itinerary.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => login()} className="mt-2 w-full gap-2">
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
