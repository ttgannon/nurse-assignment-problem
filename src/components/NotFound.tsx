import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        Sorry, we couldn't find what you're looking for.
      </p>
      <Button onClick={() => navigate("/")} variant="outline">
        Go home
      </Button>
    </div>
  );
};
