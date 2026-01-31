import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// --- IMPORT HALAMAN ---
import Home from "@/pages/home";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import Editor from "@/pages/editor"; // <-- PENTING: Import halaman Editor

function Router() {
  return (
    <Switch>
      {/* Daftar Rute Website */}
      <Route path="/" component={Home} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/about" component={About} />
      
      {/* Rute Baru untuk Editor */}
      <Route path="/editor" component={Editor} /> 
      
      {/* Halaman 404 jika link tidak ditemukan */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
