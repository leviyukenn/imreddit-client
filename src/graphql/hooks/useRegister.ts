import { useCallback } from "react";
import {
  RegularUserFragmentDoc,
  useRegisterMutation,
} from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { toErrorMap } from "../../utils/toErrorMap";
import { MutationResult } from "../types/types";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export function useRegister() {
  const { handleMutationError } = useSnackbarAlert();
  const [register, { loading }] = useRegisterMutation({
    onError: handleMutationError,
    update(cache, { data: registerResponse }) {
      cache.modify({
        fields: {
          me() {
            if (!registerResponse?.register.user) {
              return null;
            }
            const registeredUserRef = cache.writeFragment({
              fragment: RegularUserFragmentDoc,
              data: registerResponse.register.user,
            });
            return registeredUserRef;
          },
        },
      });
    },
  });

  const onRegister = useCallback(
    async (values: RegisterFormData): Promise<MutationResult<any>> => {
      const registerResponse = await register({ variables: values });
      const registerResult = registerResponse?.data?.register;

      if (registerResult?.user) {
        return { success: true };
      }

      if (registerResult?.errors) {
        return { success: false, errors: toErrorMap(registerResult.errors) };
      }
      return { success: false };
    },
    [register]
  );

  return { onRegister, loading };
}
