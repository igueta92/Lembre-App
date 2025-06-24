import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Trophy, CheckCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-4 text-4xl md:text-5xl font-bold text-white">Lembre</h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gerencie tarefas domésticas<br />
              <span className="text-pink-100">com amor e carinho</span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Olá, bem-vindo ao Lembre! 💜 Organize sua família, distribua tarefas 
              e acompanhe o progresso de todos com gamificação e carinho.
            </p>
            
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200"
            >
              Começar Agora
            </Button>
            
            <p className="text-purple-100 mt-4 text-sm">
              Por favor, faça login para continuar.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Por que usar o Lembre?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para organizar sua casa e fortalecer os laços familiares
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Família Unida</h4>
              <p className="text-gray-600">
                Crie seu "Lar" e convide todos os membros da família para participar
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Tarefas Organizadas</h4>
              <p className="text-gray-600">
                Atribua tarefas, defina prioridades e acompanhe o progresso em tempo real
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Gamificação</h4>
              <p className="text-gray-600">
                Ganhe pontos e suba no ranking familiar completando suas tarefas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Interação Carinhosa</h4>
              <p className="text-gray-600">
                Mensagens especiais e notificações que fortalecem os laços familiares
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-bg py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-xl text-purple-100 mb-8">
            Junte-se a milhares de famílias que já usam o Lembre para 
            organizar suas casas com mais amor e menos estresse.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200"
          >
            Criar Minha Conta
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold gradient-text">Lembre</span>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Feito com 💜 para famílias que se importam
          </p>
        </div>
      </footer>
    </div>
  );
}
