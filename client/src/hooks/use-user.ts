import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

export interface User {
    id: string;
    username: string;
}

export function useUser() {
    const { toast } = useToast();

    const { data: user, isLoading, error } = useQuery<User | null, Error>({
        queryKey: ["/api/user"],
        retry: false,
    });

    const { mutateAsync: login } = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await apiRequest("POST", "/api/login", credentials);
            return await res.json();
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Logged in successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        },
    });

    const { mutateAsync: register } = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await apiRequest("POST", "/api/register", credentials);
            return await res.json();
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Registered successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        },
    });

    const { mutateAsync: logout } = useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({ title: "Logged out" });
        },
        onError: (error: any) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
    };
}
