import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heart, Home, Users } from "lucide-react";
import { useLocation } from "wouter";

const createHomeSchema = z.object({
  name: z.string().min(1, "Nome do lar é obrigatório").max(50, "Nome muito longo"),
});

type CreateHomeForm = z.infer<typeof createHomeSchema>;

export default function CreateHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<CreateHomeForm>({
    resolver: zodResolver(createHomeSchema),
    defaultValues: {
      name: "",
    },
  });

  const createHomeMutation = useMutation({
    mutationFn: async (data: CreateHomeForm) => {
      const response = await apiRequest("POST", "/api/homes", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message || "Lar criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o lar. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Crie Seu Primeiro Lar 🏠
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comece organizando sua família! Crie um "Lar" para agrupar todos os membros 
            e começar a gerenciar as tarefas domésticas juntos.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold">
                Criar Novo Lar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createHomeMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Lar</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Família Silva" 
                            {...field}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-bg text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    disabled={createHomeMutation.isPending}
                  >
                    {createHomeMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Criando...
                      </div>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Criar Lar
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Você será o administrador</h4>
                  <p className="text-sm text-gray-600">
                    Como criador do lar, você poderá convidar outros membros e gerenciar as configurações.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-pink-50 border-pink-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Convide sua família</h4>
                  <p className="text-sm text-gray-600">
                    Após criar o lar, você poderá convidar outros membros da família para participar.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Comece a organizar</h4>
                  <p className="text-sm text-gray-600">
                    Crie tarefas, atribua responsabilidades e acompanhe o progresso de todos!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
