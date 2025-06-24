import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Circle } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  points: number;
}

interface Home {
  id: string;
  name: string;
  createdBy: string;
  members: User[];
  creator: User;
}

interface FamilyMembersProps {
  homeData?: Home;
}

export default function FamilyMembers({ homeData }: FamilyMembersProps) {
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

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-primary to-secondary",
      "bg-gradient-to-r from-secondary to-pink-400",
      "bg-gradient-to-r from-pink-400 to-primary",
      "bg-gradient-to-r from-purple-500 to-primary",
      "bg-gradient-to-r from-primary to-purple-600",
    ];
    return gradients[index % gradients.length];
  };

  const copyInviteLink = () => {
    if (homeData) {
      const inviteUrl = `${window.location.origin}/invite/${homeData.id}`;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Link de convite copiado!';
        document.body.appendChild(toast);
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
      });
    }
  };

  if (!homeData) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membros da Família
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Carregando informações da família...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { members, creator, name } = homeData;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">
            {name} 👨‍👩‍👦
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={copyInviteLink}>
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member, index) => {
            const isCreator = member.id === creator.id;
            return (
              <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getGradientClass(index)}`}>
                  <span className="text-white text-sm font-bold">
                    {getPersonInitials(member)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {getPersonName(member)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isCreator ? "Administrador" : "Membro"}
                  </p>
                </div>
                
                {/* Online status indicator - you could implement real online status */}
                <Circle className="w-3 h-3 fill-green-500 text-green-500" />
              </div>
            );
          })}
        </div>
        
        <Button 
          onClick={copyInviteLink}
          className="w-full mt-4 gradient-bg text-white font-semibold transform hover:scale-105 transition-all duration-200"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Convidar Membro
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Copie o link de convite para adicionar novos membros
        </p>
      </CardContent>
    </Card>
  );
}
