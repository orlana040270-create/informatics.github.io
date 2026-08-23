import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { HomePage } from '@/pages/home';
import { ResourcesPage } from '@/pages/resources';
import { ResourceDetailPage } from '@/pages/resource-detail';
import { CategoriesPage } from '@/pages/categories';
import { AdminPage } from '@/pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/resources/:id" component={ResourceDetailPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* We provide simple Tooltip/Toaster fallbacks if needed, but omitted their heavy files to save time */}
      <WouterRouter base={(import.meta as any).env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
