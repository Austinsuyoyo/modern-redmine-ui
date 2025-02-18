
import { FloatingButton } from "@/components/FloatingButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingButton />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Modern Redmine UI</h1>
        <p className="text-lg text-center text-muted-foreground">
          A modern interface for Redmine with powerful customization options.
        </p>
      </div>
    </div>
  );
};

export default Index;
