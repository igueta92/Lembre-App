import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function InviteMember() {
  const { homeId } = useParams<{ homeId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: home, isLoading } = useQuery({
    queryKey: ["/api/homes", homeId],
    enabled: !!homeId,
  });

  const joinHomeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/homes/${homeId}/join`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message || "Você foi adicionado ao lar!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível entrar no lar. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bem-vindo ao Lembre!
            </h2>
            <p className="text-gray-600 mb-6">
              Você foi convidado para participar de um lar. Faça login para continuar.
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="gradient-bg text-white font-semibold"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Lar não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              O convite pode ter expirado ou o lar não existe mais.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              variant="outline"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already a member
  const isAlreadyMember = user?.homeId === homeId;

  if (isAlreadyMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Você já faz parte deste lar!
            </h2>
            <p className="text-gray-600 mb-6">
              Você já é membro do <strong>{home.name}</strong>.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="gradient-bg text-white font-semibold"
            >
              Ir para Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                <Heart className="text-white h-5 w-5" />
              </div>
              <h1 className="ml-3 text-2xl font-bold gradient-text">Lembre</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Você foi convidado! 🎉
          </h2>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Convite para participar do lar
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {home.name}
              </h3>
              <p className="text-gray-600">
                Você foi convidado para fazer parte desta família no Lembre!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-600">Participe das atividades familiares</p>
              </div>
              
              <div className="p-4 bg-pink-50 rounded-xl">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-600">Gerencie tarefas em conjunto</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-xl">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-600">Ganhe pontos e suba no ranking</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => joinHomeMutation.mutate()}
                disabled={joinHomeMutation.isPending}
                className="w-full gradient-bg text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {joinHomeMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Aceitar Convite
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Recusar Convite
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Ao aceitar o convite, você se tornará membro do lar "{home.name}" 
              e poderá participar de todas as atividades familiares.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
