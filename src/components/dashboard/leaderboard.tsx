import { users } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const rankIcons = [
    <Trophy key="1" className="h-5 w-5 text-yellow-500 fill-yellow-500" />,
    <Trophy key="2" className="h-5 w-5 text-gray-400 fill-gray-400" />,
    <Trophy key="3" className="h-5 w-5 text-yellow-700 fill-yellow-700" />,
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <PageHeader
          title="Leaderboard"
          description="See who's buzzing at the top of the hive."
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow key={user.id} className={index < 3 ? 'bg-secondary/50' : ''}>
                <TableCell className="w-12 text-center font-bold text-lg">
                  {rankIcons[index] || <span className="text-muted-foreground">{index + 1}</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.points.toLocaleString()} points</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
