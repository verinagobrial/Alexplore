// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Package,
  Mail,
  MessageSquare,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabaseClient = await createClient();
  
  // Use the raw Supabase client for complex queries
  const supabase = supabaseClient.raw();

  // Fetch all stats in parallel using the raw client
  const [
    bookingsCount,
    usersCount,
    messagesCount,
    subscribersCount,
    recentBookingsRes,
    confirmedBookingsRes,
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('id, package_name, guest_name, guests, total_price, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('bookings')
      .select('total_price')
      .eq('status', 'confirmed'),
  ]);

  const totalBookings = bookingsCount.count ?? 0;
  const totalUsers = usersCount.count ?? 0;
  const totalMessages = messagesCount.count ?? 0;
  const totalSubscribers = subscribersCount.count ?? 0;
  const recentBookings = recentBookingsRes.data ?? [];
  const confirmedBookings = confirmedBookingsRes.data ?? [];

  // Calculate total revenue from confirmed bookings
  const totalRevenue = confirmedBookings.reduce(
    (sum: number, b: any) => sum + (b.total_price || 0),
    0
  );

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Registered Users',
      value: totalUsers.toString(),
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Newsletter Subs',
      value: totalSubscribers.toString(),
      change: '+5%',
      trend: 'up',
      icon: Mail,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with Alexplore.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.package_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guest_name || 'Guest'} — {booking.guests} guests
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${((booking.total_price || 0) / 100).toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No bookings yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/admin/packages/new">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Package className="h-6 w-6 text-primary" />
                <span>Add Package</span>
              </Button>
            </Link>
            <Link href="/admin/destinations/new">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>Add Destination</span>
              </Button>
            </Link>
            <Link href="/admin/messages">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 relative">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span>Messages</span>
                {totalMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalMessages}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin/newsletter">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Mail className="h-6 w-6 text-primary" />
                <span>Newsletter</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}