'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { users, availability as initialAvailability } from '@/lib/data';
import type { Availability } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function CalendarPage() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  const allAvailableDates = availability.flatMap(a => a.dates.map(d => new Date(d)));

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const handleSaveAvailability = () => {
    if (!authUser || !selectedDates) {
      toast({
        title: 'Error',
        description: 'You must be logged in and select dates to save availability.',
        variant: 'destructive',
      });
      return;
    }

    setAvailability(prev => {
      const userAvailability = prev.find(a => a.userId === authUser.uid);
      const newDates = selectedDates.map(d => format(d, 'yyyy-MM-dd'));

      if (userAvailability) {
        // Merge and remove duplicates
        const updatedDates = [...new Set([...userAvailability.dates, ...newDates])];
        return prev.map(a =>
          a.userId === authUser.uid ? { ...a, dates: updatedDates } : a
        );
      } else {
        // Add new availability for the user
        return [...prev, { userId: authUser.uid, dates: newDates }];
      }
    });

    toast({
      title: 'Success!',
      description: 'Your availability has been saved.',
    });
    setSelectedDates(undefined); // Clear selection after saving
  };

  const usersAvailableOnSelectedDay = selectedDay
    ? users.filter(user =>
        availability.some(a => a.userId === user.id && a.dates.includes(format(selectedDay, 'yyyy-MM-dd')))
      )
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Team Calendar"
        description="See who's available and post your own availability."
      />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                onDayClick={handleDayClick}
                modifiers={{ available: allAvailableDates }}
                modifiersStyles={{
                  available: {
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '50%',
                  },
                }}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Post Your Availability</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select one or more dates on the calendar to mark yourself as available.
              </p>
              <p className="my-4 rounded-lg border bg-muted p-3 text-sm">
                You have selected{' '}
                <span className="font-bold text-primary">
                  {selectedDates?.length ?? 0}
                </span>{' '}
                date(s).
              </p>
              <Button onClick={handleSaveAvailability} disabled={!selectedDates || selectedDates.length === 0} className="w-full">
                Save Availability
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                <span>
                  Available on {selectedDay ? format(selectedDay, 'MMM d') : '...'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersAvailableOnSelectedDay.length > 0 ? (
                <div className="space-y-4">
                  {usersAvailableOnSelectedDay.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No one is available on this day.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
