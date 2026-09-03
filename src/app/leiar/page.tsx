import AuthGuard from "@/components/AuthGuard";
import ManagerApp from "@/components/manager/ManagerApp";

export default function LeiarPage() {
  return (
    <AuthGuard role="leiar">
      <ManagerApp />
    </AuthGuard>
  );
}
