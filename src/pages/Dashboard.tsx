import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { Target, Clock, Flame, TrendingUp, PlayCircle, BookOpen, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dados mockados
const performanceData = [
  { dia: "Dia 1", acerto: 68 },
  { dia: "Dia 5", acerto: 71 },
  { dia: "Dia 10", acerto: 73 },
  { dia: "Dia 15", acerto: 74 },
  { dia: "Dia 20", acerto: 75 },
  { dia: "Dia 25", acerto: 76 },
  { dia: "Dia 30", acerto: 76 },
];

const disciplinaData = [
  { disciplina: "Português", acerto: 92 },
  { disciplina: "Direito Constitucional", acerto: 84 },
  { disciplina: "Raciocínio Lógico", acerto: 78 },
  { disciplina: "Direito Administrativo", acerto: 68 },
  { disciplina: "Informática", acerto: 65 },
];

const radarData = [
  { topico: "Controle de Constitucionalidade", proficiencia: 85 },
  { topico: "Crase", proficiencia: 92 },
  { topico: "Estruturas de Dados", proficiencia: 78 },
  { topico: "Licitações", proficiencia: 62 },
  { topico: "Concordância Verbal", proficiencia: 88 },
  { topico: "Poderes Administrativos", proficiencia: 71 },
];

const Dashboard = () => {
  const getBarColor = (acerto: number) => {
    if (acerto >= 80) return "hsl(var(--success))";
    if (acerto >= 70) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 bg-muted/30 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header com CTAs */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard Aprova-se</h1>
                  <p className="text-muted-foreground mt-1">Acompanhe seu desempenho e evolução</p>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Iniciar Simulado
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Resolver Questões
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Revisar Erros
                  </Button>
                </div>
              </div>

              {/* KPIs Principais */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Questões</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12.450</div>
                    <p className="text-xs text-muted-foreground mt-1">Resolvidas até agora</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Acerto Geral</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">76%</div>
                    <Progress value={76} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Streak de Estudo</CardTitle>
                    <Flame className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42 dias</div>
                    <p className="text-xs text-muted-foreground mt-1">Continue assim! 🔥</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2m 35s</div>
                    <p className="text-xs text-muted-foreground mt-1">Por questão</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos Principais */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Evolução do Desempenho */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Evolução do Desempenho</CardTitle>
                    <CardDescription>Média de acerto nos últimos 30 dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="dia" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          domain={[60, 80]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="acerto" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          name="Acerto (%)"
                          dot={{ fill: "hsl(var(--primary))", r: 5 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="acerto" 
                          stroke="hsl(var(--success))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Tendência"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Desempenho por Disciplina */}
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Disciplina</CardTitle>
                    <CardDescription>Percentual de acerto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={disciplinaData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          type="number" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="disciplina" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          width={150}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }}
                        />
                        <Bar dataKey="acerto" name="Acerto (%)">
                          {disciplinaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.acerto)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Segunda linha de gráficos */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Radar de Tópicos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Radar de Tópicos</CardTitle>
                    <CardDescription>Proficiência nos tópicos mais cobrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="topico" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Radar 
                          name="Proficiência" 
                          dataKey="proficiencia" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Diagnóstico de Pontos Fracos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnóstico de Pontos Fracos</CardTitle>
                    <CardDescription>Tópicos para revisão urgente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center text-sm font-bold">1</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Licitações (Lei 14.133)</p>
                          <p className="text-xs text-muted-foreground mt-1">62% de acerto</p>
                          <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                            Revisar Questões
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-sm font-bold">2</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Informática</p>
                          <p className="text-xs text-muted-foreground mt-1">65% de acerto</p>
                          <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                            Revisar Questões
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-sm font-bold">3</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Direito Administrativo</p>
                          <p className="text-xs text-muted-foreground mt-1">68% de acerto</p>
                          <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                            Revisar Questões
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simulados e Metas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Simulados e Metas</CardTitle>
                    <CardDescription>Seu progresso rumo à aprovação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Último Simulado</span>
                        <span className="text-2xl font-bold">84/100</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Realizado há 2 dias</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Nota de Corte Alvo</span>
                        <span className="text-sm font-bold">88</span>
                      </div>
                      <Progress value={(84 / 88) * 100} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sua nota: 84</span>
                        <span>Faltam: 4 pontos</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium text-primary">Você está a 95% da sua meta! 🎯</p>
                      <p className="text-xs text-muted-foreground mt-1">Continue praticando e você vai conseguir!</p>
                    </div>

                    <Button className="w-full gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Novo Simulado
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
