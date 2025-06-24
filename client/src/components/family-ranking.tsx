import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal, Award } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  points: number;
}

interface FamilyRankingProps {
  ranking: User[];
  isLoading?: boolean;
}

export default function FamilyRanking({ ranking, isLoading }: FamilyRankingProps) {
  const getPersonName = (person: User) => {
    if (person.firstName) {
      return `${person.firstName} ${person.lastName || ""}`.trim();
    }
    return person.email.split("@")[0];
  };

  const getPersonInitials = (person: User) => {
    if (person.firstName) {
      const firstInitial = person.firstName.charAt(0).toUpperCase();
      const lastInitial = person.lastName?.charAt(0).toUpperCase() || "";
      return firstInitial + lastInitial;
    }
    return person.email.charAt(0).toUpperCase();
  };

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getRankingStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200";
      default:
        return "bg-gray-50";
    }
  };

  const getPositionBadgeStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Ranking Familiar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 bg-gray-50 rounded-xl animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ranking.length) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Ranking Familiar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Crown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              O ranking aparecerá quando houver tarefas concluídas!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Ranking Familiar
          </CardTitle>
          <span className="text-sm text-gray-500">Esta semana</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ranking.map((person, index) => {
            const position = index + 1;
            return (
              <div
                key={person.id}
                className={`flex items-center p-3 rounded-xl ${getRankingStyle(position)}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPositionBadgeStyle(position)}`}>
                  <span className="text-sm font-bold">{position}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {getPersonName(person)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {person.points} pontos
                  </p>
                </div>
                
                {getRankingIcon(position)}
              </div>
            );
          })}
        </div>

        {ranking.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">
              Complete tarefas para aparecer no ranking!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
