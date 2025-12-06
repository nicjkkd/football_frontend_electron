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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto m-5"
      >
        <Input
          placeholder="Team Name"
          {...register("teamName")}
          error={errors.teamName?.message}
        ></Input>
        <Input
          placeholder="City"
          {...register("city")}
          error={errors.city?.message}
        ></Input>
        <Input
          placeholder="Created in year..."
          {...register("since")}
          error={errors.since?.message}
        ></Input>
        <Button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          disabled={isLoading}
        >
          Submit
        </Button>
        <Button
          type="button"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          onClick={handleReset}
        >
          Reset Form
        </Button>
      </form>
    </div>
  );
}
