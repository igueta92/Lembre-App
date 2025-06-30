import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeMembers: User[];
}

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Selecione um responsável"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: z.string().optional(),
  points: z.number().min(1).max(50).default(5),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

export default function CreateTaskModal({ isOpen, onClose, homeMembers }: CreateTaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      deadline: "",
      points: 5,
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: CreateTaskForm) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Tarefa criada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const getPersonName = (person: User) => {
    if (person.firstName) {
      return `${person.firstName} ${person.lastName || ""}`.trim();
    }
    return person.email.split("@")[0];
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Nova Tarefa
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createTaskMutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Tarefa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Lavar a louça" 
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atribuir para</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione um membro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {homeMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {getPersonName(member)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos (1-50)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      max="50"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes sobre a tarefa..."
                      className="rounded-xl h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createTaskMutation.isPending}
                className="flex-1 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {createTaskMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Tarefa
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
