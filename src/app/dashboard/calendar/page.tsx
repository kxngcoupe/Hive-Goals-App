'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, User as UserIcon, PartyPopper } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { users, availability as initialAvailability, events as initialEvents } from '@/lib/data';
import type { Availability, Event, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CalendarPage() {
  const { user: authUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // State for user availability form
  const [userDate, setUserDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // State for admin event form
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const allAvailableDates = availability.flatMap(a => a.times.map(t => new Date(t.date)));
  const allEventDates = events.map(e => new Date(e.date));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setUserDate(day); // Pre-fill forms with clicked date
    setEventDate(day); // Pre-fill forms with clicked date
  };

  const handleSaveAvailability = () => {
    if (!authUser || !userDate || !startTime || !endTime) {
      toast({
        title: 'Error',
        description: 'Please select a date and specify a start and end time.',
        variant: 'destructive',
      });
      return;
    }

    const newAvailabilityTime = {
      date: format(userDate, 'yyyy-MM-dd'),
      start: startTime,
      end: endTime,
    };

    setAvailability(prev => {
      const userAvailability = prev.find(a => a.userId === authUser.uid);

      if (userAvailability) {
        return prev.map(a =>
          a.userId === authUser.uid 
            ? { ...a, times: [...a.times, newAvailabilityTime] } 
            : a
        );
      } else {
        return [...prev, { userId: authUser.uid, times: [newAvailabilityTime] }];
      }
    });

    toast({
      title: 'Success!',
      description: 'Your availability has been saved.',
    });
    setUserDate(undefined);
    setStartTime('');
    setEndTime('');
  };

  const handleCreateEvent = () => {
    if (!isAdmin || !eventDate || !eventTitle) {
      toast({
        title: 'Error',
        description: 'Please select a date and provide a title for the event.',
        variant: 'destructive'
      });
      return;
    }

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: eventTitle,
      description: eventDescription,
      date: format(eventDate, 'yyyy-MM-dd')
    };

    setEvents(prev => [...prev, newEvent]);

    toast({
      title: 'Event Created!',
      description: `The event "${eventTitle}" has been added to the calendar.`,
    });
    setEventDate(undefined);
    setEventTitle('');
    setEventDescription('');
  };

  const dayContent = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const usersAvailableOnSelectedDay = users
    .map(user => {
        const userAvail = availability.find(a => a.userId === user.id);
        const availableTimes = userAvail?.times.filter(t => t.date === dayContent);
        return { user, availableTimes };
    })
    .filter(item => item.availableTimes && item.availableTimes.length > 0);

  const eventsOnSelectedDay = events.filter(e => e.date === dayContent);


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Team Calendar"
        description="See who's available, check for events, and post your own availability."
      />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDayClick}
                modifiers={{ 
                    available: allAvailableDates,
                    event: allEventDates,
                }}
                modifiersStyles={{
                  available: {
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: '50%',
                  },
                  event: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textDecorationColor: 'hsl(var(--accent))',
                  }
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
                <span>Plan for {selectedDate ? format(selectedDate, 'MMM d') : '...'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <PartyPopper className="h-5 w-5 text-accent" /> Events
                </h3>
                {eventsOnSelectedDay.length > 0 ? (
                    <div className="space-y-3">
                        {eventsOnSelectedDay.map(event => (
                            <div key={event.id} className="rounded-lg border bg-muted/50 p-3">
                                <p className="font-medium text-primary">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                )}
              </div>
               <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <UserIcon className="h-5 w-5 text-accent" /> Available Team Members
                </h3>
                {usersAvailableOnSelectedDay.length > 0 ? (
                  <div className="space-y-4">
                    {usersAvailableOnSelectedDay.map(({ user, availableTimes }) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <span className="font-medium">{user.name}</span>
                            <div className="text-sm text-muted-foreground">
                                {availableTimes?.map((time, index) => (
                                    <span key={index} className="block">{time.start} - {time.end}</span>
                                ))}
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No one has posted availability for this day.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {isAdmin ? (
             <Card>
              <CardHeader>
                <CardTitle>Create Event</CardTitle>
                <CardDescription>Admins can add events to the team calendar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" value={eventDate ? format(eventDate, 'yyyy-MM-dd') : ''} onChange={(e) => setEventDate(e.target.valueAsDate ?? undefined)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g. Q4 Planning" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea id="event-desc" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="A short description of the event" />
                </div>
                <Button onClick={handleCreateEvent} className="w-full">Create Event</Button>
              </CardContent>
             </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Post Your Availability</CardTitle>
                <CardDescription>Select a day on the calendar, then set your available time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avail-date">Date</Label>
                  <Input id="avail-date" type="date" value={userDate ? format(userDate, 'yyyy-MM-dd') : ''} onChange={(e) => setUserDate(e.target.valueAsDate ?? undefined)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleSaveAvailability} disabled={!userDate || !startTime || !endTime} className="w-full">
                  Save Availability
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
