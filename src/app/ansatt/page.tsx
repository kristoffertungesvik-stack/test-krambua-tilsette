import AuthGuard from "@/components/AuthGuard";
import EmployeeApp from "@/components/employee/EmployeeApp";

export default function AnsattPage() {
  return (
    <AuthGuard role="tilsett">
      <EmployeeApp />
    </AuthGuard>
  );
}
