import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreateTeam,
  CreateTeamSchema,
  ErrorZodResponse,
  TeamWithWebSocketEventId,
} from "../../api/schemas";
import { postTeam } from "../../api/teams";
import Button from "../Button";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsSubmitWithError: Dispatch<SetStateAction<string>>;
}

export default function CreateTeamForm({
  setIsOpen,
  setIsSubmitSuccessfull,
  setIsLoading,
  setIsSubmitWithError,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation<
    TeamWithWebSocketEventId,
    ErrorZodResponse,
    CreateTeam
  >({
    mutationFn: postTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setIsLoading(false);
      setIsSubmitSuccessfull(true);
      setIsOpen(false);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.msg || "Error with processing request";
      setIsLoading(false);
      setIsSubmitWithError(errorMessage);
      setIsOpen(true);
    },
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTeam>({
    resolver: zodResolver(CreateTeamSchema),
  });

  const onSubmit: SubmitHandler<CreateTeam> = (data) => {
    const initialData = { ...data };
    const validatedTeam = CreateTeamSchema.parse(initialData);
    mutate(validatedTeam);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="glass rounded-2xl p-6 shadow-glass dark:bg-slate-950/95 dark:border dark:border-slate-800/80 dark:backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            placeholder="Team Name"
            label="Team Name"
            {...register("teamName")}
            error={errors.teamName?.message}
          />
          <Input
            placeholder="City"
            label="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <Input
            placeholder="e.g. 1990"
            label="Founded Year"
            {...register("since")}
            error={errors.since?.message}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              Create Team
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
