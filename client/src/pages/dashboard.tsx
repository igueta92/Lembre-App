import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Plus, Users, Filter, MoreHorizontal, Crown, UserPlus } from "lucide-react";
import TaskList from "@/components/task-list";
import FamilyRanking from "@/components/family-ranking";
import FamilyMembers from "@/components/family-members";
import CreateTaskModal from "@/components/create-task-modal";
import { useState } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ["/api/homes", user?.homeId].filter(Boolean),
    enabled: !!user?.homeId,
    retry: false,
  });
  
  // Debug: Log homeData to see what we're getting
  console.log("HomeData in Dashboard:", homeData);
  console.log("User data:", user);

  const { data: ranking, isLoading: rankingLoading } = useQuery({
    queryKey: ["/api/homes", user?.homeId, "ranking"].filter(Boolean),
    enabled: !!user?.homeId,
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || tasksLoading || homeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingTasks = tasks?.filter((task: any) => task.status === "pending") || [];
  const todayTasks = pendingTasks.filter((task: any) => {
    if (!task.deadline) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(task.deadline).toDateString();
    return today === taskDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="text-white h-5 w-5" />
              </div>
              <h1 className="ml-3 text-2xl font-bold gradient-text">Lembre</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => {
                  document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {
                  document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Tarefas
              </button>
              <button 
                onClick={() => {
                  document.getElementById('ranking-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Ranking
              </button>
              <button 
                onClick={() => {
                  document.getElementById('family-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Família
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || user?.email?.split('@')[0] || 'Usuário'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-primary"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div id="dashboard-section" className="gradient-bg rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Olá, {user?.firstName || user?.email?.split('@')[0] || 'amigo'}! 👋
            </h2>
            <p className="text-purple-100 mb-6">
              Você tem {todayTasks.length} tarefas pendentes hoje. Vamos começar?
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="bg-white text-primary hover:bg-gray-100 font-semibold transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {
                  if (user?.homeId) {
                    const inviteUrl = `${window.location.origin}/invite/${user.homeId}`;
                    navigator.clipboard.writeText(inviteUrl).then(() => {
                      toast({
                        title: "Link copiado!",
                        description: "O link de convite foi copiado para a área de transferência.",
                      });
                    });
                  }
                }}
                className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Convidar Membro
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div id="tasks-section" className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Tarefas de Hoje
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList tasks={tasks || []} />
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => setIsCreateTaskModalOpen(true)}
                    className="gradient-bg text-white font-semibold transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Nova Tarefa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Family Ranking */}
            <div id="ranking-section">
              <FamilyRanking ranking={ranking || []} isLoading={rankingLoading} />
            </div>
            
            {/* Family Members */}
            <div id="family-section">
              <FamilyMembers homeData={homeData} />
            </div>
            
            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Estatísticas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Plus className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tarefas Concluídas</p>
                      <p className="text-lg font-bold text-gray-800">
                        {tasks?.filter((task: any) => task.status === "completed").length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Crown className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pontos Totais</p>
                      <p className="text-lg font-bold text-gray-800">{user?.points || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Users className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Membros da Família</p>
                      <p className="text-lg font-bold text-gray-800">
                        {homeData?.members?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="w-14 h-14 gradient-bg text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 animate-pulse"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        homeMembers={homeData?.members || []}
      />
    </div>
  );
}
