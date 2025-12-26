import { rolApi } from "@/services/rol.service";

export const useRoles = () => {

    const {
        data: roles = [],
        isLoading,
        isError,
        error,
        refetch: getRoles,
    } = rolApi.useGetAll();

    return {
        getRoles,
        roles,
        isLoading,
        isError,
        error,
    };
};