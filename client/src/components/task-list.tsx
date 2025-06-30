import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Clock, MoreHorizontal, Trophy, CheckCircle, Edit2 } from "lucide-react";
import { format, isToday, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  points: number;
  assignee: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  creator: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  completedAt?: string;
}

interface TaskListProps {
  tasks: Task[];
  currentUserId?: string;
}

export default function TaskList({ tasks, currentUserId }: TaskListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest("POST", `/api/tasks/${taskId}/complete`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Parabéns! 🎉",
        description: data.message || "Tarefa concluída com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível completar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return "Normal";
    }
  };

  const getPersonName = (person: { firstName?: string; lastName?: string; email: string }) => {
    if (person.firstName) {
      return `${person.firstName} ${person.lastName || ""}`.trim();
    }
    return person.email.split("@")[0];
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    if (isToday(date)) {
      return `Hoje, ${format(date, "HH:mm")}`;
    }
    return format(date, "dd/MM, HH:mm", { locale: ptBR });
  };

  const isOverdue = (deadline: string) => {
    return isPast(new Date(deadline)) && !isToday(new Date(deadline));
  };

  if (!tasks.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Crie sua primeira tarefa para começar a organizar sua casa!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isCompleted = task.status === "completed";
        const hasDeadline = task.deadline;
        const overdue = hasDeadline && !isCompleted && isOverdue(task.deadline!);

        return (
          <div
            key={task.id}
            className={`flex items-center p-4 rounded-xl transition-colors cursor-pointer ${
              isCompleted
                ? "bg-green-50 border border-green-200"
                : overdue
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="mr-4">
              {isCompleted ? (
                <div className="w-5 h-5 bg-green-500 border-2 border-green-500 rounded-md flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              ) : (
                <Checkbox
                  checked={false}
                  onCheckedChange={() => completeTaskMutation.mutate(task.id)}
                  disabled={completeTaskMutation.isPending}
                  className="w-5 h-5 border-2 border-gray-300 rounded-md hover:border-primary transition-colors"
                />
              )}
            </div>

            <div className="flex-1">
              <h4 className={`font-semibold ${isCompleted ? "line-through text-gray-600" : "text-gray-800"}`}>
                {task.title}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-secondary" />
                  {getPersonName(task.assignee)}
                </span>
                {hasDeadline && (
                  <span className={`flex items-center gap-1 ${overdue ? "text-red-600" : ""}`}>
                    <Clock className={`h-3 w-3 ${overdue ? "text-red-500" : "text-yellow-500"}`} />
                    {formatDeadline(task.deadline!)}
                    {overdue && " (Atrasada)"}
                  </span>
                )}
                <Badge className={`${getPriorityColor(task.priority)} text-xs font-medium`}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                {isCompleted && task.completedAt && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Concluída em {format(new Date(task.completedAt), "dd/MM/yyyy")}
                  </span>
                )}
              </div>
              {task.description && (
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <span className={`text-sm ${isCompleted ? "text-green-600 font-medium" : "text-gray-500"}`}>
                {isCompleted ? "+" : ""}{task.points} pts
              </span>
              {isCompleted && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
              {currentUserId === task.creator.id && !isCompleted && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    console.log("Edit task:", task.id);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
