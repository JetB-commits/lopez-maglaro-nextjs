import { redirect } from 'next/navigation';

export default function OldDashboardRedirectPage() {
  redirect('/users/dashboard');
  return null;
}
